import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hesabım',
  description: 'Hesap bilgilerinizi görüntüleyin ve güncelleyin.',
}

export default function HesabimPage() {
  return (
    <div className="page-container py-16">
      <h1 className="font-headline font-bold text-headline-lg text-on-surface mb-6">Hesabım</h1>
      <p className="text-body-md text-secondary">
        Bu sayfa şu an taslak aşamasındadır. Yakında hesap bilgilerinizi ve adreslerinizi buradan yönetebileceksiniz.
      </p>
    </div>
  )
}
