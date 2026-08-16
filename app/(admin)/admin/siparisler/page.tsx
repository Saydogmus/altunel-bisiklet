'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Search, Package, RefreshCw, Loader2, X, Eye,
  User, Mail, Phone, MapPin, ShoppingBag, ChevronDown,
  CheckCircle, Bike,
} from 'lucide-react'
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from '@/lib/utils'

// ── Tipler ──────────────────────────────────────────────────────────────────
interface Product { id: string; name: string; sku?: string; images?: string[] }

interface OrderItem {
  id: string
  quantity: number
  unit_price: number
  products?: Product
}

interface ShippingAddress {
  full_name?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  district?: string
  postal_code?: string
}

interface Order {
  id: string
  guest_email?: string
  status: string
  total_amount: number
  shipping_fee: number
  shipping_address?: ShippingAddress
  created_at: string
  updated_at?: string
  order_items?: OrderItem[]
}

// ── Sabitler ─────────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'pending',    label: 'Bekliyor' },
  { value: 'processing', label: 'Hazırlanıyor' },
  { value: 'shipped',    label: 'Kargoya Verildi' },
  { value: 'delivered',  label: 'Tamamlandı' },
  { value: 'cancelled',  label: 'İptal Edildi' },
]

const ALL_FILTER_STATUSES = ['Tümü', ...STATUS_OPTIONS.map(s => s.value)]

// ── Yardımcı ─────────────────────────────────────────────────────────────────
function getCustomerName(order: Order): string {
  return (
    order.shipping_address?.full_name ??
    order.guest_email ??
    'Misafir'
  )
}

function StatusBadge({ status }: { status: string }) {
  const meta = ORDER_STATUS_LABELS[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold ${meta?.color ?? 'bg-gray-100 text-gray-600'}`}>
      {meta?.label ?? status}
    </span>
  )
}

// ── Detay Modal ───────────────────────────────────────────────────────────────
function OrderDetailModal({
  orderId,
  onClose,
  onStatusChange,
}: {
  orderId: string
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(r => r.json())
      .then((data: Order) => { setOrder(data); setNewStatus(data.status) })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [orderId])

  // Escape tuşu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Body scroll kilidi
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSaveStatus = async () => {
    if (!order || newStatus === order.status) return
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrder(prev => prev ? { ...prev, status: newStatus } : prev)
        onStatusChange(orderId, newStatus)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  const addr = order?.shipping_address

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative bg-white w-full max-w-2xl shadow-large"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-container">
            <div>
              <p className="text-xs text-secondary font-semibold uppercase tracking-wide">Sipariş Detayı</p>
              <h2 className="font-headline font-bold text-on-surface mt-0.5">
                #{order?.id.slice(0, 8).toUpperCase() ?? '...'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center border border-surface-container hover:bg-surface-container transition-colors"
              aria-label="Kapat"
            >
              <X className="w-4 h-4 text-secondary" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-secondary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Yükleniyor...</span>
            </div>
          ) : !order ? (
            <div className="py-16 text-center text-secondary text-sm">Sipariş yüklenemedi.</div>
          ) : (
            <div className="p-6 space-y-6">

              {/* Durum + Tarih */}
              <div className="flex items-center justify-between flex-wrap gap-3 bg-surface-container-low px-5 py-4">
                <div>
                  <p className="text-xs text-secondary mb-1">Sipariş Tarihi</p>
                  <p className="font-semibold text-on-surface text-sm">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary mb-1">Durum</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Müşteri Bilgileri */}
              <div className="border border-surface-container">
                <div className="px-5 py-3 bg-surface-container-low border-b border-surface-container">
                  <p className="text-xs font-bold text-on-surface uppercase tracking-wide">Müşteri & Teslimat</p>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {addr?.full_name && (
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="font-medium text-on-surface">{addr.full_name}</span>
                    </div>
                  )}
                  {(addr?.email || order.guest_email) && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="text-on-surface">{addr?.email ?? order.guest_email}</span>
                    </div>
                  )}
                  {addr?.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span className="text-on-surface">{addr.phone}</span>
                    </div>
                  )}
                  {addr?.address && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-on-surface">
                        {addr.address}
                        {(addr.district || addr.city) && (
                          <><br />{[addr.district, addr.city, addr.postal_code].filter(Boolean).join(' / ')}</>
                        )}
                      </span>
                    </div>
                  )}
                  {!addr?.full_name && !addr?.email && !order.guest_email && (
                    <p className="text-sm text-secondary">Müşteri bilgisi yok.</p>
                  )}
                </div>
              </div>

              {/* Ürünler */}
              <div className="border border-surface-container">
                <div className="px-5 py-3 bg-surface-container-low border-b border-surface-container flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-secondary" />
                  <p className="text-xs font-bold text-on-surface uppercase tracking-wide">
                    Sipariş Kalemleri ({order.order_items?.length ?? 0} ürün)
                  </p>
                </div>
                <div className="divide-y divide-surface-container">
                  {order.order_items && order.order_items.length > 0 ? (
                    order.order_items.map(item => (
                      <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                        {/* Görsel */}
                        <div className="w-14 h-14 bg-surface-container-low border border-surface-container flex-shrink-0 overflow-hidden">
                          {item.products?.images?.[0] ? (
                            <Image
                              src={item.products.images[0]}
                              alt={item.products?.name ?? ''}
                              width={56}
                              height={56}
                              className="w-full h-full object-contain p-0.5"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Bike className="w-6 h-6 text-secondary opacity-40" />
                            </div>
                          )}
                        </div>

                        {/* Bilgi */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-on-surface text-sm leading-snug truncate">
                            {item.products?.name ?? 'Ürün'}
                          </p>
                          {item.products?.sku && (
                            <p className="text-xs text-secondary font-mono">SKU: {item.products.sku}</p>
                          )}
                          <p className="text-xs text-secondary mt-0.5">
                            {formatPrice(item.unit_price)} × {item.quantity} adet
                          </p>
                        </div>

                        {/* Tutar */}
                        <p className="font-bold text-on-surface text-sm flex-shrink-0">
                          {formatPrice(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-8 text-center text-sm text-secondary">
                      Kalem bilgisi bulunamadı.
                    </div>
                  )}
                </div>

                {/* Toplam */}
                <div className="px-5 py-4 border-t border-surface-container bg-surface-container-low space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Kargo</span>
                    <span className="font-medium">
                      {order.shipping_fee === 0 ? 'Ücretsiz' : formatPrice(order.shipping_fee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-surface-container pt-2">
                    <span>Toplam</span>
                    <span className="text-primary">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Durum Güncelle */}
              <div className="border border-surface-container">
                <div className="px-5 py-3 bg-surface-container-low border-b border-surface-container">
                  <p className="text-xs font-bold text-on-surface uppercase tracking-wide">Durum Güncelle</p>
                </div>
                <div className="px-5 py-4 flex items-center gap-3 flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      className="input-field appearance-none pr-8"
                      id="order-status-select"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
                  </div>
                  <button
                    onClick={handleSaveStatus}
                    disabled={saving || newStatus === order.status}
                    className="btn-primary py-2.5 px-5 disabled:opacity-50 flex-shrink-0"
                    id="save-status-btn"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved ? (
                      <><CheckCircle className="w-4 h-4" />Kaydedildi!</>
                    ) : (
                      'Kaydet'
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── Ana Sayfa ─────────────────────────────────────────────────────────────────
export default function SiparislerPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Tümü')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // Modal kapandığında durum değişikliğini listeye yansıt
  const handleStatusChange = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const filtered = orders.filter(o => {
    const name = getCustomerName(o).toLowerCase()
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      name.includes(search.toLowerCase()) ||
      (o.guest_email ?? '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Tümü' || o.status === filter
    return matchSearch && matchFilter
  })

  const totalRevenue = filtered.reduce((sum, o) => sum + (o.total_amount ?? 0), 0)

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8 pb-5 border-b border-surface-container flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-headline-md text-on-surface">Siparişler</h1>
          <p className="text-secondary mt-1 text-sm">
            {loading
              ? 'Yükleniyor...'
              : <>{filtered.length} sipariş · Toplam: <strong className="text-on-surface">{formatPrice(totalRevenue)}</strong></>
            }
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="btn-outline py-2.5 px-4 text-sm"
          title="Yenile"
          id="refresh-orders-btn"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center border border-surface-container bg-white px-3 gap-2 flex-1">
          <Search className="w-4 h-4 text-secondary flex-shrink-0" />
          <input
            type="text"
            placeholder="Sipariş ID, müşteri adı veya e-posta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 py-2.5 text-sm text-on-surface placeholder:text-secondary focus:outline-none bg-transparent"
            id="orders-search"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_FILTER_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-on-surface text-white'
                  : 'bg-surface-container-low text-secondary hover:bg-surface-container'
              }`}
            >
              {s === 'Tümü' ? 'Tümü' : (ORDER_STATUS_LABELS[s]?.label ?? s)}
            </button>
          ))}
        </div>
      </div>

      {/* Tablo */}
      <div className="bg-white border border-surface-container">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-secondary">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Siparişler yükleniyor...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low border-b border-surface-container">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-secondary">Sipariş No</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-secondary hidden sm:table-cell">Müşteri</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-secondary hidden md:table-cell">Tarih</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-secondary">Tutar</th>
                  <th className="text-center px-5 py-3.5 font-semibold text-secondary">Durum</th>
                  <th className="text-center px-5 py-3.5 font-semibold text-secondary">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filtered.map(order => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    {/* ID */}
                    <td className="px-5 py-4">
                      <p className="font-mono font-bold text-on-surface text-xs tracking-wider">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </td>

                    {/* Müşteri */}
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <p className="font-medium text-on-surface">{getCustomerName(order)}</p>
                      {order.guest_email && (
                        <p className="text-xs text-secondary truncate max-w-[180px]">{order.guest_email}</p>
                      )}
                    </td>

                    {/* Tarih */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-secondary text-xs">{formatDate(order.created_at)}</p>
                    </td>

                    {/* Tutar */}
                    <td className="px-5 py-4 text-right">
                      <p className="font-bold text-on-surface">{formatPrice(order.total_amount)}</p>
                      {order.shipping_fee > 0 && (
                        <p className="text-xs text-secondary">+{formatPrice(order.shipping_fee)} kargo</p>
                      )}
                    </td>

                    {/* Durum */}
                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Detay Butonu */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-surface-container hover:border-secondary hover:text-primary transition-colors"
                        id={`order-detail-btn-${order.id.slice(0, 8)}`}
                        title="Detayları gör"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-10 h-10 text-secondary mx-auto mb-3" />
                <p className="font-semibold text-on-surface">Sipariş bulunamadı</p>
                <p className="text-sm text-secondary mt-1">
                  {orders.length === 0
                    ? 'Henüz hiç sipariş yok. Müşteriler alışveriş yaptıkça burada görünecek.'
                    : 'Arama kriterlerini değiştirmeyi deneyin.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detay Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
