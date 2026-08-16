import Link from 'next/link'
import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Altunel Bisiklet',
  description: 'Altunel Bisiklet mesafeli satış sözleşmesi ve ön bilgilendirme formu.',
}

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="page-container py-12 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-secondary mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
        <span>/</span>
        <span className="text-on-surface font-medium">Mesafeli Satış Sözleşmesi</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4 mb-10 pb-6 border-b border-surface-container">
        <div className="w-12 h-12 bg-surface-container flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">
            Mesafeli Satış Sözleşmesi
          </h1>
          <p className="text-secondary mt-1 text-sm">Son güncelleme: Ağustos 2025</p>
        </div>
      </div>

      {/* İçerik */}
      <div className="max-w-3xl">
        <div className="prose-content space-y-8">

          <section>
            <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Madde 1 — Taraflar</h2>
            <div className="bg-surface-container-low border border-surface-container p-5 text-sm text-secondary leading-relaxed space-y-2">
              <p><strong className="text-on-surface">SATICI:</strong> Altunel Bisiklet — Namık Kemal, 10. Sk. No:61, 34513 Esenyurt / İstanbul</p>
              <p><strong className="text-on-surface">Telefon:</strong> 0 (531) 642 11 44</p>
              <p><strong className="text-on-surface">E-posta:</strong> info@altunelbisiklet.com</p>
            </div>
            <p className="text-sm text-secondary mt-3 leading-relaxed">
              <strong className="text-on-surface">ALICI:</strong> Sipariş formunda belirtilen ad soyad, adres ve iletişim bilgilerine sahip kişi.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Madde 2 — Konu</h2>
            <p className="text-sm text-secondary leading-relaxed">
              İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği çerçevesinde, ALICI&apos;nın SATICI&apos;ya ait altunelbisiklet.com internet sitesi üzerinden elektronik ortamda siparişini verdiği ürünlerin satışı ve teslimatına ilişkin olarak tarafların hak ve yükümlülüklerini düzenler.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Madde 3 — Sözleşme Konusu Ürün(ler)</h2>
            <p className="text-sm text-secondary leading-relaxed">
              ALICI tarafından sipariş edilen ürünlerin özellikleri, miktarları ve bedelleri ödeme sayfasındaki sipariş özeti bölümünde gösterilmektedir. Söz konusu bilgiler sözleşmenin ayrılmaz bir parçasını oluşturur.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Madde 4 — Teslimat ve Kargo</h2>
            <ul className="text-sm text-secondary leading-relaxed space-y-2 list-disc list-inside">
              <li>Siparişler, stok durumuna göre 2–5 iş günü içinde kargoya verilir.</li>
              <li>Teslimat, sipariş formunda belirtilen adrese yapılır.</li>
              <li>Kargo ücreti sipariş tutarı 2.000 ₺ ve üzeri olduğunda ücretsizdir.</li>
              <li>Ürün hasarlı gelirse teslim almayınız ve kargo firmasına tutanak tutturunuz.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Madde 5 — Cayma Hakkı</h2>
            <p className="text-sm text-secondary leading-relaxed">
              ALICI, teslim tarihinden itibaren <strong className="text-on-surface">14 (on dört) gün</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma bildirimi info@altunelbisiklet.com adresine yazılı olarak iletilmelidir.
            </p>
            <p className="text-sm text-secondary leading-relaxed mt-2">
              Cayma hakkının kullanımında ürün, orijinal ambalajında, kullanılmamış ve hasarsız olarak iade edilmelidir. İade kargo bedeli ALICI&apos;ya aittir.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Madde 6 — Gizlilik</h2>
            <p className="text-sm text-secondary leading-relaxed">
              Kişisel verileriniz <Link href="/gizlilik-politikasi" className="text-primary hover:underline font-medium">Gizlilik Politikamız</Link> çerçevesinde işlenmekte olup üçüncü taraflarla paylaşılmamaktadır.
            </p>
          </section>

          <section>
            <h2 className="font-headline font-bold text-lg text-on-surface mb-3">Madde 7 — Uyuşmazlık Çözümü</h2>
            <p className="text-sm text-secondary leading-relaxed">
              İşbu sözleşmeden doğan uyuşmazlıklarda İstanbul Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>

          <div className="mt-10 p-5 bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
            <p className="font-semibold mb-1">⚠ Taslak Sözleşme</p>
            <p>Bu sözleşme taslak halindedir. Ticari kullanım öncesinde bir hukuk danışmanı tarafından incelenip onaylanması tavsiye edilir.</p>
          </div>

        </div>
      </div>
    </div>
  )
}
