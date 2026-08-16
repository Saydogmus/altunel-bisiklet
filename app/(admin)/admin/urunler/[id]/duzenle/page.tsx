'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, Plus, Trash2,
  CheckCircle, AlertCircle, Loader2,
} from 'lucide-react'
import type { Category } from '@/types'
import MultiImageUploader from '@/components/admin/MultiImageUploader'

type AlertState = { type: 'success' | 'error'; message: string } | null

interface Variant {
  id?: string
  frame_size: string | null
  color: string | null
  stock: number
  sku: string | null
  price_offset: number
}

interface ProductData {
  id: string
  name: string
  slug: string
  brand: string | null
  sku: string | null
  description: string | null
  base_price: number
  original_price: number | null
  category_id: string | null
  is_featured: boolean
  is_active: boolean
  images: string[]
  specifications: Record<string, string>
  product_variants: Variant[]
}

export default function UrunDuzenle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<AlertState>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    brand: '',
    price: '',
    originalPrice: '',
    stock: '0',
    description: '',
    sku: '',
    isFeatured: false,
    isActive: true,
    images: [] as string[],
    specifications: [{ key: '', value: '' }] as { key: string; value: string }[],
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${id}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([product, cats]: [ProductData, Category[]]) => {
      const stock = product.product_variants?.reduce((s, v) => s + (v.stock ?? 0), 0) ?? 0

      const specs = product.specifications
        ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
        : []

      // images array — boş stringleri filtrele
      const images = Array.isArray(product.images)
        ? product.images.filter(Boolean)
        : []

      setFormData({
        name: product.name ?? '',
        categoryId: product.category_id ?? '',
        brand: product.brand ?? '',
        price: String(product.base_price ?? ''),
        originalPrice: product.original_price ? String(product.original_price) : '',
        stock: String(stock),
        description: product.description ?? '',
        sku: product.sku ?? '',
        isFeatured: product.is_featured ?? false,
        isActive: product.is_active ?? true,
        images,
        specifications: specs.length > 0 ? specs : [{ key: '', value: '' }],
      })

      setCategories(Array.isArray(cats) ? cats.filter(c => c.parent_id !== null) : [])
    }).catch(() => {
      setAlert({ type: 'error', message: 'Ürün bilgileri yüklenemedi.' })
    }).finally(() => setLoading(false))
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const addSpec = () =>
    setFormData(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }))

  const removeSpec = (idx: number) =>
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx),
    }))

  const updateSpec = (idx: number, field: 'key' | 'value', val: string) =>
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setAlert(null)

    const specsObj: Record<string, string> = {}
    formData.specifications.forEach(({ key, value }) => {
      if (key.trim()) specsObj[key.trim()] = value.trim()
    })

    try {
      // 1) Ürün bilgilerini güncelle (images dahil)
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          category_id: formData.categoryId || null,
          brand: formData.brand.trim() || null,
          base_price: parseFloat(formData.price) || 0,
          original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          description: formData.description.trim() || null,
          sku: formData.sku.trim() || null,
          is_featured: formData.isFeatured,
          is_active: formData.isActive,
          images: formData.images.filter(Boolean),
          specifications: specsObj,
        }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Ürün güncellenemedi.')

      // 2) Stok güncelle
      const stockRes = await fetch(`/api/stock/update/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: parseInt(formData.stock) || 0 }),
      })
      if (!stockRes.ok) {
        const stockErr = await stockRes.json()
        console.warn('Stok güncellenemedi:', stockErr.error)
      }

      setAlert({ type: 'success', message: 'Ürün başarıyla güncellendi! Yönlendiriliyorsunuz...' })
      setTimeout(() => router.push('/admin/urunler'), 1500)
    } catch (err: unknown) {
      setAlert({ type: 'error', message: err instanceof Error ? err.message : 'Hata oluştu.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center gap-3 text-secondary">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Ürün yükleniyor...</span>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-5 border-b border-surface-container">
        <Link
          href="/admin/urunler"
          className="w-9 h-9 flex items-center justify-center border border-surface-container hover:bg-surface-container transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-headline font-bold text-headline-md text-on-surface">Ürün Düzenle</h1>
          <p className="text-sm text-secondary mt-0.5 truncate max-w-sm">{formData.name}</p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`flex items-start gap-3 p-4 mb-6 border ${
          alert.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-primary'
        }`}>
          {alert.type === 'success'
            ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          }
          <p className="text-sm font-medium">{alert.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="bg-white border border-surface-container p-6">
          <h2 className="font-headline font-bold text-on-surface mb-5">Temel Bilgiler</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="edit-name">
                Ürün Adı <span className="text-primary">*</span>
              </label>
              <input id="edit-name" name="name" type="text" required
                value={formData.name} onChange={handleChange} className="input-field" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="edit-category">
                  Kategori
                </label>
                <select id="edit-category" name="categoryId"
                  value={formData.categoryId} onChange={handleChange} className="input-field">
                  <option value="">Kategori Seçin</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="edit-brand">
                  Marka
                </label>
                <input id="edit-brand" name="brand" type="text"
                  value={formData.brand} onChange={handleChange}
                  className="input-field" placeholder="Örn: Trek, Giant" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="edit-sku">
                SKU (Stok Kodu)
              </label>
              <input id="edit-sku" name="sku" type="text"
                value={formData.sku} onChange={handleChange} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="edit-description">
                Açıklama
              </label>
              <textarea id="edit-description" name="description" rows={4}
                value={formData.description} onChange={handleChange}
                className="input-field resize-none" />
            </div>
          </div>
        </div>

        {/* Görseller — Çoklu */}
        <div className="bg-white border border-surface-container p-6">
          <MultiImageUploader
            values={formData.images}
            onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))}
            label="Ürün Görselleri"
            maxImages={10}
          />
        </div>

        {/* Fiyat & Stok */}
        <div className="bg-white border border-surface-container p-6">
          <h2 className="font-headline font-bold text-on-surface mb-5">Fiyat & Stok</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="edit-price">
                Satış Fiyatı (₺) <span className="text-primary">*</span>
              </label>
              <input id="edit-price" name="price" type="number" required min="0" step="0.01"
                value={formData.price} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="edit-original-price">
                Normal Fiyat (₺)
              </label>
              <input id="edit-original-price" name="originalPrice" type="number" min="0" step="0.01"
                value={formData.originalPrice} onChange={handleChange}
                className="input-field" placeholder="İndirim öncesi" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="edit-stock">
                Stok Adedi <span className="text-primary">*</span>
              </label>
              <input id="edit-stock" name="stock" type="number" min="0" required
                value={formData.stock} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-surface-container">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured}
                onChange={handleChange} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium text-on-surface">Öne Çıkan Ürün</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" name="isActive" checked={formData.isActive}
                onChange={handleChange} className="w-4 h-4 accent-primary" />
              <span className="text-sm font-medium text-on-surface">Aktif (vitrine göster)</span>
            </label>
          </div>
        </div>

        {/* Teknik Özellikler */}
        <div className="bg-white border border-surface-container p-6">
          <h2 className="font-headline font-bold text-on-surface mb-5">Teknik Özellikler</h2>
          <div className="space-y-3">
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={spec.key}
                  onChange={e => updateSpec(idx, 'key', e.target.value)}
                  placeholder="Özellik (Örn: Kadro)" className="input-field w-1/3" />
                <input type="text" value={spec.value}
                  onChange={e => updateSpec(idx, 'value', e.target.value)}
                  placeholder="Değer (Örn: Alüminyum)" className="input-field flex-1" />
                <button type="button" onClick={() => removeSpec(idx)}
                  className="w-10 h-10 flex items-center justify-center border border-surface-container text-secondary hover:text-primary hover:border-primary transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addSpec}
              className="flex items-center gap-2 text-sm text-secondary hover:text-on-surface transition-colors font-medium">
              <Plus className="w-4 h-4" />
              Özellik Ekle
            </button>
          </div>
        </div>

        {/* Kaydet */}
        <div className="flex gap-3 pb-10">
          <button type="submit" disabled={saving}
            className="btn-primary flex-1 justify-center disabled:opacity-60" id="save-edit-btn">
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Kaydediliyor...</>
            ) : (
              <><Save className="w-4 h-4" />Değişiklikleri Kaydet</>
            )}
          </button>
          <Link href="/admin/urunler" className="btn-outline px-8">İptal</Link>
        </div>
      </form>
    </div>
  )
}
