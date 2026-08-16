'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { Category } from '@/types'
import ImageUploader from '@/components/admin/ImageUploader'

type AlertState = { type: 'success' | 'error'; message: string } | null

export default function YeniUrunPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<AlertState>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [catsLoading, setCatsLoading] = useState(true)

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
    imageUrl: '',          // Supabase Storage veya harici URL
    specifications: [{ key: '', value: '' }],
  })

  // Kategorileri Supabase'den çek (UUID'ler ile)
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data: Category[]) => {
        // Sadece alt kategorileri göster (parent_id'si olan)
        setCategories(data.filter((c) => c.parent_id !== null))
      })
      .catch(() => {
        // API başarısız olursa boş bırak
        setCategories([])
      })
      .finally(() => setCatsLoading(false))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const addSpec = () =>
    setFormData({ ...formData, specifications: [...formData.specifications, { key: '', value: '' }] })

  const removeSpec = (idx: number) =>
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== idx),
    })

  const updateSpec = (idx: number, field: 'key' | 'value', val: string) =>
    setFormData({
      ...formData,
      specifications: formData.specifications.map((s, i) => (i === idx ? { ...s, [field]: val } : s)),
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAlert(null)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          categoryId: formData.categoryId || null,
          brand: formData.brand.trim() || null,
          price: formData.price,
          originalPrice: formData.originalPrice || null,
          stock: formData.stock,
          description: formData.description.trim() || null,
          sku: formData.sku.trim() || null,
          isFeatured: formData.isFeatured,
          images: formData.imageUrl ? [formData.imageUrl] : [],
          specifications: formData.specifications,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error ?? 'Sunucu hatası oluştu.')
      }

      setAlert({
        type: 'success',
        message: `"${result.product?.name}" başarıyla eklendi! Yönlendiriliyorsunuz...`,
      })
      setTimeout(() => router.push('/admin/urunler'), 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu.'
      setAlert({ type: 'error', message: msg })
    } finally {
      setLoading(false)
    }
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
        <div>
          <h1 className="font-headline font-bold text-headline-md text-on-surface">Yeni Ürün</h1>
          <p className="text-sm text-secondary mt-0.5">Mağazanıza yeni bir ürün ekleyin</p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={`flex items-start gap-3 p-4 mb-6 border ${
            alert.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-primary'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{alert.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="bg-white border border-surface-container p-6">
          <h2 className="font-headline font-bold text-on-surface mb-5">Temel Bilgiler</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="product-name">
                Ürün Adı <span className="text-primary">*</span>
              </label>
              <input
                id="product-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Örn: Trek Marlin 5 MTB Bisiklet"
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="product-category">
                  Kategori <span className="text-primary">*</span>
                </label>
                {catsLoading ? (
                  <div className="input-field flex items-center gap-2 text-secondary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Kategoriler yükleniyor...</span>
                  </div>
                ) : (
                  <select
                    id="product-category"
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="product-brand">
                  Marka
                </label>
                <input
                  id="product-brand"
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Örn: Trek, Giant, Shimano"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="product-sku">
                SKU (Stok Kodu)
              </label>
              <input
                id="product-sku"
                name="sku"
                type="text"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Örn: TRK-ML5-2024"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="product-description">
                Açıklama
              </label>
              <textarea
                id="product-description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Ürün açıklamasını girin..."
                className="input-field resize-none"
              />
            </div>
          </div>
        </div>

        {/* Fiyat & Stok */}
        <div className="bg-white border border-surface-container p-6">
          <h2 className="font-headline font-bold text-on-surface mb-5">Fiyat & Stok</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="product-price">
                Satış Fiyatı (₺) <span className="text-primary">*</span>
              </label>
              <input
                id="product-price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="product-original-price">
                Normal Fiyat (₺)
              </label>
              <input
                id="product-original-price"
                name="originalPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="İndirim öncesi"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5" htmlFor="product-stock">
                Stok Adedi <span className="text-primary">*</span>
              </label>
              <input
                id="product-stock"
                name="stock"
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-surface-container">
            <input
              type="checkbox"
              id="is-featured"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 border-secondary accent-primary"
            />
            <label htmlFor="is-featured" className="text-sm font-medium text-on-surface cursor-pointer">
              Öne Çıkan Ürün — Ana sayfada gösterilir
            </label>
          </div>
        </div>

        {/* Görsel */}
        <div className="bg-white border border-surface-container p-6">
          <ImageUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label="Ürün Görseli"
          />
        </div>

        {/* Teknik Özellikler */}
        <div className="bg-white border border-surface-container p-6">
          <h2 className="font-headline font-bold text-on-surface mb-5">Teknik Özellikler</h2>
          <div className="space-y-3">
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => updateSpec(idx, 'key', e.target.value)}
                  placeholder="Özellik (Örn: Motor)"
                  className="input-field w-1/3"
                  id={`spec-key-${idx}`}
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                  placeholder="Değer (Örn: 250W)"
                  className="input-field flex-1"
                  id={`spec-value-${idx}`}
                />
                <button
                  type="button"
                  onClick={() => removeSpec(idx)}
                  className="w-10 h-10 flex items-center justify-center border border-surface-container text-secondary hover:text-primary hover:border-primary transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpec}
              className="flex items-center gap-2 text-sm text-secondary hover:text-on-surface transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Özellik Ekle
            </button>
          </div>
        </div>

        {/* Kaydet */}
        <div className="flex gap-3 pb-10">
          <button
            type="submit"
            disabled={loading || catsLoading}
            className="btn-primary flex-1 justify-center disabled:opacity-60"
            id="save-product-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Ürünü Kaydet
              </>
            )}
          </button>
          <Link href="/admin/urunler" className="btn-outline px-8">
            İptal
          </Link>
        </div>
      </form>
    </div>
  )
}
