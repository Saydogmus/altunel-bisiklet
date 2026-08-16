'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Package, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SiparislerPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient()
      
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.log("Supabase Auth Hatası: ", userError)
        router.push('/hesap/giris')
        return
      }

      console.log("Aktif Kullanıcı ID: ", user.id)

      // RLS Hatasını önlemek için order_items / products JOIN işlemi tamamen kaldırıldı
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      console.log("Çekilen Siparişler: ", data)
      if (error) {
        console.error("Supabase Hatası: ", error)
      }

      if (data) setOrders(data)
      setLoading(false)
    }

    fetchOrders()
  }, [router])

  // Sipariş Durumlarını Türkçeleştirme Fonksiyonu
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

  if (loading) {
    return (
      <div className="page-container py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-secondary font-medium animate-pulse">Siparişleriniz yükleniyor...</p>
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
          {orders.map((order) => (
            <div key={order.id} className="border border-surface-container bg-white shadow-sm hover:border-secondary transition-colors duration-200">
              <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-on-surface">
                      Sipariş #{order.id.slice(0, 8).toUpperCase()}
                    </span>
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
                    Tarih: {new Date(order.created_at).toLocaleDateString('tr-TR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric', 
                      hour: '2-digit', 
                      minute:'2-digit' 
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-surface-container">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-secondary mb-1 font-medium">Toplam Tutar</p>
                    <p className="font-headline font-bold text-lg text-primary">
                      {order.total_amount?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
