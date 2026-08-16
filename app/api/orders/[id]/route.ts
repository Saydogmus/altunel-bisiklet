import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET /api/orders/[id] — Sipariş detayı
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
        variant_id,
        products ( id, name, sku, images )
      )
    `)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH /api/orders/[id] — Sipariş durumunu güncelle
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { status } = await req.json()
    if (!status) return NextResponse.json({ error: 'status gerekli' }, { status: 400 })

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
