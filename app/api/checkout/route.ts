import { NextRequest, NextResponse } from 'next/server'
import { initializeCheckoutForm } from '@/lib/iyzico'

/**
 * POST /api/checkout — İyzico Checkout Form başlatır.
 *
 * Sipariş bu aşamada Supabase'e KAYDEDİLMEZ.
 * Ödeme başarılı olursa callback rotası siparişi kaydeder.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ── Sepet doğrulama ───────────────────────────────────────────────────
    const items: Array<{
      product_id: string
      product_name: string
      quantity: number
      unit_price: number
      category?: string
    }> = body.items ?? []

    if (items.length === 0) {
      return NextResponse.json({ error: 'Sepet boş, ödeme başlatılamaz.' }, { status: 400 })
    }

    // ── Tutar hesaplama ───────────────────────────────────────────────────
    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.unit_price) || 0) * (Number(item.quantity) || 0),
      0
    )
    const shippingFee = Number(body.shipping_fee ?? 0)
    const totalAmount = subtotal + shippingFee

    if (!isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json({ error: `Geçersiz sipariş tutarı: ${totalAmount}` }, { status: 400 })
    }

    // ── Türkçe karakter sanitize — iyzico ASCII gerektirir ────────────────
    const toAscii = (s: string): string =>
      (s || '')
        .replace(/ş/g, 's').replace(/Ş/g, 'S')
        .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
        .replace(/ı/g, 'i').replace(/İ/g, 'I')
        .replace(/ö/g, 'o').replace(/Ö/g, 'O')
        .replace(/ü/g, 'u').replace(/Ü/g, 'U')
        .replace(/ç/g, 'c').replace(/Ç/g, 'C')
        .replace(/[–—]/g, '-') // Özel tireleri normal tire yap

    // ── Basket items ──────────────────────────────────────────────────────
    const basketItems = items.map((item, idx) => ({
      id: (item.product_id || `ITEM_${idx}`).substring(0, 30),
      name: toAscii(item.product_name || 'Urun').substring(0, 50),
      category1: toAscii(item.category || 'Bisiklet').substring(0, 50),
      itemType: 'PHYSICAL',
      price: Number((Number(item.unit_price) * Number(item.quantity)).toFixed(2)),
    }))

    if (shippingFee > 0) {
      basketItems.push({
        id: 'KARGO',
        name: 'Kargo Ucreti',
        category1: 'Kargo',
        itemType: 'PHYSICAL',
        price: Number(shippingFee.toFixed(2)),
      })
    }

    // ── Buyer bilgileri ───────────────────────────────────────────────────
    const buyerName  = body.shipping_address?.full_name || 'Misafir'
    const nameParts  = buyerName.trim().split(/\s+/)
    const firstName  = toAscii(nameParts[0] || 'Misafir').substring(0, 30)
    const lastName   = toAscii(nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0]).substring(0, 30)
    const guestEmail = body.customer_email ?? body.shipping_address?.email ?? null
    const buyerEmail = (guestEmail || 'misafir@altunelbisiklet.com').substring(0, 100)
    const postalCode = body.shipping_address?.postal_code || '34000'

    // Telefon normalize: +905375597600 / 05375597600 / 5375597600 → +905375597600
    const rawPhone   = (body.shipping_address?.phone || '05000000000').replace(/\D/g, '')
    const localPhone = rawPhone.startsWith('90') ? rawPhone.slice(2)
                     : rawPhone.startsWith('0')  ? rawPhone.slice(1)
                     : rawPhone
    const gsmNumber  = `+90${localPhone.substring(0, 10)}`

    // Adres alanları — tümü ASCII
    const safeCity    = toAscii(body.shipping_address?.city || 'Istanbul').substring(0, 30)
    const safeAddress = toAscii([
      body.shipping_address?.address,
      body.shipping_address?.district,
      body.shipping_address?.city,
    ].filter(Boolean).join(', ') || 'Belirtilmedi').substring(0, 300)
    const safeContact = toAscii(buyerName).trim().substring(0, 50)

    // IP adresini al
    const rawIp = req.headers.get('x-forwarded-for') || req.ip || '85.34.78.112'
    const buyerIp = rawIp.split(',')[0].trim()

    // ── App URL & Conversation ID ─────────────────────────────────────────

    const conversationId = `CHK${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`.substring(0, 30)
    const basketId = conversationId

    // Kargo dahil tüm ürünlerin (basketItems) iyzico fiyat toplamı 
    // Nokta atışı eşleşmesi için doğrudan string fiyatları toplayarak garantiliyoruz
    const calculatedTotal = Number(basketItems.reduce((s, i) => s + Number(i.price), 0).toFixed(2))

    // ── Vercel logları için tam payload ───────────────────────────────────
    console.log('═══ [IYZICO REQUEST] ══════════════════════════════')
    console.log(JSON.stringify({
      conversationId,
      price: calculatedTotal,
      paidPrice: calculatedTotal,
      currency: 'TRY',
      basketId,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/callback`,
      buyer: {
        id: (body.user_id || `GUEST_${conversationId}`).substring(0, 30),
        name: firstName,
        surname: lastName,
        gsmNumber,
        email: buyerEmail,
        identityNumber: (body.shipping_address?.tc_no || '89813371224').substring(0, 11),
        registrationAddress: safeAddress,
        ip: buyerIp,
        city: safeCity,
        country: 'Turkey',
        zipCode: postalCode,
      },
      shippingAddress: { contactName: safeContact, city: safeCity, country: 'Turkey', address: safeAddress, zipCode: postalCode },
      billingAddress:  { contactName: safeContact, city: safeCity, country: 'Turkey', address: safeAddress, zipCode: postalCode },
      basketItems,
      basketItemsTotal: basketItems.reduce((s, i) => s + Number(i.price), 0).toFixed(2),
    }, null, 2))
    console.log('═══════════════════════════════════════════════════')

    // ── İyzico API çağrısı ────────────────────────────────────────────────
    const result = await initializeCheckoutForm({
      conversationId,
      price: calculatedTotal,
      paidPrice: calculatedTotal,
      basketId,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/callback`,
      buyer: {
        id: (body.user_id || `GUEST_${conversationId}`).substring(0, 30),
        name: firstName,
        surname: lastName,
        gsmNumber,
        email: buyerEmail,
        identityNumber: (body.shipping_address?.tc_no || '89813371224').substring(0, 11),
        registrationAddress: safeAddress,
        ip: buyerIp,
        city: safeCity,
        country: 'Turkey',
        zipCode: postalCode,
      },
      shippingAddress: { contactName: safeContact, city: safeCity, country: 'Turkey', address: safeAddress, zipCode: postalCode },
      billingAddress:  { contactName: safeContact, city: safeCity, country: 'Turkey', address: safeAddress, zipCode: postalCode },
      basketItems,
    })

    // ── İyzico yanıtı ─────────────────────────────────────────────────────
    console.log('═══ [IYZICO RESPONSE] ═════════════════════════════')
    console.log(JSON.stringify({
      status:         result.status,
      errorCode:      result.errorCode,
      errorMessage:   result.errorMessage,
      errorGroup:     result.errorGroup,
      token:          result.token ? result.token.substring(0, 20) + '...' : null,
      formContentLen: result.checkoutFormContent?.length || 0,
    }, null, 2))
    console.log('═══════════════════════════════════════════════════')

    if (result.status !== 'success') {
      const detail = [
        result.errorCode  ? `[${result.errorCode}]`  : null,
        result.errorMessage || null,
        result.errorGroup ? `(${result.errorGroup})` : null,
      ].filter(Boolean).join(' ')
      const errorMsg = detail || 'İyzico ödeme formu başlatılamadı. Lütfen tekrar deneyin.'
      console.error('[IYZICO ERROR] Tam yanıt:', JSON.stringify(result, null, 2))
      return NextResponse.json({ error: errorMsg, iyzicoResult: result }, { status: 400 })
    }

    // ── Geçici sipariş kaydı (awaiting_payment) ───────────────────────────
    const { createServiceClient } = await import('@/lib/supabase/server')
    const supabase = createServiceClient()

    await supabase
      .from('orders')
      .insert({
        guest_email:              guestEmail,
        user_id:                  body.user_id ?? null,
        status:                   'awaiting_payment',
        total_amount:             totalAmount,
        shipping_fee:             shippingFee,
        shipping_address:         body.shipping_address ?? null,
        stripe_payment_intent_id: result.token,
      })
      .select('id')
      .single()
      .then(async ({ data: tempOrder }) => {
        if (tempOrder) {
          const orderItems = items.map((item) => ({
            order_id:   tempOrder.id,
            product_id: item.product_id,
            variant_id: null,
            quantity:   Number(item.quantity),
            unit_price: Number(item.unit_price),
          }))
          await supabase.from('order_items').insert(orderItems)
        }
      })

    return NextResponse.json({
      success:             true,
      checkoutFormContent: result.checkoutFormContent,
      token:               result.token,
    })
  } catch (err: any) {
    console.error('[CHECKOUT] Beklenmedik hata:', err)
    return NextResponse.json({ error: err?.message || 'Sunucu hatası' }, { status: 500 })
  }
}
