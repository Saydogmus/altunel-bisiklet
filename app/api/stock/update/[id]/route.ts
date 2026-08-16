import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// PATCH /api/stock/update/[id] — Ürünün ilk varyantının stoğunu güncelle
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { stock } = await req.json()
    const qty = parseInt(String(stock ?? 0))
    const supabase = createServiceClient()

    // Mevcut varyantları çek
    const { data: variants } = await supabase
      .from('product_variants')
      .select('id, stock')
      .eq('product_id', id)
      .order('created_at', { ascending: true })

    if (variants && variants.length > 0) {
      // Varsa ilk varyantı güncelle
      const { error } = await supabase
        .from('product_variants')
        .update({ stock: qty })
        .eq('id', variants[0].id)
      if (error) throw error
    } else {
      // Varyant yoksa yeni oluştur
      const { error } = await supabase
        .from('product_variants')
        .insert({
          product_id: id,
          stock: qty,
          price_offset: 0,
          frame_size: null,
          color: null,
          sku: null,
        })
      if (error) throw error
    }

    return NextResponse.json({ success: true, stock: qty })
  } catch (err: unknown) {
    console.error('[PATCH /api/stock/update]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Stok güncellenemedi.' },
      { status: 500 }
    )
  }
}
