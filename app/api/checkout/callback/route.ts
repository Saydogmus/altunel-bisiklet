import { NextRequest, NextResponse } from 'next/server'
import { retrieveCheckoutForm } from '@/lib/iyzico'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/checkout/callback — İyzico ödeme sonucu callback.
 * İyzico ödeme tamamlandığında bu URL'e POST ile token gönderir.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const token = formData.get('token') as string

    if (!token) {
      return NextResponse.redirect(new URL('/odeme/iptal', req.url))
    }

    // İyzico'dan ödeme sonucunu sorgula
    const result = await retrieveCheckoutForm(token)

    console.log('[Callback] İyzico result status:', result.status, 'paymentStatus:', result.paymentStatus)

    const supabase = createServiceClient()
    const basketId = result.basketId

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // ── Ödeme başarılı — Siparişi güncelle ───────────────────────────────
      await supabase
        .from('orders')
        .update({
          status: 'processing',
          stripe_payment_intent_id: result.paymentId || token,
        })
        .eq('id', basketId)

      return NextResponse.redirect(
        new URL(`/odeme/basarili?order=${basketId}`, req.url)
      )
    } else {
      // ── Ödeme başarısız — Siparişi iptal et ──────────────────────────────
      if (basketId) {
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', basketId)
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
