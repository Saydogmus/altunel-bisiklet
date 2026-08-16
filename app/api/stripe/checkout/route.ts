import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const {
      items,           // [{ name, price, quantity, image, product_id, variant_id }]
      shippingAddress, // { full_name, phone, email, address, city, district, postal_code }
      guestEmail,
    } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Sepet boş' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // 1. Supabase'de siparişi ÖNCE oluştur (pending)
    const totalAmount = items.reduce(
      (sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity,
      0
    )
    const shippingFee = totalAmount >= 2000 ? 0 : 99.90

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        guest_email: guestEmail ?? shippingAddress?.email ?? null,
        status: 'pending',
        total_amount: totalAmount + shippingFee,
        shipping_fee: shippingFee,
        shipping_address: shippingAddress ?? null,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('[Checkout] Order create failed:', orderError?.message)
      // Supabase'e yazılamasa da ödemeye devam et (degraded mode)
    }

    // 2. Sipariş kalemlerini kaydet
    if (order) {
      const orderItems = items.map((item: {
        product_id?: string
        variant_id?: string
        quantity: number
        price: number
      }) => ({
        order_id: order.id,
        product_id: item.product_id ?? null,
        variant_id: item.variant_id ?? null,
        quantity: item.quantity,
        unit_price: item.price,
      }))
      await supabase.from('order_items').insert(orderItems)
    }

    // 3. Stripe Checkout Session oluştur
    const lineItems = items.map((item: {
      name: string
      price: number
      quantity: number
      image?: string
    }) => ({
      price_data: {
        currency: 'try',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // kuruş
      },
      quantity: item.quantity,
    }))

    // Kargo ücreti satır olarak ekle (ücretsiz değilse)
    if (shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: 'try',
          product_data: { name: 'Kargo Ücreti', images: [] },
          unit_amount: Math.round(shippingFee * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/odeme/basarili?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/odeme/iptal`,
      locale: 'tr',
      customer_email: guestEmail ?? shippingAddress?.email ?? undefined,
      metadata: {
        source: 'altunel-bisiklet',
        // Webhook'un sipariş + stok güncellemesi için orderId zorunlu
        orderId: order?.id ?? '',
      },
    })

    return NextResponse.json({ url: session.url, orderId: order?.id })
  } catch (error) {
    console.error('[Checkout] Stripe error:', error)
    return NextResponse.json({ error: 'Ödeme oturumu oluşturulamadı' }, { status: 500 })
  }
}
