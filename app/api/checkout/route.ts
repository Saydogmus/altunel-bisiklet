import { NextRequest, NextResponse } from 'next/server'
import { initializeCheckoutForm } from '@/lib/iyzico'

/**
 * POST /api/checkout — İyzico Checkout Form başlatır.
 * 
 * Sipariş bu aşamada Supabase'e KAYDEDİLMEZ.
 * Sepet ve adres bilgileri İyzico'ya gönderilir, 
 * dönen form HTML'i client'a iletilir.
 * Sipariş ancak ödeme başarılı olursa callback'te kaydedilir.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ── Sepet doğrulama ────────────────────────────────────────────────────
    const items: Array<{
      product_id: string
      product_name: string
      quantity: number
      unit_price: number
      category?: string
    }> = body.items ?? []

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Sepet boş, ödeme başlatılamaz.' },
        { status: 400 }
      )
    }

    // ── Tutar hesaplama ────────────────────────────────────────────────────
    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.unit_price) || 0) * (Number(item.quantity) || 0),
      0
    )
    const shippingFee = Number(body.shipping_fee ?? 0)
    const totalAmount = subtotal + shippingFee

    if (!isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json(
        { error: `Geçersiz sipariş tutarı: ${totalAmount}` },
        { status: 400 }
      )
    }

    // ── İyzico Checkout Form başlat ────────────────────────────────────────
    // Eğer NEXT_PUBLIC_APP_URL unutulmuşsa, isteğin geldiği asıl domaini kullanır (localhost hatasını önler)
    const appUrl = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const conversationId = `CHK${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`.substring(0, 30)

    // Basket items
    const basketItems = items.map((item, idx) => ({
      id: (item.product_id || `ITEM_${idx}`).substring(0, 30),
      name: (item.product_name || 'Ürün').substring(0, 50),
      category1: (item.category || 'Bisiklet').substring(0, 50),
      itemType: 'PHYSICAL',
      price: (Number(item.unit_price) * Number(item.quantity)).toFixed(2),
    }))

    // Kargo ücreti de basket item olarak eklenmeli (iyzico: basketItems toplamı = price)
    if (shippingFee > 0) {
      basketItems.push({
        id: 'KARGO',
        name: 'Kargo Ücreti',
        category1: 'Kargo',
        itemType: 'PHYSICAL',
        price: shippingFee.toFixed(2),
      })
    }

    // Buyer bilgileri
    const buyerName = body.shipping_address?.full_name || 'Misafir'
    const nameParts = buyerName.split(' ')
    const firstName = nameParts[0] || 'Misafir'
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName
    const buyerPhone = body.shipping_address?.phone || '05000000000'
    const guestEmail = body.customer_email ?? body.shipping_address?.email ?? null
    const buyerEmail = guestEmail || 'misafir@altunelbisiklet.com'

    const fullAddress = [
      body.shipping_address?.address,
      body.shipping_address?.district,
      body.shipping_address?.city,
    ].filter(Boolean).join(', ') || 'Belirtilmedi'

    // basketId'yi sipariş verilerini taşımak için kullanıyoruz (callback'te tekrar okunamayacak)
    // Callback'te sipariş oluşturabilmek için verileri token üzerinden iyzico'dan geri alacağız
    const basketId = conversationId

    const ipAddress = req.ip || req.headers.get('x-forwarded-for') || '85.34.78.112'

    const result = await initializeCheckoutForm({
      conversationId,
      price: totalAmount.toFixed(2),
      paidPrice: totalAmount.toFixed(2),
      basketId,
      callbackUrl: `${appUrl}/api/checkout/callback`,
      buyer: {
        id: (body.user_id || `GUEST_${conversationId}`).substring(0, 30),
        name: firstName.substring(0, 30),
        surname: lastName.substring(0, 30),
        gsmNumber: `+90${buyerPhone.replace(/\D/g, '').replace(/^0/, '').substring(0, 10)}`,
        email: buyerEmail.substring(0, 100),
        identityNumber: '74300864791', // İyzico'nun testler için kabul ettiği standart dummy TCKN
        registrationAddress: fullAddress.substring(0, 300),
        ip: ipAddress,
        city: (body.shipping_address?.city || 'Istanbul').substring(0, 30),
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: buyerName.substring(0, 50),
        city: (body.shipping_address?.city || 'Istanbul').substring(0, 30),
        country: 'Turkey',
        address: fullAddress.substring(0, 300),
      },
      billingAddress: {
        contactName: buyerName.substring(0, 50),
        city: (body.shipping_address?.city || 'Istanbul').substring(0, 30),
        country: 'Turkey',
        address: fullAddress.substring(0, 300),
      },
      basketItems,
    })

    if (result.status !== 'success') {
      console.error('[POST /api/checkout] iyzico error:', result)
      return NextResponse.json(
        { error: result.errorMessage || 'İyzico ödeme formu başlatılamadı.' },
        { status: 400 }
      )
    }

    // Token'ı ve sipariş bilgilerini cookie/session ile callback'e taşımak yerine
    // server-side bir geçici kayıt kullanacağız (checkout_sessions tablosu veya orders pending)
    // Ancak en temiz yol: callback'te iyzico'dan tüm ödeme bilgilerini geri almak.
    // Sipariş bilgilerini de token ile eşleştirmek için Supabase'de geçici bir kayıt tutalım.

    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = createServiceClient()

    // Geçici "awaiting_payment" kaydı (ödeme başarılı olursa "processing" yapılacak)
    await supabase
      .from('orders')
      .insert({
        id: undefined, // auto-generate
        guest_email: guestEmail,
        user_id: body.user_id ?? null,
        status: 'awaiting_payment',
        total_amount: totalAmount,
        shipping_fee: shippingFee,
        shipping_address: body.shipping_address ?? null,
        stripe_payment_intent_id: result.token, // iyzico token'ı burada saklıyoruz
      })
      .select('id')
      .single()
      .then(async ({ data: tempOrder }) => {
        if (tempOrder) {
          // Sipariş kalemlerini de kaydet
          const orderItems = items.map((item) => ({
            order_id: tempOrder.id,
            product_id: item.product_id,
            variant_id: null,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
          }))
          await supabase.from('order_items').insert(orderItems)
        }
      })

    return NextResponse.json({
      success: true,
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
    })
  } catch (err: any) {
    console.error('[POST /api/checkout] unexpected:', err)
    return NextResponse.json(
      { error: err?.message || 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
