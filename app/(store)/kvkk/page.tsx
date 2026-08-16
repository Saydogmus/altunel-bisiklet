import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'KVKK ve Gizlilik Politikası — Altunel Bisiklet',
  description: 'Altunel Bisiklet KVKK aydınlatma metni ve gizlilik politikası.',
}

const SECTIONS = [
  {
    title: '1. Veri Sorumlusunun Kimliği',
    content: `Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca Altunel Bisiklet ("Şirket") tarafından hazırlanmıştır.

Veri Sorumlusu:
Ticaret Unvanı: Altunel Bisiklet
Adres: Namık Kemal, 10. Sk. No:61, 34513 Esenyurt / İstanbul
Telefon: 0 (531) 642 11 44
E-posta: info@altunelbisiklet.com`,
  },
  {
    title: '2. Toplanan Kişisel Veriler',
    content: `Şirketimiz, aşağıdaki kişisel verileri işleyebilmektedir:

• Kimlik Bilgileri: Ad, soyad
• İletişim Bilgileri: E-posta adresi, telefon numarası, teslimat adresi
• Finansal Bilgiler: Sipariş tutarı, ödeme yöntemi (kart numarası tarafımızca saklanmaz; Stripe tarafından güvenle işlenir)
• Sipariş Bilgileri: Satın alınan ürünler, sipariş tarihi ve durumu
• Teknik Veriler: IP adresi, tarayıcı bilgisi, çerez verileri`,
  },
  {
    title: '3. Kişisel Verilerin İşlenme Amaçları',
    content: `Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:

• Siparişinizin oluşturulması, işlenmesi ve teslimatının gerçekleştirilmesi
• Satış sonrası destek ve müşteri hizmetleri sunulması
• Yasal yükümlülüklerin yerine getirilmesi (fatura, vergi kayıtları)
• Güvenli ve sorunsuz bir alışveriş deneyiminin sağlanması
• Açık rıza vermeniz halinde: pazarlama ve kampanya bildirimleri`,
  },
  {
    title: '4. Kişisel Verilerin Aktarılması',
    content: `Kişisel verileriniz; gerekli güvenlik tedbirleri alınarak aşağıdaki taraflarla paylaşılabilir:

• Kargo ve lojistik firmaları (sipariş teslimatı için)
• Ödeme hizmet sağlayıcıları (Stripe — PCI DSS uyumlu)
• Hukuki yükümlülük kapsamında resmi makamlar ve mahkemeler
• Açık rızanız bulunması halinde iş ortakları

Verileriniz yurt dışına aktarılması durumunda KVKK'nın 9. maddesi kapsamındaki güvenceler sağlanır.`,
  },
  {
    title: '5. Kişisel Veri Saklama Süresi',
    content: `Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca saklanır:

• Sipariş ve fatura kayıtları: 10 yıl (Türk Ticaret Kanunu gereği)
• Müşteri hesap bilgileri: Hesap aktif olduğu sürece + 3 yıl
• Pazarlama izinleri: Rıza geri alınana kadar
• Web sitesi log kayıtları: 2 yıl

Saklama süresinin dolmasının ardından verileriniz güvenli şekilde silinir veya anonim hale getirilir.`,
  },
  {
    title: '6. Çerezler (Cookies)',
    content: `Web sitemiz çerezler kullanmaktadır. Çerez türleri:

• Zorunlu Çerezler: Site işlevselliği için gerekli (oturum, sepet bilgisi)
• Analitik Çerezler: Site kullanımını anlamak için (Google Analytics)
• Pazarlama Çerezleri: Kişiselleştirilmiş reklamlar için (yalnızca rıza ile)

Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.`,
  },
  {
    title: '7. İlgili Kişinin Hakları',
    content: `KVKK Madde 11 kapsamında aşağıdaki haklara sahipsiniz:

• Kişisel verilerinizin işlenip işlenmediğini öğrenme
• İşlenmişse buna ilişkin bilgi talep etme
• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
• Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
• Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme
• KVKK Madde 7'de öngörülen şartlar çerçevesinde silinmesini isteme
• İşlemenin otomatik sistemler vasıtasıyla yapılması halinde aleyhine sonuç doğurmasına itiraz etme
• Zararın giderilmesini talep etme

Haklarınızı kullanmak için: info@altunelbisiklet.com`,
  },
  {
    title: '8. Veri Güvenliği',
    content: `Kişisel verilerinizin korunması için aşağıdaki teknik ve idari tedbirler uygulanmaktadır:

• SSL/TLS şifreli bağlantı (HTTPS)
• Güvenli ödeme altyapısı (Stripe — PCI DSS Level 1)
• Erişim yetkilendirme ve denetim
• Düzenli güvenlik güncellemeleri
• Veri ihlali durumunda yasal süre içinde bildirim`,
  },
  {
    title: '9. Başvuru Yöntemi',
    content: `KVKK kapsamındaki haklarınızı kullanmak için kimliğinizi doğrulayan belgelerle birlikte:

• E-posta: info@altunelbisiklet.com
• Adres: Namık Kemal, 10. Sk. No:61, 34513 Esenyurt / İstanbul
• Telefon: 0 (531) 642 11 44

adreslerine başvurabilirsiniz. Talebiniz en geç 30 gün içinde yanıtlanacaktır.`,
  },
]

export default function KvkkPage() {
  return (
    <div className="page-container py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-secondary mb-10">
        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-on-surface font-medium">KVKK ve Gizlilik Politikası</span>
      </nav>

      <div className="max-w-4xl">
        {/* Başlık */}
        <div className="mb-10 pb-6 border-b border-surface-container">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface">
              KVKK Aydınlatma Metni
            </h1>
          </div>
          <p className="text-body-md text-secondary">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hazırlanmıştır.{' '}
            <span className="text-secondary text-sm">Son güncelleme: Ocak 2025</span>
          </p>
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

        {/* İletişim */}
        <div className="mt-12 p-6 bg-surface-container-low border border-surface-container">
          <p className="font-semibold text-on-surface mb-2">Sorularınız için</p>
          <p className="text-sm text-secondary mb-4">
            KVKK kapsamındaki haklarınız veya gizlilik politikamız hakkında sorularınız için bizimle iletişime geçin.
          </p>
          <Link href="/iletisim" className="btn-primary inline-flex text-sm py-2.5 px-6">
            İletişime Geç
          </Link>
        </div>
      </div>
    </div>
  )
}
