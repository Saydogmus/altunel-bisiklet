import { NextRequest, NextResponse } from 'next/server'
import { retrieveCheckoutForm, confirmThreedsPayment } from '@/lib/iyzico'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * POST /api/checkout/callback — İyzico ödeme sonucu callback.
 *
 * İyzico forceThreeDS:1 ile Checkout Form kullandığında TWO-STEP akış çalışır:
 *
 * ADIM 1 (Banka → Bizim callback):
 *   Banka 3DS onayı sonrası callbackUrl'e paymentId + conversationData gönderir.
 *   → confirmThreedsPayment(paymentId) çağrılarak ödeme tamamlanır.
 *
 * ADIM 2 (Checkout Form retrieve — token varsa):
 *   Sadece token ile ödeme sorgulanır (3DS'siz checkout form akışında kullanılır).
 *
 * Her iki akış da desteklenir.
 * Supabase hatası ödeme alındıysa sistemi çökertemez.
 * Tüm teknik hata detayları URL parametresinde iletilir.
 */
export async function POST(req: NextRequest) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

  // ── 1. Form verisini parse et (application/x-www-form-urlencoded) ───────
  let params: URLSearchParams
  try {
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const rawText = await req.text()
      params = new URLSearchParams(rawText)
    } else {
      // Fallback: formData
      const formData = await req.formData()
      params = new URLSearchParams()
      formData.forEach((value, key) => {
        params.set(key, value.toString())
      })
    }
  } catch (parseErr: any) {
    console.error('[Callback] Form parse hatası:', parseErr?.message)
    return NextResponse.redirect(
      `${siteUrl}/odeme/iptal?detay=${encodeURIComponent('form_parse_hatasi:' + (parseErr?.message || 'bilinmiyor'))}`
    )
  }

  const paymentId       = params.get('paymentId') || ''
  const token           = params.get('token') || ''
  const conversationData = params.get('conversationData') || ''
  const conversationId  = params.get('conversationId') || ''
  const status          = params.get('status') || ''

  console.log('[Callback] Gelen params → paymentId:', paymentId, '| token:', token ? token.substring(0, 15) + '...' : 'YOK', '| status:', status)

  // ── 2. İyzico ile ödeme sonucunu doğrula ──────────────────────────────────
  let paymentResult: any

  try {
    if (paymentId) {
      // ADIM 1 — 3DS ikinci onay (forceThreeDS:1 akışı)
      console.log('[Callback] paymentId mevcut → confirmThreedsPayment çağrılıyor')
      paymentResult = await confirmThreedsPayment({ paymentId, conversationData, conversationId })
    } else if (token) {
      // ADIM 2 — Checkout Form token sorgulama (3DS'siz akış)
      console.log('[Callback] token mevcut → retrieveCheckoutForm çağrılıyor')
      paymentResult = await retrieveCheckoutForm(token)
    } else {
      console.error('[Callback] Ne paymentId ne token geldi — params:', params.toString())
      return NextResponse.redirect(
        `${siteUrl}/odeme/iptal?detay=${encodeURIComponent('odeme_parametresi_eksik')}`
      )
    }
  } catch (iyzicoErr: any) {
    console.error('[Callback] İyzico API hatası:', iyzicoErr?.message)
    return NextResponse.redirect(
      `${siteUrl}/odeme/iptal?detay=${encodeURIComponent('iyzico_api_hatasi:' + (iyzicoErr?.message || 'bilinmiyor'))}`
    )
  }

  console.log('[Callback] İyzico sonuç → status:', paymentResult?.status, '| paymentStatus:', paymentResult?.paymentStatus, '| errorCode:', paymentResult?.errorCode, '| errorMessage:', paymentResult?.errorMessage)

  const isSuccess =
    paymentResult?.status === 'success' &&
    (paymentResult?.paymentStatus === 'SUCCESS' || paymentResult?.paymentStatus === 'INIT_THREEDS')

  // ── 3. Supabase sipariş güncelleme (hata olursa çökmez) ──────────────────
  let orderId: string | null = null

  try {
    const supabase = createServiceClient()

    // Token veya paymentId ile eşleşen awaiting_payment siparişini bul
    const lookupToken = token || paymentId
    const { data: pendingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', lookupToken)
      .eq('status', 'awaiting_payment')
      .maybeSingle()

    orderId = pendingOrder?.id || null

    if (isSuccess) {
      if (orderId) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'processing',
            stripe_payment_intent_id: paymentResult?.paymentId || paymentId || token,
          })
          .eq('id', orderId)

        if (updateError) {
          console.error('[Callback] Supabase sipariş güncelleme hatası (ödeme alındı, sipariş güncellenemedi):', updateError.message)
          // Ödeme alındı ama DB güncellenemedi → başarılı sayfasına git ama log tut
        } else {
          console.log('[Callback] Sipariş güncellendi → processing. ID:', orderId)
        }
      } else {
        console.warn('[Callback] Ödeme başarılı ama eşleşen awaiting_payment siparişi bulunamadı. token/paymentId:', lookupToken)
      }
    } else {
      if (orderId) {
        await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId)
          .then(({ error }) => {
            if (error) console.error('[Callback] Sipariş iptal güncellemesi başarısız:', error.message)
          })
      }
    }
  } catch (dbErr: any) {
    console.error('[Callback] Supabase kritik hata:', dbErr?.message)
    // DB tamamen çökmüş — eğer ödeme alındıysa yine de başarılı sayfasına git
    if (isSuccess) {
      console.error('[Callback] UYARI: Ödeme alındı ama DB kaydedilemedi! paymentId:', paymentId, '| token:', token)
      return NextResponse.redirect(
        `${siteUrl}/odeme/basarili?detay=${encodeURIComponent('odeme_alindi_db_hatasi')}`
      )
    }
    return NextResponse.redirect(
      `${siteUrl}/odeme/iptal?detay=${encodeURIComponent('veritabani_hatasi:' + (dbErr?.message || 'bilinmiyor'))}`
    )
  }

  // ── 4. Kullanıcıyı yönlendir ─────────────────────────────────────────────
  if (isSuccess) {
    const successUrl = orderId
      ? `${siteUrl}/odeme/basarili?order=${orderId}`
      : `${siteUrl}/odeme/basarili`
    return NextResponse.redirect(successUrl)
  } else {
    const errorDetail = paymentResult?.errorCode
      ? `${paymentResult.errorCode}:${paymentResult.errorMessage || 'odeme_reddedildi'}`
      : (paymentResult?.errorMessage || 'odeme_basarisiz')
    return NextResponse.redirect(
      `${siteUrl}/odeme/iptal?detay=${encodeURIComponent(errorDetail)}`
    )
  }
}
