import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'

// Sipariş tamamlandığında stokları düşür
async function decrementStock(orderId: string) {
  const supabase = createServiceClient()

  // Sipariş kalemlerini çek
  const { data: items, error } = await supabase
    .from('order_items')
    .select('product_id, variant_id, quantity')
    .eq('order_id', orderId)

  if (error || !items?.length) {
    console.error('[Webhook] order_items çekilemedi:', error?.message)
    return
  }

  for (const item of items) {
    if (item.variant_id) {
      // Varyasyon bazlı stok düşür
      const { data: variant } = await supabase
        .from('product_variants')
        .select('stock')
        .eq('id', item.variant_id)
        .single()

      if (variant) {
        const newStock = Math.max(0, variant.stock - item.quantity)
        await supabase
          .from('product_variants')
          .update({ stock: newStock })
          .eq('id', item.variant_id)
        console.log(`[Webhook] Stok düşüldü — variant ${item.variant_id}: ${variant.stock} → ${newStock}`)
      }
    } else {
      // Varyasyon yoksa ürünün ilk varyasyonunu güncelle
      const { data: variants } = await supabase
        .from('product_variants')
        .select('id, stock')
        .eq('product_id', item.product_id)
        .order('stock', { ascending: false })
        .limit(1)

      if (variants?.length) {
        const v = variants[0]
        const newStock = Math.max(0, v.stock - item.quantity)
        await supabase
          .from('product_variants')
          .update({ stock: newStock })
          .eq('id', v.id)
        console.log(`[Webhook] Stok düşüldü — product ${item.product_id}: ${v.stock} → ${newStock}`)
      }
    }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature') ?? ''

  // Stripe env yoksa sadece OK dön (test ortamı)
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('[Webhook] Stripe env vars not set, skipping')
    return NextResponse.json({ received: true })
  }

  let event: {
    type: string
    data: { object: Record<string, unknown> }
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    ) as unknown as typeof event
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  switch (event.type) {
    // ─── Ödeme başarılı (Stripe Checkout) ──────────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as {
        id: string
        payment_intent?: string
        metadata?: { orderId?: string }
        customer_email?: string
        amount_total?: number
      }

      const orderId = session.metadata?.orderId
      const paymentIntentId = session.payment_intent ?? session.id

      if (orderId) {
        // 1. Siparişi 'paid' yap
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            stripe_payment_intent_id: paymentIntentId,
          })
          .eq('id', orderId)

        if (error) {
          console.error('[Webhook] Order update failed:', error.message)
        } else {
          console.log(`[Webhook] Order ${orderId} marked as paid ✓`)
          // 2. Stokları düşür
          await decrementStock(orderId)
        }
      } else if (paymentIntentId) {
        // orderId yoksa payment_intent ile ara
        const { data: order } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .single()

        if (order) {
          await supabase.from('orders').update({ status: 'paid' }).eq('id', order.id)
          await decrementStock(order.id)
          console.log(`[Webhook] Order ${order.id} marked as paid via payment_intent ✓`)
        }
      }
      break
    }

    // ─── Payment Intent başarılı ────────────────────────────────────────────
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as { id: string }
      const { data: order } = await supabase
        .from('orders')
        .select('id, status')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single()

      // Sadece hâlâ 'pending' olanları güncelle (duplicate event koruması)
      if (order && order.status === 'pending') {
        await supabase.from('orders').update({ status: 'paid' }).eq('id', order.id)
        await decrementStock(order.id)
        console.log(`[Webhook] payment_intent.succeeded → ${order.id} paid + stok düşüldü ✓`)
      }
      break
    }

    // ─── Ödeme başarısız ────────────────────────────────────────────────────
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as { id: string }
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .eq('status', 'pending')

      console.log(`[Webhook] Payment failed: ${paymentIntent.id}`)
      break
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
