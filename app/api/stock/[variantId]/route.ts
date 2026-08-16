import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// PATCH /api/stock/[variantId] — Varyasyon stoğunu güncelle
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  const { variantId } = await params
  try {
    const { stock } = await req.json()
    if (typeof stock !== 'number' || stock < 0) {
      return NextResponse.json({ error: 'Geçersiz stok değeri' }, { status: 400 })
    }
    const supabase = createServiceClient()
    const { error } = await supabase
      .from('product_variants')
      .update({ stock })
      .eq('id', variantId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
