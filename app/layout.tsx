import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: {
    default: "Altunel Bisiklet — Türkiye'nin Güvenilir Bisiklet Mağazası",
    template: '%s | Altunel Bisiklet',
  },
  description:
    'Bisiklet, elektrikli bisiklet, aksesuar ve yedek parça kategorilerinde en kaliteli ürünleri keşfedin. Dağ bisikleti, şehir bisikleti, yol bisikleti ve çocuk bisikleti. Türkiye genelinde hızlı kargo.',
  keywords: [
    'bisiklet',
    'elektrikli bisiklet',
    'dağ bisikleti',
    'şehir bisikleti',
    'yol bisikleti',
    'çocuk bisikleti',
    'bisiklet aksesuar',
    'yedek parça',
    'bisiklet mağazası',
    'altunel bisiklet',
  ],
  authors: [{ name: 'Altunel Bisiklet' }],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://altunelbisiklet.com',
    siteName: 'Altunel Bisiklet',
    title: "Altunel Bisiklet — Türkiye'nin Güvenilir Bisiklet Mağazası",
    description:
      'Bisiklet, elektrikli bisiklet, aksesuar ve yedek parça kategorilerinde en kaliteli ürünleri keşfedin.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

