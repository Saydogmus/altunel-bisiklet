import type { Metadata } from 'next'
import Link from 'next/link'
import { Package, ShoppingBag, TrendingUp, AlertTriangle, Plus, Upload } from 'lucide-react'
import { createServiceClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Admin — Dashboard' }

export default async function AdminDashboard() {
  const supabase = createServiceClient()

  // ── Gerçek verileri Supabase'den çek ──────────────────────────────────────

  // 1. Toplam ürün sayısı
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // 2. Toplam sipariş sayısı
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  // 3. Toplam ciro (tüm siparişlerin total_amount toplamı)
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')

  const totalRevenue = (revenueData ?? []).reduce(
    (sum, order) => sum + (Number(order.total_amount) || 0),
    0
  )

  // 4. Düşük stoklu ürünler (stok <= 3 ve stok > 0)
  const { data: lowStockProducts } = await supabase
    .from('products')
    .select('id, name, stock')
    .gt('stock', 0)
    .lte('stock', 3)
    .order('stock', { ascending: true })
    .limit(10)

  // 5. Stok tükenmiş ürünler
  const { count: outOfStockCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('stock', 0)

  // 6. Son eklenen 10 ürün
  const { data: recentProducts } = await supabase
    .from('products')
    .select('id, name, sku, price, stock, category_id, categories(name)')
    .order('created_at', { ascending: false })
    .limit(10)

  const lowStock = lowStockProducts ?? []
  const products = recentProducts ?? []

  const stats = [
    { label: 'Toplam Ürün', value: totalProducts ?? 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Toplam Sipariş', value: totalOrders ?? 0, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Toplam Ciro', value: `₺${totalRevenue.toLocaleString('tr-TR')}`, icon: TrendingUp, color: 'text-primary', bg: 'bg-red-50' },
    { label: 'Düşük Stok', value: lowStock.length + (outOfStockCount ?? 0), icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ]

  return (
    <div className="p-6 md:p-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-surface-container">
        <div>
          <h1 className="font-headline font-bold text-headline-md text-on-surface">Dashboard</h1>
          <p className="text-secondary mt-1 text-sm">Mağazanızın genel durumu</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/urunler/yukle" className="btn-outline text-sm py-2.5 px-4" id="admin-upload-btn">
            <Upload className="w-4 h-4" />
            CSV Yükle
          </Link>
          <Link href="/admin/urunler/yeni" className="btn-primary text-sm py-2.5 px-4" id="admin-new-product-btn">
            <Plus className="w-4 h-4" />
            Yeni Ürün
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-surface-container p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-secondary font-medium">{label}</p>
              <div className={`w-9 h-9 ${bg} flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
            </div>
            <p className="font-headline font-bold text-2xl text-on-surface">
              {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
            </p>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <h2 className="font-semibold text-yellow-800">Stok Uyarısı — {lowStock.length} ürün</h2>
          </div>
          <div className="space-y-2">
            {lowStock.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-yellow-800">{p.name}</span>
                <span className="font-bold text-yellow-700">{p.stock} adet kaldı</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Products Table */}
      <div className="bg-white border border-surface-container">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container">
          <h2 className="font-headline font-bold text-on-surface">Son Eklenen Ürünler</h2>
          <Link href="/admin/urunler" className="text-sm text-primary hover:underline">
            Tümünü Gör →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low border-b border-surface-container">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-secondary">Ürün</th>
                <th className="text-left px-5 py-3 font-semibold text-secondary hidden md:table-cell">Kategori</th>
                <th className="text-right px-5 py-3 font-semibold text-secondary">Fiyat</th>
                <th className="text-right px-5 py-3 font-semibold text-secondary">Stok</th>
                <th className="text-right px-5 py-3 font-semibold text-secondary">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-secondary">
                    Henüz ürün bulunamadı.
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-on-surface">{product.name}</p>
                      <p className="text-xs text-secondary">{product.sku ?? '—'}</p>
                    </td>
                    <td className="px-5 py-3 text-secondary hidden md:table-cell">
                      {product.categories?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-on-surface">
                      {Number(product.price).toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`inline-flex items-center justify-center min-w-[40px] px-2.5 py-0.5 text-xs font-bold ${
                          product.stock === 0
                            ? 'bg-red-50 text-primary'
                            : product.stock <= 3
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/urunler/${product.id}/duzenle`}
                        className="text-sm text-primary hover:underline"
                      >
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
