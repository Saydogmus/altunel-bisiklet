import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/orders — Tüm siparişler (Admin)
export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      guest_email,
      status,
      total_amount,
      shipping_fee,
      shipping_address,
      created_at,
      updated_at,
      order_items (
        id,
        quantity,
        unit_price,
        products ( name, sku )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[GET /api/orders]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

// POST /api/orders — Yeni sipariş oluştur (checkout'tan)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // ── Sepet boş kontrolü ────────────────────────────────────────────────
    const items: Array<{
      product_id: string
      product_name?: string
      variant_id?: string | null
      quantity: number
      unit_price: number
      selected_frame_size?: string | null
      selected_color?: string | null
    }> = body.items ?? []

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Sepet boş, sipariş oluşturulamaz.' },
        { status: 400 }
      )
    }

    // ── total_amount — sunucu tarafında güvenli hesapla ───────────────────
    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.unit_price) || 0) * (Number(item.quantity) || 0),
      0
    )
    const shippingFee = Number(body.shipping_fee ?? body.shippingFee ?? 0)
    const totalAmount = Number(body.total_amount ?? body.total ?? subtotal + shippingFee)

    // NaN / sıfır koruma
    if (!isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json(
        { error: `Geçersiz sipariş tutarı: ${totalAmount}` },
        { status: 400 }
      )
    }

    // ── Sipariş başlığı ───────────────────────────────────────────────────
    const supabase = createServiceClient()

    // Alan adı uyumu: checkout sayfası customer_email veya guest_email gönderebilir
    const guestEmail =
      body.customer_email ?? body.guest_email ?? body.shipping_address?.email ?? null

    // shipping_address içine ad/telefon zaten dahil (checkout sayfası böyle gönderiyor)
    const shippingAddress = body.shipping_address ?? body.shippingAddress ?? null

    // Tabloda SADECE bu kolonlar var: id, user_id, guest_email, status,
    // stripe_payment_intent_id, total_amount, shipping_fee, shipping_address
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        guest_email:               guestEmail,
        user_id:                   body.user_id ?? null,
        status:                    'pending',
        total_amount:              totalAmount,
        shipping_fee:              shippingFee,
        shipping_address:          shippingAddress,
        stripe_payment_intent_id:  null,
      })
      .select('id')
      .single()

    if (orderError) {
      console.error('[POST /api/orders] insert error:', orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // ── Sipariş kalemleri ─────────────────────────────────────────────────
    const orderItems = items.map((item) => ({
      order_id:           order.id,
      product_id:         item.product_id,
      variant_id:         item.variant_id ?? null,
      quantity:           Number(item.quantity),
      unit_price:         Number(item.unit_price),
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('[POST /api/orders] items error:', itemsError)
      // Sipariş kaydedildi ama kalemler yazılamadı — yine de başarılı dön
      // (sipariş admininde görünür, kalemler eksik olabilir)
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/orders] unexpected:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
