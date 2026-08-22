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
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs text-secondary font-semibold uppercase tracking-wider">Güvenli Alışveriş</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {['SSL', '3D Secure', 'Güvenli Ödeme'].map(badge => (
                  <span key={badge} className="px-2 py-1 bg-white border border-surface-container text-xs text-secondary font-medium">
                    {badge}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-surface-container">
                {/* iyzico Logo */}
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-surface-container" title="iyzico ile Öde">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M2 6l8 6-8 6V6z" fill="#3A56FF" />
                    <path d="M2 6l8 6-8 6V6z" fill="url(#iyz-grad)" />
                    <defs><linearGradient id="iyz-grad" x1="2" y1="6" x2="2" y2="18"><stop stopColor="#7DB9FF" /><stop offset="1" stopColor="#3A56FF" /></linearGradient></defs>
                  </svg>
                  <span className="text-xs font-bold text-[#3A56FF]">iyzico</span>
                </div>
                {/* Visa Logo */}
                <div className="px-2.5 py-1.5 bg-white border border-surface-container" title="Visa">
                  <svg width="36" height="12" viewBox="0 0 780 500" fill="none">
                    <path d="M293.2 348.7l33.4-195.8h53.4l-33.4 195.8h-53.4z" fill="#1A1F71" />
                    <path d="M530.9 157.5c-10.5-4-27.1-8.3-47.8-8.3-52.7 0-89.8 26.5-90.1 64.5-.3 28.1 26.5 43.8 46.8 53.1 20.8 9.6 27.8 15.7 27.7 24.3-.1 13.1-16.6 19.1-32 19.1-21.4 0-32.7-3-50.3-10.2l-6.9-3.1-7.5 43.8c12.5 5.5 35.5 10.2 59.4 10.5 56.1 0 92.5-26.2 92.8-66.9.2-22.3-14.1-39.3-45-53.2-18.7-9.1-30.2-15.1-30.1-24.3 0-8.1 9.7-16.8 30.7-16.8 17.5-.3 30.2 3.5 40.1 7.5l4.8 2.3 7.4-42.3z" fill="#1A1F71" />
                    <path d="M612.6 152.9h-41.2c-12.8 0-22.3 3.5-27.9 16.2l-79.2 179.6h56.1s9.2-24.1 11.2-29.4h68.5c1.6 6.9 6.5 29.4 6.5 29.4h49.6l-43.6-195.8zm-65.8 126.3c4.4-11.3 21.4-54.8 21.4-54.8-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.3 47.1 12.5 56.6h-44.6z" fill="#1A1F71" />
                    <path d="M248.8 152.9l-52.2 133.5-5.6-27.2c-9.7-31.2-39.9-65.1-73.7-82l47.8 171.4h56.5l84.1-195.7h-56.9z" fill="#1A1F71" />
                  </svg>
                </div>
                {/* MasterCard Logo */}
                <div className="px-2.5 py-1.5 bg-white border border-surface-container" title="MasterCard">
                  <svg width="32" height="20" viewBox="0 0 152.407 108" fill="none">
                    <rect width="152.407" height="108" rx="8" fill="transparent" />
                    <circle cx="60.412" cy="54" r="34" fill="#EB001B" />
                    <circle cx="91.995" cy="54" r="34" fill="#F79E1B" />
                    <path d="M76.204 27.97a33.94 33.94 0 0 0-12.79 26.03 33.94 33.94 0 0 0 12.79 26.03A33.94 33.94 0 0 0 88.994 54a33.94 33.94 0 0 0-12.79-26.03z" fill="#FF5F00" />
                  </svg>
                </div>
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

      {/* Payment Methods Bar */}
      <div className="border-t border-surface-container bg-surface-container-low/50">
        <div className="page-container py-5 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-xs text-secondary font-medium uppercase tracking-wider">Ödeme Yöntemleri</span>
          <div className="flex items-center gap-3">
            {/* iyzico ile Öde */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-surface-container rounded shadow-sm" title="iyzico ile Öde">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M2 6l8 6-8 6V6z" fill="url(#iyz-bot)" />
                <defs><linearGradient id="iyz-bot" x1="2" y1="6" x2="2" y2="18"><stop stopColor="#7DB9FF" /><stop offset="1" stopColor="#3A56FF" /></linearGradient></defs>
              </svg>
              <span className="text-sm font-bold text-[#3A56FF]">iyzico</span>
              <span className="text-[10px] text-gray-400 font-medium">ile Öde</span>
            </div>
            {/* Visa */}
            <div className="flex items-center px-3 py-2 bg-white border border-surface-container rounded shadow-sm" title="Visa">
              <svg width="48" height="16" viewBox="0 0 780 500" fill="none">
                <path d="M293.2 348.7l33.4-195.8h53.4l-33.4 195.8h-53.4z" fill="#1A1F71" />
                <path d="M530.9 157.5c-10.5-4-27.1-8.3-47.8-8.3-52.7 0-89.8 26.5-90.1 64.5-.3 28.1 26.5 43.8 46.8 53.1 20.8 9.6 27.8 15.7 27.7 24.3-.1 13.1-16.6 19.1-32 19.1-21.4 0-32.7-3-50.3-10.2l-6.9-3.1-7.5 43.8c12.5 5.5 35.5 10.2 59.4 10.5 56.1 0 92.5-26.2 92.8-66.9.2-22.3-14.1-39.3-45-53.2-18.7-9.1-30.2-15.1-30.1-24.3 0-8.1 9.7-16.8 30.7-16.8 17.5-.3 30.2 3.5 40.1 7.5l4.8 2.3 7.4-42.3z" fill="#1A1F71" />
                <path d="M612.6 152.9h-41.2c-12.8 0-22.3 3.5-27.9 16.2l-79.2 179.6h56.1s9.2-24.1 11.2-29.4h68.5c1.6 6.9 6.5 29.4 6.5 29.4h49.6l-43.6-195.8zm-65.8 126.3c4.4-11.3 21.4-54.8 21.4-54.8-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.3 47.1 12.5 56.6h-44.6z" fill="#1A1F71" />
                <path d="M248.8 152.9l-52.2 133.5-5.6-27.2c-9.7-31.2-39.9-65.1-73.7-82l47.8 171.4h56.5l84.1-195.7h-56.9z" fill="#1A1F71" />
              </svg>
            </div>
            {/* MasterCard */}
            <div className="flex items-center px-3 py-2 bg-white border border-surface-container rounded shadow-sm" title="MasterCard">
              <svg width="40" height="24" viewBox="0 0 152.407 108" fill="none">
                <circle cx="60.412" cy="54" r="34" fill="#EB001B" />
                <circle cx="91.995" cy="54" r="34" fill="#F79E1B" />
                <path d="M76.204 27.97a33.94 33.94 0 0 0-12.79 26.03 33.94 33.94 0 0 0 12.79 26.03A33.94 33.94 0 0 0 88.994 54a33.94 33.94 0 0 0-12.79-26.03z" fill="#FF5F00" />
              </svg>
            </div>
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
