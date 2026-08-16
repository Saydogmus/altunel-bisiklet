import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function calculateDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export const CATEGORY_ICONS: Record<string, string> = {
  bisiklet: '🚲',
  'e-bisiklet': '⚡',
  scooter: '🛴',
  'yedek-parca': '🔧',
}

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Ödendi', color: 'bg-green-100 text-green-800' },
  processing: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Kargoya Verildi', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800' },
}
