import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Siparişlerim',
  description: 'Geçmiş siparişlerinizi görüntüleyin.',
}

export default function SiparislerPage() {
  return (
    <div className="page-container py-16">
      <h1 className="font-headline font-bold text-headline-lg text-on-surface mb-6">Siparişlerim</h1>
      <p className="text-body-md text-secondary">
        Bu sayfa şu an taslak aşamasındadır. Yakında geçmiş siparişlerinizi buradan görebileceksiniz.
      </p>
    </div>
  )
}
