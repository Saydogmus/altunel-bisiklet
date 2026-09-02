import { NextRequest, NextResponse } from 'next/server'
import { retrieveCheckoutForm } from '@/lib/iyzico'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/checkout/callback — İyzico ödeme sonucu callback.
 * 
 * İyzico ödeme tamamlandığında bu URL'e POST ile token gönderir.
 * Token ile ödeme sonucu sorgulanır.
 * Başarılıysa → awaiting_payment siparişi "processing" yapılır.
 * Başarısızsa → awaiting_payment siparişi "cancelled" yapılır.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const token = formData.get('token') as string

    if (!token) {
      console.error('[Callback] Token bulunamadı')
      return NextResponse.redirect(new URL('/odeme/iptal?error=Token%20bulunamad%C4%B1', req.url))
    }

    // İyzico'dan ödeme sonucunu sorgula
    const result = await retrieveCheckoutForm(token)

    console.log('[Callback] İyzico status:', result.status, 'paymentStatus:', result.paymentStatus)

    const supabase = createServiceClient()

    // Token ile eşleşen awaiting_payment siparişi bul
    const { data: pendingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', token)
      .eq('status', 'awaiting_payment')
      .single()

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // ── Ödeme başarılı ───────────────────────────────────────────────────
      if (pendingOrder) {
        await supabase
          .from('orders')
          .update({
            status: 'processing',
            stripe_payment_intent_id: result.paymentId || token,
          })
          .eq('id', pendingOrder.id)

        return NextResponse.redirect(
          new URL(`/odeme/basarili?order=${pendingOrder.id}`, req.url)
        )
      } else {
        // Token eşleşen sipariş bulunamazsa bile başarılı sayfasına yönlendir
        console.warn('[Callback] Ödeme başarılı ama eşleşen sipariş bulunamadı. Token:', token)
        return NextResponse.redirect(new URL('/odeme/basarili', req.url))
      }
    } else {
      // ── Ödeme başarısız ──────────────────────────────────────────────────
      if (pendingOrder) {
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', pendingOrder.id)
      }

      const errorMsg = encodeURIComponent(result.errorMessage || 'Ödeme başarısız oldu.')
      return NextResponse.redirect(
        new URL(`/odeme/iptal?error=${errorMsg}`, req.url)
      )
    }
  } catch (err: any) {
    console.error('[Callback] Unexpected error:', err)
    return NextResponse.redirect(
      new URL('/odeme/iptal?error=Beklenmeyen%20bir%20hata%20olu%C5%9Ftu', req.url)
    )
  }
}
