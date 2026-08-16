import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, MapPin, Mail, Clock, ChevronRight } from 'lucide-react'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'İletişim — Altunel Bisiklet',
  description: 'Altunel Bisiklet iletişim bilgileri. Telefon, adres ve e-posta ile bize ulaşın.',
}

const INFO_CARDS = [
  {
    icon: Phone,
    title: 'Telefon',
    content: '0 (531) 642 11 44',
    href: 'tel:+905316421144',
    sub: 'Pazartesi – Cumartesi: 09:00 – 18:00',
  },
  {
    icon: MapPin,
    title: 'Adres',
    content: 'Namık Kemal, 10. Sk. No:61\n34513 Esenyurt / İstanbul',
    href: 'https://maps.google.com/?q=Namık+Kemal+Sk+No61+Esenyurt+İstanbul',
    sub: 'Mağazamızı ziyaret edin',
  },
  {
    icon: Mail,
    title: 'E-posta',
    content: 'info@altunelbisiklet.com',
    href: 'mailto:info@altunelbisiklet.com',
    sub: '24 saat içinde yanıt veriyoruz',
  },
  {
    icon: Clock,
    title: 'Çalışma Saatleri',
    content: 'Pzt – Cmt: 09:00 – 18:00',
    href: null,
    sub: 'Pazar günleri kapalıyız',
  },
]

export default function IletisimPage() {
  return (
    <div className="page-container py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-secondary mb-10">
        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-on-surface font-medium">İletişim</span>
      </nav>

      {/* Başlık */}
      <div className="mb-12 pb-6 border-b border-surface-container">
        <h1 className="font-headline font-bold text-headline-md md:text-headline-lg text-on-surface mb-3">
          İletişim
        </h1>
        <p className="text-body-md text-secondary max-w-xl">
          Sorularınız, önerileriniz veya sipariş desteği için bizimle iletişime geçin.
          Size en kısa sürede geri dönüş yapacağız.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Sol — İletişim Bilgileri */}
        <div className="lg:col-span-2 space-y-4">
          {INFO_CARDS.map(({ icon: Icon, title, content, href, sub }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-5 border border-surface-container bg-white hover:border-primary transition-colors duration-200 group"
            >
              <div className="w-10 h-10 bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-200">
                <Icon className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">{title}</p>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="font-semibold text-on-surface hover:text-primary transition-colors text-sm whitespace-pre-line"
                  >
                    {content}
                  </a>
                ) : (
                  <p className="font-semibold text-on-surface text-sm whitespace-pre-line">{content}</p>
                )}
                <p className="text-xs text-secondary mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sağ — İletişim Formu (Client Component) */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
      </div>

      {/* Harita placeholder */}
      <div className="mt-12 border border-surface-container bg-surface-container-low h-64 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="font-semibold text-on-surface">Namık Kemal, 10. Sk. No:61</p>
          <p className="text-sm text-secondary mt-1">34513 Esenyurt / İstanbul</p>
          <a
            href="https://maps.google.com/?q=Namık+Kemal+Sk+No61+Esenyurt+İstanbul"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline font-semibold"
          >
            Google Maps&apos;te Aç
          </a>
        </div>
      </div>
    </div>
  )
}
