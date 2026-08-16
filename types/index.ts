export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  sort_order?: number
  description?: string
  image_url?: string
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  frame_size?: string
  color?: string
  stock: number
  sku: string
  price_offset?: number
}

export interface Product {
  id: string
  category_id: string
  category?: Category
  name: string
  slug: string
  description?: string
  // Supabase şeması base_price kullanıyor; mock data ve eski kodlar price kullanıyor
  price: number        // mock data + sepet uyumu
  base_price?: number  // Supabase'den gelen alan
  original_price?: number
  stock: number
  images: string[]
  brand?: string
  sku?: string
  is_featured: boolean
  is_active: boolean
  frame_sizes?: string[]
  colors?: string[]
  specifications?: Record<string, string>
  variants?: ProductVariant[]
  product_variants?: ProductVariant[]
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  phone?: string
  address_line1?: string
  address_city?: string
  address_zip?: string
  is_admin: boolean
  created_at: string
}

export interface ShippingAddress {
  full_name: string
  phone: string
  address: string
  city: string
  district: string
  postal_code: string
  email: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  variant_id?: string
  variant?: ProductVariant
  quantity: number
  unit_price: number
  created_at: string
}

export interface Order {
  id: string
  user_id?: string
  guest_email?: string
  profile?: Profile
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  stripe_payment_intent_id?: string
  total_amount: number
  shipping_fee: number
  shipping_address?: ShippingAddress
  order_items?: OrderItem[]
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedFrameSize?: string
  selectedColor?: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  profile?: Profile
  rating: number
  comment?: string
  created_at: string
}
