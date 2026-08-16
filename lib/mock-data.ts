import { Category, Product } from '@/types'

// ──────────────────────────────────────────────
// KATEGORİLER  (3 seviyeli hiyerarşi)
// ──────────────────────────────────────────────

export const MOCK_CATEGORIES: Category[] = [
  // ── ANA KATEGORİLER ──────────────────────────
  {
    id: 'bisikletler',
    name: 'BİSİKLETLER',
    slug: 'bisikletler',
    parent_id: null,
    sort_order: 1,
    description: 'Dağ, şehir, yol ve çocuk bisikletleri',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    created_at: '2024-01-01',
  },
  {
    id: 'elektrikli-bisikletler',
    name: 'ELEKTRİKLİ BİSİKLETLER',
    slug: 'elektrikli-bisikletler',
    parent_id: null,
    sort_order: 2,
    description: 'Elektrikli bisikletler ve aksesuar',
    image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80',
    created_at: '2024-01-01',
  },
  {
    id: 'aksesuarlar',
    name: 'AKSESUARLAR & YEDEK PARÇA',
    slug: 'aksesuarlar',
    parent_id: null,
    sort_order: 3,
    description: 'Sürüş ekipmanları ve yedek parçalar',
    image_url: 'https://images.unsplash.com/photo-1591378603223-e15b45a81640?w=600&q=80',
    created_at: '2024-01-01',
  },

  // ── BİSİKLETLER ALT KATEGORİLERİ ────────────
  {
    id: 'dag-bisikleti',
    name: 'Dağ Bisikleti',
    slug: 'dag-bisikleti',
    parent_id: 'bisikletler',
    sort_order: 1,
    description: 'Zorlu arazi koşulları için',
    created_at: '2024-01-01',
  },
  {
    id: 'sehir-bisikleti',
    name: 'Şehir Bisikleti',
    slug: 'sehir-bisikleti',
    parent_id: 'bisikletler',
    sort_order: 2,
    description: 'Günlük şehir kullanımı için',
    created_at: '2024-01-01',
  },
  {
    id: 'yol-yaris-bisikleti',
    name: 'Yol Yarış Bisikleti',
    slug: 'yol-yaris-bisikleti',
    parent_id: 'bisikletler',
    sort_order: 3,
    description: 'Hız ve performans odaklı',
    created_at: '2024-01-01',
  },
  {
    id: 'cocuk-bisikleti',
    name: 'Çocuk Bisikleti',
    slug: 'cocuk-bisikleti',
    parent_id: 'bisikletler',
    sort_order: 4,
    description: 'Çocuklar için güvenli bisikletler',
    created_at: '2024-01-01',
  },

  // ── ELEKTRİKLİ BİSİKLETLER ALT KATEGORİLERİ ─
  {
    id: 'elektrikli-bisiklet',
    name: 'Elektrikli Bisiklet',
    slug: 'elektrikli-bisiklet',
    parent_id: 'elektrikli-bisikletler',
    sort_order: 1,
    description: 'Elektrikli bisiklet modelleri',
    created_at: '2024-01-01',
  },
  {
    id: 'elektrikli-yedek-parca',
    name: 'Elektrikli Bisiklet Yedek Parça & Aksesuar',
    slug: 'elektrikli-yedek-parca',
    parent_id: 'elektrikli-bisikletler',
    sort_order: 2,
    description: 'Elektrikli bisikletler için parçalar',
    created_at: '2024-01-01',
  },

  // ── AKSESUARLAR & YEDEK PARÇA ─────────────────
  {
    id: 'surус-aksesuarlari',
    name: 'Sürüş Aksesuarları & Ekipman',
    slug: 'surus-aksesuarlari',
    parent_id: 'aksesuarlar',
    sort_order: 1,
    description: 'Sürüş güvenliği ve ekipmanları',
    created_at: '2024-01-01',
  },
  {
    id: 'yedek-parca',
    name: 'Yedek Parça (Komponentler)',
    slug: 'yedek-parca',
    parent_id: 'aksesuarlar',
    sort_order: 2,
    description: 'Bisiklet komponent ve yedek parçaları',
    created_at: '2024-01-01',
  },
  {
    id: 'motosiklet-urunleri',
    name: 'Motosiklet Ürünleri',
    slug: 'motosiklet-urunleri',
    parent_id: 'aksesuarlar',
    sort_order: 3,
    description: 'Motosiklet lastik ve aksesuarları',
    created_at: '2024-01-01',
  },

  // ── SÜRÜŞ AKSESUARLARı ALT KATEGORİLERİ ──────
  { id: 'eldiven', name: 'Eldiven', slug: 'eldiven', parent_id: 'surус-aksesuarlari', sort_order: 1, description: 'Bisiklet eldivenleri', created_at: '2024-01-01' },
  { id: 'bisiklet-kaski', name: 'Bisiklet Kaskı', slug: 'bisiklet-kaski', parent_id: 'surус-aksesuarlari', sort_order: 2, description: 'Güvenlik kaskları', created_at: '2024-01-01' },
  { id: 'bisiklet-kilitleri', name: 'Bisiklet Kilitleri', slug: 'bisiklet-kilitleri', parent_id: 'surус-aksesuarlari', sort_order: 3, description: 'Güvenlik kilitleri', created_at: '2024-01-01' },
  { id: 'aydinlatma-ikaz', name: 'Bisiklet Aydınlatma İkaz', slug: 'aydinlatma-ikaz', parent_id: 'surус-aksesuarlari', sort_order: 4, description: 'Far ve arka ışık', created_at: '2024-01-01' },
  { id: 'bisiklet-pompasi', name: 'Bisiklet Pompası', slug: 'bisiklet-pompasi', parent_id: 'surус-aksesuarlari', sort_order: 5, description: 'Lastik pompaları', created_at: '2024-01-01' },
  { id: 'bisiklet-tasiyici', name: 'Bisiklet Taşıyıcı', slug: 'bisiklet-tasiyici', parent_id: 'surус-aksesuarlari', sort_order: 6, description: 'Araç üstü bisiklet taşıyıcılar', created_at: '2024-01-01' },

  // ── YEDEK PARÇA ALT KATEGORİLERİ ─────────────
  { id: 'dis-lastik', name: 'Dış Lastik', slug: 'dis-lastik', parent_id: 'yedek-parca', sort_order: 1, description: 'Bisiklet dış lastikleri', created_at: '2024-01-01' },
  { id: 'ic-lastik', name: 'İç Lastik', slug: 'ic-lastik', parent_id: 'yedek-parca', sort_order: 2, description: 'Bisiklet iç lastikleri', created_at: '2024-01-01' },
  { id: 'fren-takimi', name: 'Fren Takımı', slug: 'fren-takimi', parent_id: 'yedek-parca', sort_order: 3, description: 'Komple fren setleri', created_at: '2024-01-01' },
  { id: 'fren-balatasi', name: 'Fren Balatası', slug: 'fren-balatasi', parent_id: 'yedek-parca', sort_order: 4, description: 'Fren balataları', created_at: '2024-01-01' },
  { id: 'gidon', name: 'Gidon', slug: 'gidon', parent_id: 'yedek-parca', sort_order: 5, description: 'Bisiklet gidonları', created_at: '2024-01-01' },
  { id: 'ruble', name: 'Ruble', slug: 'ruble', parent_id: 'yedek-parca', sort_order: 6, description: 'Bisiklet rubleleri', created_at: '2024-01-01' },

  // ── MOTOSİKLET ÜRÜNLER ALT KATEGORİLERİ ───────
  { id: 'motosiklet-lastikleri', name: 'Motosiklet Lastikleri', slug: 'motosiklet-lastikleri', parent_id: 'motosiklet-urunleri', sort_order: 1, description: 'Motosiklet lastik çeşitleri', created_at: '2024-01-01' },
  { id: 'motosiklet-karter', name: 'Motosiklet Karter Korumaları', slug: 'motosiklet-karter', parent_id: 'motosiklet-urunleri', sort_order: 2, description: 'Motor korumaları', created_at: '2024-01-01' },
]

// ──────────────────────────────────────────────
// ÜRÜNLER
// ──────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  // Dağ Bisikletleri
  {
    id: '1',
    category_id: 'dag-bisikleti',
    name: 'Trail Blazer X 29"',
    slug: 'trail-blazer-x-29',
    description: 'Zorlu dağ yolları için geliştirilmiş 29" tekerlek hardtail dağ bisikleti. Alüminyum kadro, ön amortisör ve hidrolik disk fren sistemi.',
    price: 32500,
    original_price: 38000,
    stock: 8,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuACVmOzvihcUEvXXNE76y1jI0zC1mJqsWnbH_Q85Cjh4OHXkkq-QKrjOAV6PaDR17gqpe3wMYPDkM6GSVHOFzquRJ9DzCOo-ikwrcEC01LCULupzwbnxaLOacPhvOSPW-mkawvgXJEbehaByfahpcaZxdzy6K9kJOUaglQX_70yhUeWvBZBQx7s7cQJaOpfSsBgJl4zDlPXcEgKdf078bjVsVRLoaOgvb4Jx_oagKjHEGA8Dn1xAI-7eg'],
    brand: 'Altunel Pro',
    sku: 'ALT-TBX-29',
    is_featured: true,
    is_active: true,
    frame_sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mat Gri', 'Kırmızı/Siyah'],
    specifications: { 'Kadro': 'Alüminyum', 'Tekerlek': '29"', 'Vites': '21 Vites Shimano', 'Fren': 'Hidrolik Disk' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    category_id: 'dag-bisikleti',
    name: 'Mountain Pro 27.5"',
    slug: 'mountain-pro-27-5',
    description: 'Tam süspansiyonlu dağ bisikleti. 27.5" çift amortisörlü, 24 vites Shimano sistemi.',
    price: 45900,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80'],
    brand: 'Altunel Pro',
    sku: 'ALT-MP-275',
    is_featured: false,
    is_active: true,
    frame_sizes: ['S', 'M', 'L'],
    colors: ['Yeşil/Siyah', 'Turuncu/Siyah'],
    specifications: { 'Kadro': 'Alüminyum', 'Tekerlek': '27.5"', 'Vites': '24 Vites', 'Fren': 'Hidrolik Disk' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },

  // Yol Yarış
  {
    id: '3',
    category_id: 'yol-yaris-bisikleti',
    name: 'Aero V1 Pro',
    slug: 'aero-v1-pro',
    description: 'Karbon çerçeveli aerodinamik yol bisikleti. Yarışçılar için tasarlandı.',
    price: 45900,
    original_price: 52000,
    stock: 3,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCxthpvcMDDAIGzL9VQ3iyqIJOhQRih2rhHR5UjnHOsdDX7sPkD_YdE-w6DJkKXOAJa9cHta0b9Mls-kjQcM0Dj7dc-9CrB_DbvD4L5ve-IaChOJnNHVCf5LCxu0HcYq2v6n8bNgxQJXXmRTqbgtXS0wHnGQhl4tiRsVoCK6TKyKmmOgU0kUiwXEqqWVJfDe3HpwtTLWsAsgEfOqEmloBK7FlPYSJIYaBJWIM7EseaovvdFUvqUJK0idQ'],
    brand: 'Altunel Race',
    sku: 'ALT-AV1-PRO',
    is_featured: true,
    is_active: true,
    frame_sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Karbon/Kırmızı', 'Siyah/Beyaz'],
    specifications: { 'Kadro': 'Karbon Fiber', 'Vites': '22 Vites Shimano 105', 'Fren': 'Disk Fren' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },

  // Şehir Bisikleti
  {
    id: '4',
    category_id: 'sehir-bisikleti',
    name: 'City Comfort 700c',
    slug: 'city-comfort-700c',
    description: 'Rahat oturuş pozisyonu, dahili vitesler ve çamurluklar ile günlük şehir kullanımı için ideal.',
    price: 12800,
    original_price: 14500,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'],
    brand: 'Altunel City',
    sku: 'ALT-CC-700',
    is_featured: true,
    is_active: true,
    frame_sizes: ['S', 'M', 'L'],
    colors: ['Beyaz', 'Siyah', 'Kırmızı'],
    specifications: { 'Kadro': 'Alüminyum', 'Tekerlek': '700c', 'Vites': '7 Vites Dahili', 'Aksesuarlar': 'Çamurluk + Bagaj' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },

  // Elektrikli Bisiklet
  {
    id: '5',
    category_id: 'elektrikli-bisiklet',
    name: 'E-City Urban',
    slug: 'e-city-urban',
    description: 'Şehir içi elektrikli bisiklet. 250W Bafang motor, 80-100 km menzil ve entegre LED aydınlatma sistemi.',
    price: 58000,
    original_price: 65000,
    stock: 6,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBUHyNlb9ZNvWeUdB2ofmzuEoWzY3KvUZK17sWVGp8v0SO3iCAgGu1xjTMI8vH17vK2C8C_1m-P5X8i32q4SQD5kjYwvzvCFTHrU8kT1nyuTZGALUFRWvPWcTaJ1OVNMMpuiUuUMXJX52NDve3KOzzkjs_GEBlWQRdXjfMj7lHl0ZMrdl6mDP9Blkie_bzWlxVAYL5S2GBVzBWvpB2vupyNAKGA6vKCWDgDGURG1ZsJKrgRETc1VISN2A'],
    brand: 'Altunel E',
    sku: 'ALT-ECU-250',
    is_featured: true,
    is_active: true,
    frame_sizes: ['M', 'L'],
    colors: ['Beyaz', 'Antrasit'],
    specifications: { 'Motor': '250W Bafang', 'Menzil': '80-100 km', 'Batarya': '36V 14Ah', 'Hız': '25 km/s' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '6',
    category_id: 'elektrikli-bisiklet',
    name: 'Mountain-E X',
    slug: 'mountain-e-x',
    description: 'Zorlu arazi koşulları için maksimum güç. 500W Bosch CX motor, çift süspansiyon ve hidrolik disk frenler.',
    price: 85000,
    stock: 4,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCScynY51-UB6lsu8DCv7cSq6E7_-GmwIXiPwC93JnMgJLWWbpH1XYv-j572YnqY9FR1R1CwZMRmhmBUrTSO-9ko0ljc5K-tJgwqVvnAbE8VbBlBjseX0WwzBIE-F_71MJ0-bsp6WSx8DSJ1nvW_Q3PBoorYEtD3KRBYiKljZyYGKfhCyfSjw4itB3O0TaqYxzqm2p92QWmC6jHyHj6JfWYQcLfIcdaBGxDQLknVhPhm4RknHsiRpJYUA'],
    brand: 'Altunel E',
    sku: 'ALT-MEX-500',
    is_featured: true,
    is_active: true,
    frame_sizes: ['M', 'L', 'XL'],
    colors: ['Mat Siyah', 'Mat Gri'],
    specifications: { 'Motor': '500W Bosch CX', 'Menzil': '60-80 km', 'Batarya': '48V 16Ah', 'Süspansiyon': 'Çift' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },

  // Çocuk Bisikleti
  {
    id: '7',
    category_id: 'cocuk-bisikleti',
    name: 'Kids Fun 20"',
    slug: 'kids-fun-20',
    description: '6-10 yaş için tasarlanmış güvenli ve eğlenceli çocuk bisikleti. Alüminyum kadro, 6 vites.',
    price: 5900,
    original_price: 7500,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80'],
    brand: 'Altunel Kids',
    sku: 'ALT-KF-20',
    is_featured: false,
    is_active: true,
    frame_sizes: ['One Size'],
    colors: ['Mavi', 'Pembe', 'Yeşil'],
    specifications: { 'Yaş': '6-10 Yaş', 'Tekerlek': '20"', 'Vites': '6 Vites', 'Güvenlik': 'V-Fren' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },

  // Aksesuar
  {
    id: '8',
    category_id: 'bisiklet-kaski',
    name: 'Aero Helm Pro',
    slug: 'aero-helm-pro',
    description: 'Aerodinamik tasarım, 25 hava kanalı, hafif EPS köpük çekirdeği. CE onaylı güvenlik kaskı.',
    price: 3200,
    stock: 35,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCVxtwzchbjzLp4rR0x6n8P_PWH-P19fm-sMSWvov_8jEddgUrvHWFbefadQVoIDNotsa9bIN5Tzsm3w8vCQCfoBQ0MyVVvd8nxWAjmk-e6BpKN5axR-1iRHAaFWkMxQ2JcA3P_jG9b7tfc1ynvsUcdUQJiV3hFLxRwD695RmhgWz84mCHHd_kQXsYlkbk_07GLuAdzdLycXT_7a5DHDzUVqm_fERJpGULgoNsGF6aL5Rr4NmZDTH7R9w'],
    brand: 'Altunel Gear',
    sku: 'ALT-AHP-L',
    is_featured: true,
    is_active: true,
    frame_sizes: ['S/M', 'L/XL'],
    colors: ['Beyaz/Kırmızı', 'Siyah', 'Mavi'],
    specifications: { 'Tip': 'Yol Kasığı', 'Beden': 'S/M — L/XL', 'Sertifika': 'CE EN1078' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },

  // Lastik
  {
    id: '9',
    category_id: 'dis-lastik',
    name: 'GrandPrix 5000 Dış Lastik',
    slug: 'grandprix-5000-dis-lastik',
    description: 'BlackChili compound teknolojisi ile düşük yuvarlanma direnci ve üstün tutuş. Yol bisikleti için en iyi tercih.',
    price: 980,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1591378603223-e15b45a81640?w=800&q=80'],
    brand: 'Continental',
    sku: 'CTL-GP5000-700',
    is_featured: false,
    is_active: true,
    frame_sizes: [],
    colors: ['Siyah'],
    specifications: { 'Boyut': '700x25c', 'Tip': 'Katlanır', 'Kullanım': 'Yol' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },

  // Fold-E
  {
    id: '10',
    category_id: 'elektrikli-bisiklet',
    name: 'Fold-E Compact',
    slug: 'fold-e-compact',
    description: 'Toplu taşıma ve dar alanlar için ideal. 250W hub motor, hızlı katlanma mekanizması ve taşınabilir batarya.',
    price: 32000,
    stock: 8,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB7vzWAf1CAXIYyJ4E4NxZ1Z-3LSN_Kq8VANO3-nlId7BiUvbdXHdoe0dV4PArZAepaGJfC-eXeS3KZiXt6gA8_1K6vTHau7Cea2atnNP--CChGDeTU6SNoQSkre8unTFT7EphetA35nHkExFXKpEwk1X7vH2pdHNDZx1YbXEN0TH5X8tQ6yq-OwqN4lNjcFWpijYNNInTj3Q79RAYvForBt2FhJWhOAOkIH4CFOg9QP2I5VYSq2_oq-w'],
    brand: 'Altunel E',
    sku: 'ALT-FEC-250',
    is_featured: false,
    is_active: true,
    frame_sizes: ['One Size'],
    colors: ['Siyah/Beyaz', 'Gümüş'],
    specifications: { 'Motor': '250W Hub', 'Menzil': '40-50 km', 'Katlanır': 'Evet', 'Ağırlık': '16 kg' },
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
]

// ── Yardımcı fonksiyonlar ────────────────────────────

/** Ana menü için yalnızca üst seviye (parent_id = null) kategoriler */
export const TOP_LEVEL_CATEGORIES = MOCK_CATEGORIES.filter((c) => c.parent_id === null)

/** Belirli bir üst kategori için alt kategoriler */
export function getSubCategories(parentId: string): Category[] {
  return MOCK_CATEGORIES.filter((c) => c.parent_id === parentId)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

/** Belirli bir kategori slug'ına göre ürün getir */
export function getProductsByCategory(slug: string): Product[] {
  const cat = MOCK_CATEGORIES.find((c) => c.slug === slug)
  if (!cat) return []
  const childSlugs = getSubCategories(cat.id).map((c) => c.id)
  return MOCK_PRODUCTS.filter(
    (p) => p.category_id === cat.id || childSlugs.includes(p.category_id)
  )
}

/** Öne çıkan ürünler */
export const FEATURED_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.is_featured)
