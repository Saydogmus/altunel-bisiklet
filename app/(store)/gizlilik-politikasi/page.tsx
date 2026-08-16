import Link from 'next/link'
import { Shield } from 'lucide-react'

export const metadata = {
  title: 'Gizlilik Politikası | Altunel Bisiklet',
  description: 'Altunel Bisiklet kişisel veri işleme politikası ve KVKK aydınlatma metni.',
}

export default function GizlilikPolitikasiPage() {
  return (
    <div className="page-container py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-secondary mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
        <span>/</span>
        <span className="text-on-surface font-medium">Gizlilik Politikası</span>
      </nav>

      <div className="flex items-start gap-4 mb-10 pb-6 border-b border-surface-container">
        <div className="w-12 h-12 bg-surface-container flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">
            Gizlilik Politikası
          </h1>
          <p className="text-secondary mt-1 text-sm">Son güncelleme: Ağustos 2025 · KVKK Uyumlu</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-8">

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Veri Sorumlusu</h2>
          <div className="bg-surface-container-low border border-surface-container p-5 text-sm text-secondary space-y-1">
            <p><strong className="text-on-surface">Unvan:</strong> Altunel Bisiklet</p>
            <p><strong className="text-on-surface">Adres:</strong> Namık Kemal, 10. Sk. No:61, 34513 Esenyurt / İstanbul</p>
            <p><strong className="text-on-surface">E-posta:</strong> info@altunelbisiklet.com</p>
          </div>
        </section>

        <section id="kvkk">
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Toplanan Kişisel Veriler</h2>
          <p className="text-sm text-secondary leading-relaxed mb-3">Hizmetlerimizi sunarken aşağıdaki kişisel verilerinizi işlemekteyiz:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { cat: 'Kimlik', items: 'Ad, soyad' },
              { cat: 'İletişim', items: 'E-posta, telefon, adres' },
              { cat: 'Sipariş', items: 'Sipariş geçmişi, ürün tercihleri' },
              { cat: 'Teknik', items: 'IP adresi, tarayıcı bilgisi, çerezler' },
            ].map(({ cat, items }) => (
              <div key={cat} className="border border-surface-container p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface mb-1">{cat}</p>
                <p className="text-xs text-secondary">{items}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">İşleme Amaçları</h2>
          <ul className="text-sm text-secondary leading-relaxed space-y-2 list-disc list-inside">
            <li>Sipariş ve teslimat süreçlerini yönetmek</li>
            <li>Müşteri hizmetleri sunmak</li>
            <li>Yasal yükümlülükleri yerine getirmek (vergi, muhasebe vb.)</li>
            <li>Açık rızanız olması halinde pazarlama iletişimi göndermek</li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Verilerin Saklanması ve Güvenliği</h2>
          <p className="text-sm text-secondary leading-relaxed">
            Kişisel verileriniz, yasal saklama sürelerince güvenli sunucularda (Supabase — AB bölgesi) şifrelenmiş olarak saklanmaktadır. SSL/TLS şifreleme ile aktarım güvenliği sağlanmaktadır. Yetkisiz erişime karşı teknik ve idari tedbirler alınmaktadır.
          </p>
        </section>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Üçüncü Taraflarla Paylaşım</h2>
          <p className="text-sm text-secondary leading-relaxed">
            Kişisel verileriniz kargo şirketleri (teslimat için), ödeme altyapısı sağlayıcıları ve yasal zorunluluklar haricinde üçüncü taraflarla paylaşılmamaktadır.
          </p>
        </section>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">KVKK Kapsamında Haklarınız</h2>
          <ul className="text-sm text-secondary leading-relaxed space-y-2 list-disc list-inside">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Verilerin silinmesini veya yok edilmesini isteme</li>
            <li>Verilerinin üçüncü kişilere aktarılıp aktarılmadığını öğrenme</li>
          </ul>
          <p className="text-sm text-secondary mt-3">
            Bu haklarınızı kullanmak için <strong className="text-on-surface">info@altunelbisiklet.com</strong> adresine yazılı olarak başvurabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Çerezler (Cookies)</h2>
          <p className="text-sm text-secondary leading-relaxed">
            Sitemizde oturum yönetimi ve sepet işlevselliği için zorunlu çerezler kullanılmaktadır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz; ancak bu durum bazı işlevlerin çalışmamasına neden olabilir.
          </p>
        </section>

        <div className="p-5 bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
          <p className="font-semibold mb-1">⚠ Taslak Metin</p>
          <p>Bu sayfa taslak halindedir. Hukuki geçerlilik için bir KVKK uzmanı tarafından incelenmesi gerekmektedir.</p>
        </div>

      </div>
    </div>
  )
}
