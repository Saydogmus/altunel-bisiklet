import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Shield } from 'lucide-react'

const FOOTER_LINKS = {
  bisikletler: [
    { label: 'Dağ Bisikleti', href: '/kategori/dag-bisikleti' },
    { label: 'Şehir Bisikleti', href: '/kategori/sehir-bisikleti' },
    { label: 'Yol Yarış Bisikleti', href: '/kategori/yol-yaris-bisikleti' },
    { label: 'Çocuk Bisikleti', href: '/kategori/cocuk-bisikleti' },
    { label: 'Elektrikli Bisiklet', href: '/kategori/elektrikli-bisiklet' },
  ],
  kurumsal: [
    { label: 'Hakkımızda', href: '/hakkimizda' },
    { label: 'İletişim', href: '/iletisim' },
    { label: 'Kargo Takip', href: '/kargo-takip' },
    { label: 'Tüm Ürünler', href: '/urunler' },
  ],
  sozlesmeler: [
    { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis-sozlesmesi' },
    { label: 'İade ve İptal Şartları', href: '/iade-ve-iptal-sartlari' },
    { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
    { label: 'KVKK Aydınlatma Metni', href: '/gizlilik-politikasi#kvkk' },
  ],
}

const BOTTOM_LINKS = [
  { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis-sozlesmesi' },
  { label: 'İade ve İptal', href: '/iade-ve-iptal-sartlari' },
  { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
  { label: 'İletişim', href: '/iletisim' },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-container mt-20">
      {/* Main Footer */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-headline font-bold text-xl tracking-tighter text-on-surface mb-4">
              ALTUNEL BİSİKLET
            </p>
            <p className="text-sm text-secondary leading-relaxed mb-5">
              Performans ve estetiği bir araya getiren yüksek kaliteli bisiklet ve donanımlar.
              1998&apos;den bu yana güvenilir bisiklet partnerin.
            </p>

            {/* Sosyal Medya */}
            <div className="flex items-center gap-2 mb-6">
              <a
                href="https://www.instagram.com/altunelbisiklet/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-surface-container flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-colors duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Güvenlik Rozetleri */}
            <div className="p-4 bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs text-secondary font-semibold uppercase tracking-wider">Güvenli Alışveriş</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {['SSL', '3D Secure', 'Güvenli Ödeme'].map(badge => (
                  <span key={badge} className="px-2 py-1 bg-white border border-surface-container text-xs text-secondary font-medium">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bisikletler */}
          <div>
            <h4 className="font-headline font-bold text-xs tracking-widest uppercase text-on-surface mb-4 pb-3 border-b border-surface-container">
              Bisikletler
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.bisikletler.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-secondary hover:text-primary transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="font-headline font-bold text-xs tracking-widest uppercase text-on-surface mb-4 pb-3 border-b border-surface-container">
              Kurumsal
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.kurumsal.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-secondary hover:text-primary transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Sözleşmeler */}
            <h4 className="font-headline font-bold text-xs tracking-widest uppercase text-on-surface mt-7 mb-4 pb-3 border-b border-surface-container">
              Sözleşmeler
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.sozlesmeler.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-secondary hover:text-primary transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="font-headline font-bold text-xs tracking-widest uppercase text-on-surface mb-4 pb-3 border-b border-surface-container">
              İletişim
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-secondary leading-relaxed">
                  Namık Kemal, 10. Sk. No:61<br />
                  34513 Esenyurt / İstanbul
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+905316421144" className="text-sm text-secondary hover:text-primary transition-colors">
                  0 (531) 642 11 44
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:info@altunelbisiklet.com" className="text-sm text-secondary hover:text-primary transition-colors">
                  info@altunelbisiklet.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-container">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-secondary">
            © {new Date().getFullYear()} ALTUNEL BİSİKLET. Tüm Hakları Saklıdır.
          </p>
          <nav className="flex flex-wrap gap-4 md:gap-6" aria-label="Yasal bağlantılar">
            {BOTTOM_LINKS.map(item => (
              <Link key={item.label} href={item.href} className="text-xs text-secondary hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
