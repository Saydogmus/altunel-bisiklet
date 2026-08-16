# Altunel Bisiklet — E-Ticaret Platformu

Modern, şık ve dönüşüm odaklı bisiklet e-ticaret sitesi.

## 🚀 Hızlı Başlangıç

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarla
```bash
cp .env.local.example .env.local
# .env.local dosyasını kendi anahtarlarınızla doldurun
```

### 3. Supabase Kurulumu
1. [supabase.com](https://supabase.com) adresinde hesap oluşturun
2. Yeni proje oluşturun
3. `supabase/schema.sql` dosyasını SQL Editor'da çalıştırın
4. Project URL ve anon key'i `.env.local`'a ekleyin

### 4. Stripe Kurulumu
1. [stripe.com](https://stripe.com) adresinde hesap oluşturun (Test modu)
2. API anahtarlarını `.env.local`'a ekleyin
3. Webhook endpoint: `https://your-domain.com/api/stripe/webhook`

### 5. Geliştirme Sunucusunu Başlat
```bash
npm run dev
# http://localhost:3000
```

## 📁 Proje Yapısı

```
app/
├── (store)/          # Müşteri tarafı
│   ├── page.tsx      # Ana sayfa
│   ├── urunler/      # Ürün listeleme ve detay
│   ├── kategori/     # Kategori sayfaları
│   ├── sepet/        # Alışveriş sepeti
│   ├── odeme/        # Stripe ödeme
│   └── hesap/        # Auth sayfaları
└── (admin)/          # Admin paneli
    └── admin/        # Dashboard, ürünler, siparişler, stok
```

## 🔑 Admin Paneli

- URL: `http://localhost:3000/admin/giris`
- Demo E-posta: `admin@altunelbisiklet.com`
- Demo Şifre: `admin123`

## 🛠 Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Veritabanı | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Ödeme | Stripe |
| State | Zustand |
| Icons | Lucide React |
| Language | TypeScript |

## 📊 Veritabanı Tabloları

- `profiles` — Kullanıcı profilleri (Supabase Auth bağlantılı)
- `categories` — Ürün kategorileri
- `products` — Ürünler (fiyat, stok, görseller, özellikler)
- `orders` — Siparişler (Stripe entegrasyonlu)
- `order_items` — Sipariş kalemleri
- `reviews` — Ürün yorumları

## 🔒 Güvenlik

- Row Level Security (RLS) tüm tablolarda aktif
- Admin erişimi rol tabanlı (`profiles.role = 'admin'`)
- Stripe webhook signature doğrulaması
- HTTPS zorunlu (production)

## 📦 Özellikler

### Müşteri Tarafı
- ✅ Modern Hero Banner
- ✅ 4 Kategori (Bisiklet, E-Bisiklet, Scooter, Yedek Parça)
- ✅ Ürün Listeleme (arama, filtreleme, sıralama)
- ✅ Ürün Detay Sayfası (teknik özellikler, çoklu görsel)
- ✅ Sepet (Zustand + localStorage)
- ✅ Sağdan Açılan Sepet Çekmecesi
- ✅ Kullanıcı Kaydı & Girişi
- ✅ Stripe Checkout
- ✅ Sipariş Başarı/İptal Sayfaları
- ✅ Mobil Uyumlu Tasarım

### Admin Paneli
- ✅ Güvenli Admin Girişi (rol tabanlı)
- ✅ Dashboard (satış, sipariş, müşteri istatistikleri)
- ✅ Ürün CRUD (ekle, listele, düzenle, sil)
- ✅ Sipariş Yönetimi (durum güncelleme)
- ✅ Stok Yönetimi (inline düzenleme)
