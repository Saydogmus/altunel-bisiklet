'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Package, Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SiparislerPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/hesap/giris')
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            products (
              name,
              slug,
              image_url
            )
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (data) setOrders(data)
      setLoading(false)
    }

    fetchOrders()
  }, [router])

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor'
      case 'processing':
        return 'Hazırlanıyor'
      case 'shipped':
        return 'Kargoya Verildi'
      case 'delivered':
        return 'Teslim Edildi'
      case 'cancelled':
        return 'İptal Edildi'
      default:
        return status
    }
  }

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
    } else {
      setExpandedOrderId(orderId)
    }
  }

  if (loading) {
    return (
      <div className="page-container py-16 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="page-container py-12 md:py-16 max-w-5xl min-h-[60vh]">
      <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-8">
        Siparişlerim
      </h1>

      {orders.length === 0 ? (
        <div className="border border-surface-container bg-surface-container-low p-10 text-center rounded-lg shadow-sm mt-8">
          <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full mx-auto mb-4 border border-surface-container shadow-sm">
            <Package className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-lg font-semibold text-on-surface mb-2">Henüz siparişiniz bulunmamaktadır</h2>
          <p className="text-secondary mb-6 text-sm max-w-sm mx-auto">
            İlk siparişinizi oluşturmak ve ayrıcalıklarımızdan faydalanmak için mağazamıza göz atabilirsiniz.
          </p>
          <Link href="/urunler" className="btn-primary inline-flex">
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id

            return (
              <div key={order.id} className="border border-surface-container bg-white shadow-sm hover:border-secondary transition-colors duration-200">
                {/* Sipariş Özeti (Header) */}
                <div 
                  className="p-5 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-on-surface">Sipariş #{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className={`text-xs font-bold tracking-wider px-2.5 py-1 uppercase ${
                        order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' : 
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : 
                        order.status === 'delivered' || order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-surface-container-low text-secondary'
                      }`}>
                        {translateStatus(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary">
                      Tarih: {new Date(order.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-surface-container">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-secondary mb-1 font-medium">Toplam Tutar</p>
                      <p className="font-headline font-bold text-lg text-primary">
                        {order.total_amount?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </p>
                    </div>
                    <button 
                      className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium"
                      aria-label={isExpanded ? 'Detayları Gizle' : 'Detayları Gör'}
                    >
                      {isExpanded ? (
                        <>Gizle <ChevronUp className="w-5 h-5" /></>
                      ) : (
                        <>Detay Gör <ChevronDown className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sipariş Detayları (Accordion Content) */}
                {isExpanded && (
                  <div className="border-t border-surface-container bg-surface-container-low/30 p-5 md:p-6 animate-fade-in">
                    <h3 className="text-sm font-semibold text-on-surface mb-4">Sipariş Edilen Ürünler</h3>
                    <div className="space-y-4">
                      {order.order_items && order.order_items.length > 0 ? (
                        order.order_items.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-4 bg-white border border-surface-container p-3 rounded">
                            <div className="relative w-16 h-16 bg-surface-container-low border border-surface-container flex-shrink-0">
                              {item.products?.image_url ? (
                                <Image 
                                  src={item.products.image_url} 
                                  alt={item.products.name || 'Ürün'} 
                                  fill
                                  className="object-contain p-1"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-secondary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link 
                                href={item.products?.slug ? `/urunler/${item.products.slug}` : '#'}
                                className="text-sm font-semibold text-on-surface hover:text-primary truncate block transition-colors"
                              >
                                {item.products?.name || 'İsimsiz Ürün'}
                              </Link>
                              <p className="text-xs text-secondary mt-1">Adet: {item.quantity}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-sm font-bold text-on-surface">
                                {item.unit_price?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-secondary mt-1">
                                  Toplam: {(item.quantity * item.unit_price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-secondary">Bu siparişe ait detay bulunamadı.</p>
                      )}
                    </div>
                    
                    {/* Adres ve Kargo Bilgisi */}
                    {order.shipping_address && (
                      <div className="mt-6 pt-6 border-t border-surface-container">
                        <h3 className="text-sm font-semibold text-on-surface mb-3">Teslimat Bilgileri</h3>
                        <div className="bg-white border border-surface-container p-4 rounded text-sm text-secondary">
                          <p className="font-semibold text-on-surface mb-1">{order.shipping_address.full_name}</p>
                          <p className="mb-1">{order.shipping_address.phone}</p>
                          <p>{order.shipping_address.address}, {order.shipping_address.district} / {order.shipping_address.city}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
