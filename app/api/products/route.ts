import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name,
      categoryId,
      brand,
      price,
      originalPrice,
      stock,
      description,
      sku,
      isFeatured,
      images,
      specifications,
    } = body

    if (!name || !price) {
      return NextResponse.json({ error: 'Ürün adı ve fiyat zorunludur.' }, { status: 400 })
    }

    // Service role client → RLS'yi bypass eder
    const supabase = createServiceClient()

    const slug = slugify(String(name)) + '-' + Date.now().toString(36)

    // Specifications array → JSONB objesi
    const specsObj: Record<string, string> = {}
    if (Array.isArray(specifications)) {
      specifications.forEach(({ key, value }: { key: string; value: string }) => {
        if (key?.trim()) specsObj[key.trim()] = value?.trim() ?? ''
      })
    }

    const filteredImages = Array.isArray(images)
      ? images.filter((img: string) => img?.trim() !== '')
      : []

    const payload = {
      name: String(name).trim(),
      slug,
      category_id: categoryId || null,
      brand: brand?.trim() || null,
      base_price: parseFloat(String(price)),
      original_price: originalPrice ? parseFloat(String(originalPrice)) : null,
      description: description?.trim() || null,
      sku: sku?.trim() || null,
      is_featured: Boolean(isFeatured),
      is_active: true,
      images: filteredImages,
      specifications: specsObj,
    }

    const { data: inserted, error: insertError } = await supabase
      .from('products')
      .insert(payload)
      .select('id, name, slug')
      .single()

    if (insertError) {
      console.error('[POST /api/products]', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Stok varyasyonu ekle
    const stockQty = parseInt(String(stock ?? 0))
    if (inserted && stockQty > 0) {
      await supabase.from('product_variants').insert({
        product_id: inserted.id,
        frame_size: null,
        color: null,
        stock: stockQty,
        sku: sku?.trim() ? `${sku.trim()}-V1` : null,
        price_offset: 0,
      })
    }

    return NextResponse.json({ success: true, product: inserted }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/products] unexpected:', err)
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // base_price → price normalize
  const products = (data ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    price: (p.base_price as number) ?? 0,
  }))

  return NextResponse.json(products)
}
