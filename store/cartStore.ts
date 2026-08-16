import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, selectedFrameSize?: string, selectedColor?: string) => void
  removeItem: (productId: string, frameSize?: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number, frameSize?: string, color?: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

function itemKey(productId: string, frameSize?: string, color?: string): string {
  return `${productId}__${frameSize ?? ''}_${color ?? ''}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, selectedFrameSize?: string, selectedColor?: string) => {
        const { items } = get()
        const key = itemKey(product.id, selectedFrameSize, selectedColor)
        const existingItem = items.find(
          (item) =>
            itemKey(item.product.id, item.selectedFrameSize, item.selectedColor) === key
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              itemKey(item.product.id, item.selectedFrameSize, item.selectedColor) === key
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true,
          })
        } else {
          set({
            items: [...items, { product, quantity: 1, selectedFrameSize, selectedColor }],
            isOpen: true,
          })
        }
      },

      removeItem: (productId: string, frameSize?: string, color?: string) => {
        const key = itemKey(productId, frameSize, color)
        set({
          items: get().items.filter(
            (item) =>
              itemKey(item.product.id, item.selectedFrameSize, item.selectedColor) !== key
          ),
        })
      },

      updateQuantity: (productId: string, quantity: number, frameSize?: string, color?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, frameSize, color)
          return
        }
        const key = itemKey(productId, frameSize, color)
        set({
          items: get().items.map((item) =>
            itemKey(item.product.id, item.selectedFrameSize, item.selectedColor) === key
              ? { ...item, quantity }
              : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    }),
    {
      name: 'altunel-cart',
    }
  )
)
