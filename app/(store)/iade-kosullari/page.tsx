import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, RotateCcw, CheckCircle, AlertTriangle, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'İade Koşulları — Altunel Bisiklet',
  description: 'Altunel Bisiklet iade, değişim ve iptal koşulları. 14 gün içinde ücretsiz iade.',
}

const SECTIONS = [
  {
    title: '1. İade Hakkı ve Süresi',
    content: `Tüketici olarak, satın aldığınız ürünü teslim tarihinden itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin iade etme hakkına sahipsiniz. Bu hak, Mesafeli Sözleşmeler Yönetmeliği (Madde 11) kapsamında güvence altındadır.

İade sürecini başlatmak için lütfen 0 (531) 642 11 44 numaralı telefonumuzu arayın veya info@altunelbisiklet.com adresine e-posta gönderin.`,
  },
  {
    title: '2. İade Koşulları',
    content: `İade kabul edilmesi için ürünün aşağıdaki koşulları sağlaması gerekmektedir:

• Ürün, orijinal ambalajında ve tüm aksesuarlarıyla birlikte iade edilmelidir.
• Ürün kullanılmamış, yıpranmamış ve hasar görmemiş olmalıdır.
• Ürünle birlikte gönderilen garanti belgesi, fatura ve diğer belgeler eksiksiz iade edilmelidir.
• Özel sipariş ile hazırlanan veya kişiselleştirilmiş ürünler iade kapsamı dışındadır.
• Hijyenik ürünler (kask iç astarı vb.), ambalajı açılmışsa iade edilemez.`,
  },
  {
    title: '3. İade Süreci',
    content: `İade işlemi aşağıdaki adımlarla gerçekleştirilir:

1. İade talebinizi telefon veya e-posta ile bildirin.
2. Size iade kargo kodu ve talimatları gönderilir.
3. Ürünü belirtilen kargo şirketi ile gönderin (kargo ücreti tarafımızca karşılanır).
4. Ürün tarafımıza ulaştıktan sonra 3 iş günü içinde inceleme yapılır.
5. İnceleme onaylandıktan sonra ödeme, 7–14 iş günü içinde iade edilir.`,
  },
  {
    title: '4. Para İadesi',
    content: `Onaylanan iadeler için ödeme, orijinal ödeme yönteminize iade edilir:

• Kredi/banka kartı ödemelerinde iade, kartınıza 7–14 iş günü içinde yansır (banka işlem süresine bağlıdır).
• EFT/Havale ödemelerinde iade, belirttiğiniz IBAN numarasına 3–5 iş günü içinde yapılır.
• Kargo ücreti olarak tahsil edilen tutar, iade onaylandığında geri ödenir.`,
  },
  {
    title: '5. Hasar ve Arıza Durumu',
    content: `Kargoda hasar gören ürünler için:

• Ürünü teslim alırken kargo görevlisi huzurunda açın ve hasar varsa tutanak tutturun.
• Hasarlı ürünü teslim almayın; kargo görevlisine iade edin.
• Hasar durumunu bize bildirin; ücretsiz değişim veya iade yapılır.

Fabrika çıkışlı arızalarda garanti kapsamında ücretsiz onarım veya değişim yapılır.`,
  },
  {
    title: '6. Garanti Koşulları',
    content: `Tüm bisikletler satış tarihinden itibaren 2 yıl üretici garantisi kapsamındadır. Garanti dışı durumlar:

• Kullanım hataları ve kazalar
• Yetkisiz servis müdahaleleri
• Doğal aşınma ve yıpranma
• Su hasarı (su geçirmezlik garantisi olmayan ürünler)`,
  },
]

export default function IadeKosullariPage() {
  return (
    <div className="page-container py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-secondary mb-10">
        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-on-surface font-medium">İade Koşulları</span>
      </nav>

      <div className="max-w-4xl">
        {/* Başlık */}
        <div className="mb-10 pb-6 border-b border-surface-container">
          <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-3">
            İade ve Değişim Koşulları
          </h1>
          <p className="text-body-md text-secondary">
            Son güncelleme: Ocak 2025
          </p>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: RotateCcw, title: '14 Gün İade', desc: 'Koşulsuz iade hakkı', color: 'bg-green-50 text-green-600' },
            { icon: CheckCircle, title: 'Ücretsiz Kargo', desc: 'İade kargosu bizden', color: 'bg-blue-50 text-blue-600' },
            { icon: AlertTriangle, title: 'Hızlı İşlem', desc: '7–14 iş günü iade', color: 'bg-yellow-50 text-yellow-600' },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="border border-surface-container p-5 bg-white flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${color.split(' ')[0]}`}>
                <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm">{title}</p>
                <p className="text-xs text-secondary">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* İçerik */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title} className="border-b border-surface-container pb-8 last:border-0">
              <h2 className="font-headline font-bold text-lg text-on-surface mb-4">
                {section.title}
              </h2>
              <div className="text-body-md text-secondary leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* İletişim CTA */}
        <div className="mt-12 p-6 bg-surface-container-low border border-surface-container flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Phone className="w-6 h-6 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-on-surface mb-1">İade için bizimle iletişime geçin</p>
            <p className="text-sm text-secondary">
              Pazartesi – Cumartesi, 09:00 – 18:00 arasında sizi bekliyoruz.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="tel:+905316421144" className="btn-primary text-sm py-2.5 px-5">
              0 (531) 642 11 44
            </a>
            <Link href="/iletisim" className="btn-outline text-sm py-2.5 px-5">
              İletişim
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
