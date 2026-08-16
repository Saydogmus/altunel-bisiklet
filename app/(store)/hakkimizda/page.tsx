import type { Metadata } from 'next'
import Link from 'next/link'
import { Bike, Clock, Award, MapPin, ArrowRight, Heart, ChevronRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakkımızda — Altunel Bisiklet',
  description: '30 yılı aşkın deneyimle Kron, RKS ve Ape Ryder resmi yetkili bayisi.',
}

const STATS = [
  { value: '30+', label: 'Yıllık Deneyim', icon: Clock },
  { value: '500+', label: 'Ürün Çeşidi', icon: Award },
  { value: '25.000+', label: 'Mutlu Müşteri', icon: Heart },
  { value: '81', label: 'İl Kargo', icon: MapPin },
]

const BRANDS = ['Kron', 'RKS', 'Ape Ryder']

const HIGHLIGHTS = [
  'Satış öncesi uzman bisiklet rehberliği',
  '%100 orijinal ürün garantisi',
  'Hızlı teslimat — Türkiye\'nin her yerine',
  'Güvenli ödeme altyapısı',
  'Satış sonrası destek ve teknik servis',
]

export default function HakkimizdaPage() {
  return (
    <div className="page-container py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-secondary mb-10">
        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-on-surface font-medium">Hakkımızda</span>
      </nav>

      {/* Başlık */}
      <div className="mb-12 pb-6 border-b border-surface-container">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-red-50 flex items-center justify-center">
            <Bike className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface">
            Hakkımızda
          </h1>
        </div>
        <p className="text-body-md text-secondary max-w-2xl">
          30 yılı aşkın deneyimle bisiklet tutkunlarının yanındayız.
        </p>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {STATS.map(({ value, label, icon: Icon }) => (
          <div key={label} className="border border-surface-container bg-white p-6 text-center">
            <div className="w-10 h-10 bg-red-50 flex items-center justify-center mx-auto mb-3">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-headline font-bold text-2xl text-on-surface">{value}</p>
            <p className="text-xs text-secondary mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Hikayemiz */}
      <section className="mb-16 pb-12 border-b border-surface-container">
        <div className="max-w-3xl">
          <h2 className="font-headline font-bold text-headline-sm text-on-surface mb-6">
            Hikayemiz
          </h2>
          <div className="space-y-5 text-body-md text-secondary leading-relaxed">
            <p>
              Altunel Bisiklet olarak, 30 yılı aşkın süredir bisiklet tutkunlarına en kaliteli
              hizmeti sunmanın gururunu yaşıyoruz. Yarım asra yaklaşan bu köklü tecrübemiz ve
              bisiklete olan bitmek bilmeyen tutkumuzla; her yaştan, her seviyeden sürücüyü
              hayalindeki bisikletle buluşturmaya devam ediyoruz.
            </p>
            <p>
              Sektörün en güvenilir ve yenilikçi markaları olan{' '}
              <strong className="text-on-surface">Kron, RKS ve Ape Ryder</strong>&apos;ın resmi
              yetkili bayisi olarak hizmet veriyoruz. Profesyonel dağ bisikletlerinden pratik
              katlanabilir şehir bisikletlerine, son teknoloji elektrikli bisikletlerden çocuk
              bisikletlerine kadar geniş ürün yelpazemizle, müşterilerimize her zaman en iyisini
              sunmayı hedefliyoruz.
            </p>
            <p>
              Sadece bir satış noktası değil; satış öncesi doğru bisiklet seçiminde uzman
              rehberiniz, satış sonrasında ise %100 orijinal ürün garantisiyle güvenilir yol
              arkadaşınızız. 30 yılı aşan deneyimimiz, güvenli ödeme altyapımız ve hızlı teslimat
              ağımızla Türkiye&apos;nin her yerine pedal sevgisini taşıyoruz.
            </p>
            <p className="font-medium text-on-surface">
              Sağlıklı, çevreci ve özgür bir yaşam için pedal çevirmeye hazır olan herkesi
              Altunel Bisiklet ailesine bekliyoruz!
            </p>
          </div>
        </div>
      </section>

      {/* Yetkili Markalar */}
      <section className="mb-16 pb-12 border-b border-surface-container">
        <h2 className="font-headline font-bold text-headline-sm text-on-surface mb-8">
          Yetkili Bayisi Olduğumuz Markalar
        </h2>
        <div className="flex flex-wrap gap-4">
          {BRANDS.map(brand => (
            <div
              key={brand}
              className="border-2 border-primary px-8 py-4 font-headline font-bold text-lg text-primary"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* Neden Biz */}
      <section className="mb-16 pb-12 border-b border-surface-container">
        <h2 className="font-headline font-bold text-headline-sm text-on-surface mb-8">
          Neden Altunel Bisiklet?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {HIGHLIGHTS.map(item => (
            <div key={item} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-secondary leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-surface-container-low border border-surface-container p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
            Bisiklet Dünyanızı Birlikte Keşfedelim
          </h2>
          <p className="text-secondary text-sm">
            En kaliteli ürünler, en uygun fiyatlar ve en iyi hizmet için buradayız.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <Link href="/urunler" className="btn-primary">
            Alışverişe Başla
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/iletisim" className="btn-outline">
            İletişim
          </Link>
        </div>
      </div>
    </div>
  )
}
