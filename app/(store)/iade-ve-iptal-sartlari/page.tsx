import Link from 'next/link'
import { RotateCcw } from 'lucide-react'

export const metadata = {
  title: 'İade ve İptal Şartları | Altunel Bisiklet',
  description: 'Altunel Bisiklet iade, değişim ve iptal koşulları.',
}

export default function IadeIptalPage() {
  return (
    <div className="page-container py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-secondary mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
        <span>/</span>
        <span className="text-on-surface font-medium">İade ve İptal Şartları</span>
      </nav>

      <div className="flex items-start gap-4 mb-10 pb-6 border-b border-surface-container">
        <div className="w-12 h-12 bg-surface-container flex items-center justify-center flex-shrink-0">
          <RotateCcw className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">
            İade ve İptal Şartları
          </h1>
          <p className="text-secondary mt-1 text-sm">Son güncelleme: Ağustos 2025</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-8">

        {/* Özet kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: '14 Gün', desc: 'Cayma hakkı süresi', color: 'bg-green-50 border-green-200' },
            { title: 'Ücretsiz', desc: '2.000₺ üzeri kargo', color: 'bg-blue-50 border-blue-200' },
            { title: '5–10 Gün', desc: 'İade ödeme süresi', color: 'bg-yellow-50 border-yellow-200' },
          ].map(c => (
            <div key={c.title} className={`border p-4 text-center ${c.color}`}>
              <p className="font-headline font-bold text-xl text-on-surface">{c.title}</p>
              <p className="text-xs text-secondary mt-1">{c.desc}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">İptal Hakkı</h2>
          <p className="text-sm text-secondary leading-relaxed">
            Siparişiniz kargoya verilmeden önce <strong className="text-on-surface">info@altunelbisiklet.com</strong> adresine e-posta göndererek veya <strong className="text-on-surface">0 (531) 642 11 44</strong> numaralı telefonu arayarak siparişinizi iptal edebilirsiniz. Kargoya verildikten sonra iptal mümkün değildir; bu durumda iade prosedürü uygulanır.
          </p>
        </section>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">İade Koşulları</h2>
          <ul className="text-sm text-secondary leading-relaxed space-y-2.5">
            {[
              'Ürün teslim tarihinden itibaren 14 gün içinde iade talebi oluşturulmalıdır.',
              'İade edilecek ürün, kullanılmamış, orijinal ambalajında ve tüm aksesuarlarıyla birlikte teslim edilmelidir.',
              'Kullanım nedeniyle oluşan hasar veya eksiklikler iade kapsamı dışındadır.',
              'İade kargo bedeli müşteriye aittir.',
              'Hatalı veya hasarlı ürün gönderiminde kargo bedeli tarafımızca karşılanır.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="w-5 h-5 bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">İade Edilemeyen Ürünler</h2>
          <ul className="text-sm text-secondary leading-relaxed space-y-2 list-disc list-inside">
            <li>Paketleri açılmış hijyenik ürünler</li>
            <li>Kişiye özel üretilen veya boyut değiştirilen ürünler</li>
            <li>Elektronik bileşenler (yazılım güncellemesi yapılmış ürünler)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Para İadesi</h2>
          <p className="text-sm text-secondary leading-relaxed">
            İade ürün tarafımıza ulaştıktan ve kontrolü yapıldıktan sonra <strong className="text-on-surface">5–10 iş günü</strong> içinde ödeme iadeniz gerçekleştirilir. İade, orijinal ödeme yönteminize yapılır.
          </p>
        </section>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">İletişim</h2>
          <p className="text-sm text-secondary leading-relaxed">
            İade talebiniz için <Link href="/iletisim" className="text-primary hover:underline font-medium">iletişim sayfamızı</Link> ziyaret edebilir veya <strong className="text-on-surface">info@altunelbisiklet.com</strong> adresine &quot;İade Talebi — [Sipariş Numaranız]&quot; konusu ile e-posta gönderebilirsiniz.
          </p>
        </section>

        <div className="p-5 bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
          <p className="font-semibold mb-1">⚠ Taslak Politika</p>
          <p>Bu sayfa taslak halindedir. Ticari kullanım öncesinde güncellenmelidir.</p>
        </div>

      </div>
    </div>
  )
}
