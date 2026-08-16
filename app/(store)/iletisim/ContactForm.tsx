'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Gerçek entegrasyonda API çağrısı yapılır (örn: Resend / EmailJS)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-white border border-surface-container p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-14 h-14 bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Mesajınız İletildi!</h3>
        <p className="text-secondary text-sm max-w-sm">
          En kısa sürede size geri dönüş yapacağız. Ortalama yanıt süremiz 24 saattir.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 btn-outline text-sm py-2.5 px-6"
        >
          Yeni Mesaj Gönder
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-surface-container p-8">
      <h2 className="font-headline font-bold text-xl text-on-surface mb-6">
        Mesaj Gönderin
      </h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact_name" className="block text-label-md text-on-surface mb-1.5">
              Ad Soyad *
            </label>
            <input id="contact_name" type="text" required placeholder="Adınız Soyadınız" className="input-field" />
          </div>
          <div>
            <label htmlFor="contact_email" className="block text-label-md text-on-surface mb-1.5">
              E-posta *
            </label>
            <input id="contact_email" type="email" required placeholder="ornek@eposta.com" className="input-field" />
          </div>
        </div>
        <div>
          <label htmlFor="contact_phone" className="block text-label-md text-on-surface mb-1.5">
            Telefon
          </label>
          <input id="contact_phone" type="tel" placeholder="0 (5XX) XXX XX XX" className="input-field" />
        </div>
        <div>
          <label htmlFor="contact_subject" className="block text-label-md text-on-surface mb-1.5">
            Konu *
          </label>
          <select id="contact_subject" required className="input-field">
            <option value="">Konu seçin...</option>
            <option>Ürün Bilgisi</option>
            <option>Sipariş Takibi</option>
            <option>İade / Değişim</option>
            <option>Teknik Destek</option>
            <option>Diğer</option>
          </select>
        </div>
        <div>
          <label htmlFor="contact_message" className="block text-label-md text-on-surface mb-1.5">
            Mesajınız *
          </label>
          <textarea
            id="contact_message"
            required
            rows={5}
            placeholder="Mesajınızı buraya yazın..."
            className="input-field resize-none"
          />
        </div>
        <button type="submit" className="btn-primary w-full justify-center" id="contact-submit-btn">
          Mesajı Gönder
        </button>
        <p className="text-xs text-secondary text-center">
          Gönderdiğiniz bilgiler{' '}
          <Link href="/kvkk" className="text-primary hover:underline">KVKK politikamız</Link>
          {' '}kapsamında işlenir.
        </p>
      </form>
    </div>
  )
}
