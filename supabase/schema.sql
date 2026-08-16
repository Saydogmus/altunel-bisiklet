-- =====================================================================
-- ALTUNEL BİSİKLET — Supabase Veritabanı Şeması
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın
-- =====================================================================

-- 1. Profiller (auth.users ile 1-1)
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT,
  phone           TEXT,
  address_line1   TEXT,
  address_city    TEXT,
  address_zip     TEXT,
  is_admin        BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Yeni kullanıcı kaydında otomatik profil oluşturma
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Kategoriler (3 seviyeli hiyerarşi)
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order  INTEGER DEFAULT 0,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ürünler
CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id    UUID REFERENCES categories(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description    TEXT,
  base_price     NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  original_price NUMERIC(10, 2) CHECK (original_price >= 0),
  images         TEXT[] DEFAULT '{}',
  brand          TEXT,
  sku            TEXT UNIQUE,
  is_featured    BOOLEAN DEFAULT FALSE,
  is_active      BOOLEAN DEFAULT TRUE,
  specifications JSONB DEFAULT '{}',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Ürün Varyasyonları (Kadro Boyu + Renk + Stok)
CREATE TABLE IF NOT EXISTS product_variants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID REFERENCES products(id) ON DELETE CASCADE,
  frame_size   TEXT,
  color        TEXT,
  stock        INTEGER DEFAULT 0 CHECK (stock >= 0),
  sku          TEXT UNIQUE,
  price_offset NUMERIC(10, 2) DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Siparişler
CREATE TABLE IF NOT EXISTS orders (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_email              TEXT,
  status                   TEXT DEFAULT 'pending'
                           CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled')),
  stripe_payment_intent_id TEXT,
  total_amount             NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_fee             NUMERIC(10, 2) DEFAULT 99.90,
  shipping_address         JSONB,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Sipariş Kalemleri
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Stok Düşümü Fonksiyonu (sipariş tamamlandığında)
CREATE OR REPLACE FUNCTION decrement_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    -- Varyasyona göre stok düşümü
    UPDATE product_variants v
    SET stock = stock - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND oi.variant_id = v.id
      AND v.stock >= oi.quantity;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_decrement_stock ON orders;
CREATE TRIGGER trigger_decrement_stock
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION decrement_stock_on_order();

-- Updated_at otomasyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_self" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_all" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin_all" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variants_public_read" ON product_variants FOR SELECT USING (true);
CREATE POLICY "variants_admin_all" ON product_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_self" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_admin_all" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_self" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_admin" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- =====================================================================
-- SEED: Kategori Hiyerarşisi
-- =====================================================================

-- Ana kategoriler
INSERT INTO categories (name, slug, parent_id, sort_order, description) VALUES
  ('BİSİKLETLER',             'bisikletler',              NULL, 1, 'Dağ, şehir, yol ve çocuk bisikletleri'),
  ('ELEKTRİKLİ BİSİKLETLER', 'elektrikli-bisikletler',   NULL, 2, 'Elektrikli bisikletler ve aksesuar'),
  ('AKSESUARLAR & YEDEK PARÇA','aksesuarlar',             NULL, 3, 'Sürüş ekipmanları ve yedek parçalar')
ON CONFLICT (slug) DO NOTHING;

-- BİSİKLETLER alt kategorileri
INSERT INTO categories (name, slug, parent_id, sort_order, description)
SELECT 'Dağ Bisikleti', 'dag-bisikleti', id, 1, 'Zorlu arazi koşulları için'
FROM categories WHERE slug = 'bisikletler' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order, description)
SELECT 'Şehir Bisikleti', 'sehir-bisikleti', id, 2, 'Günlük şehir kullanımı için'
FROM categories WHERE slug = 'bisikletler' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order, description)
SELECT 'Yol Yarış Bisikleti', 'yol-yaris-bisikleti', id, 3, 'Hız ve performans odaklı'
FROM categories WHERE slug = 'bisikletler' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order, description)
SELECT 'Çocuk Bisikleti', 'cocuk-bisikleti', id, 4, 'Çocuklar için güvenli bisikletler'
FROM categories WHERE slug = 'bisikletler' ON CONFLICT (slug) DO NOTHING;

-- ELEKTRİKLİ BİSİKLETLER alt kategorileri
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Elektrikli Bisiklet', 'elektrikli-bisiklet', id, 1
FROM categories WHERE slug = 'elektrikli-bisikletler' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Elektrikli Bisiklet Yedek Parça & Aksesuar', 'elektrikli-yedek-parca', id, 2
FROM categories WHERE slug = 'elektrikli-bisikletler' ON CONFLICT (slug) DO NOTHING;

-- AKSESUARLAR alt kategorileri (orta seviye)
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Sürüş Aksesuarları & Ekipman', 'surus-aksesuarlari', id, 1
FROM categories WHERE slug = 'aksesuarlar' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Yedek Parça (Komponentler)', 'yedek-parca', id, 2
FROM categories WHERE slug = 'aksesuarlar' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Motosiklet Ürünleri', 'motosiklet-urunleri', id, 3
FROM categories WHERE slug = 'aksesuarlar' ON CONFLICT (slug) DO NOTHING;

-- Sürüş Aksesuarları alt kategorileri
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Eldiven', 'eldiven', id, 1
FROM categories WHERE slug = 'surus-aksesuarlari' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Bisiklet Kaskı', 'bisiklet-kaski', id, 2
FROM categories WHERE slug = 'surus-aksesuarlari' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Bisiklet Kilitleri', 'bisiklet-kilitleri', id, 3
FROM categories WHERE slug = 'surus-aksesuarlari' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Bisiklet Aydınlatma İkaz', 'aydinlatma-ikaz', id, 4
FROM categories WHERE slug = 'surus-aksesuarlari' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Bisiklet Pompası', 'bisiklet-pompasi', id, 5
FROM categories WHERE slug = 'surus-aksesuarlari' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Bisiklet Taşıyıcı', 'bisiklet-tasiyici', id, 6
FROM categories WHERE slug = 'surus-aksesuarlari' ON CONFLICT (slug) DO NOTHING;

-- Yedek Parça alt kategorileri
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Dış Lastik', 'dis-lastik', id, 1
FROM categories WHERE slug = 'yedek-parca' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'İç Lastik', 'ic-lastik', id, 2
FROM categories WHERE slug = 'yedek-parca' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Fren Takımı', 'fren-takimi', id, 3
FROM categories WHERE slug = 'yedek-parca' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Fren Balatası', 'fren-balatasi', id, 4
FROM categories WHERE slug = 'yedek-parca' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Gidon', 'gidon', id, 5
FROM categories WHERE slug = 'yedek-parca' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Ruble', 'ruble', id, 6
FROM categories WHERE slug = 'yedek-parca' ON CONFLICT (slug) DO NOTHING;

-- Motosiklet alt kategorileri
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Motosiklet Lastikleri', 'motosiklet-lastikleri', id, 1
FROM categories WHERE slug = 'motosiklet-urunleri' ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Motosiklet Karter Korumaları', 'motosiklet-karter', id, 2
FROM categories WHERE slug = 'motosiklet-urunleri' ON CONFLICT (slug) DO NOTHING;
