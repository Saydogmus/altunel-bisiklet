import { NextRequest, NextResponse } from 'next/server'
import { retrieveCheckoutForm } from '@/lib/iyzico'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/checkout/callback — İyzico ödeme sonucu callback.
 *
 * İyzico, ödeme tamamlandığında bu URL'e application/x-www-form-urlencoded
 * formatında POST gönderir (JSON değil). İki yöntemle parse edilir:
 * 1. req.formData() — modern Next.js App Router
 * 2. raw text parse — form-urlencoded fallback
 */
export async function POST(req: NextRequest) {
  // Yönlendirme için sabit site URL'si (req.url kullanmak hatalı yönlendirmeye yol açar)
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

  let token: string | null = null

  try {
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('application/x-www-form-urlencoded')) {
      // İyzico'nun gönderdiği format: form-urlencoded
      const rawText = await req.text()
      const params = new URLSearchParams(rawText)
      token = params.get('token')
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/form-data')) {
      // Multipart form fallback
      const formData = await req.formData()
      token = formData.get('token') as string | null
    } else {
      // Son çare: her iki yöntemi dene
      try {
        const rawText = await req.text()
        const params = new URLSearchParams(rawText)
        token = params.get('token')
      } catch {
        const formData = await req.formData()
        token = formData.get('token') as string | null
      }
    }

    console.log('[Callback] Content-Type:', contentType, '| Token:', token ? token.substring(0, 20) + '...' : 'YOK')

    if (!token) {
      console.error('[Callback] Token bulunamadı')
      return NextResponse.redirect(`${siteUrl}/odeme/iptal?error=Token%20bulunamad%C4%B1`)
    }

    // İyzico'dan ödeme sonucunu sorgula
    const result = await retrieveCheckoutForm(token)

    console.log('[Callback] İyzico status:', result.status, '| paymentStatus:', result.paymentStatus, '| errorCode:', result.errorCode)

    const supabase = createServiceClient()

    // Token ile eşleşen awaiting_payment siparişi bul
    const { data: pendingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', token)
      .eq('status', 'awaiting_payment')
      .maybeSingle()

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

        return NextResponse.redirect(`${siteUrl}/odeme/basarili?order=${pendingOrder.id}`)
      } else {
        console.warn('[Callback] Ödeme başarılı ama eşleşen sipariş bulunamadı. Token:', token)
        return NextResponse.redirect(`${siteUrl}/odeme/basarili`)
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
      console.error('[Callback] Ödeme başarısız. Hata:', result.errorMessage, '| Kod:', result.errorCode)
      return NextResponse.redirect(`${siteUrl}/odeme/iptal?error=${errorMsg}`)
    }
  } catch (err: any) {
    console.error('[Callback] Beklenmeyen hata:', err?.message || err)
    return NextResponse.redirect(`${siteUrl}/odeme/iptal?error=Beklenmeyen%20bir%20hata%20olu%C5%9Ftu`)
  }
}
