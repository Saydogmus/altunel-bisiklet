import { NextRequest, NextResponse } from 'next/server'
import { initializeCheckoutForm } from '@/lib/iyzico'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/checkout — İyzico Checkout Form başlatır.
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

    // ── Supabase'de "pending" sipariş oluştur ──────────────────────────────
    const supabase = createServiceClient()
    const guestEmail = body.customer_email ?? body.shipping_address?.email ?? null
    const shippingAddress = body.shipping_address ?? null

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        guest_email: guestEmail,
        user_id: body.user_id ?? null,
        status: 'pending',
        total_amount: totalAmount,
        shipping_fee: shippingFee,
        shipping_address: shippingAddress,
        stripe_payment_intent_id: null,
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('[POST /api/checkout] order insert error:', orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // ── Sipariş kalemlerini kaydet ─────────────────────────────────────────
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: null,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    }))

    await supabase.from('order_items').insert(orderItems)

    // ── İyzico Checkout Form başlat ────────────────────────────────────────
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const conversationId = order.id.replace(/-/g, '').substring(0, 30)

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
    const buyerEmail = guestEmail || 'misafir@altunelbisiklet.com'

    const fullAddress = [
      body.shipping_address?.address,
      body.shipping_address?.district,
      body.shipping_address?.city,
    ].filter(Boolean).join(', ') || 'Belirtilmedi'

    const result = await initializeCheckoutForm({
      conversationId,
      price: totalAmount.toFixed(2),
      paidPrice: totalAmount.toFixed(2),
      basketId: order.id.substring(0, 30),
      callbackUrl: `${appUrl}/api/checkout/callback`,
      buyer: {
        id: (body.user_id || `GUEST_${conversationId}`).substring(0, 30),
        name: firstName.substring(0, 30),
        surname: lastName.substring(0, 30),
        gsmNumber: `+90${buyerPhone.replace(/\D/g, '').replace(/^0/, '').substring(0, 10)}`,
        email: buyerEmail.substring(0, 100),
        identityNumber: '11111111111',
        registrationAddress: fullAddress.substring(0, 300),
        ip: '85.34.78.112',
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
      // Siparişi sil (ödeme başlatılamadı)
      await supabase.from('order_items').delete().eq('order_id', order.id)
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: result.errorMessage || 'İyzico ödeme formu başlatılamadı.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
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
