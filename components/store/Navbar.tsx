'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import CartDrawer from './CartDrawer'

// ── Mega Menü Yapısı ─────────────────────────────────────────────────────────
const MENU_STRUCTURE = [
  {
    id: 'bisikletler',
    label: 'BİSİKLETLER',
    href: '/kategori/bisikletler',
    children: [
      { label: 'Dağ Bisikleti', href: '/kategori/dag-bisikleti' },
      { label: 'Şehir Bisikleti', href: '/kategori/sehir-bisikleti' },
      { label: 'Yol Yarış Bisikleti', href: '/kategori/yol-yaris-bisikleti' },
      { label: 'Çocuk Bisikleti', href: '/kategori/cocuk-bisikleti' },
    ],
  },
  {
    id: 'elektrikli',
    label: 'ELEKTRİKLİ BİSİKLETLER',
    href: '/kategori/elektrikli-bisikletler',
    children: [
      { label: 'Elektrikli Bisiklet', href: '/kategori/elektrikli-bisiklet' },
      { label: 'Elektrikli Bisiklet Yedek Parça & Aksesuar', href: '/kategori/elektrikli-yedek-parca' },
    ],
  },
  {
    id: 'aksesuarlar',
    label: 'AKSESUARLAR & YEDEK PARÇA',
    href: '/kategori/aksesuarlar',
    children: [
      {
        label: 'Sürüş Aksesuarları & Ekipman',
        href: '/kategori/surus-aksesuarlari',
        subItems: [
          { label: 'Eldiven', href: '/kategori/eldiven' },
          { label: 'Bisiklet Kaskı', href: '/kategori/bisiklet-kaski' },
          { label: 'Bisiklet Kilitleri', href: '/kategori/bisiklet-kilitleri' },
          { label: 'Bisiklet Aydınlatma İkaz', href: '/kategori/aydinlatma-ikaz' },
          { label: 'Bisiklet Pompası', href: '/kategori/bisiklet-pompasi' },
          { label: 'Bisiklet Taşıyıcı', href: '/kategori/bisiklet-tasiyici' },
        ],
      },
      {
        label: 'Yedek Parça (Komponentler)',
        href: '/kategori/yedek-parca',
        subItems: [
          { label: 'Dış Lastik', href: '/kategori/dis-lastik' },
          { label: 'İç Lastik', href: '/kategori/ic-lastik' },
          { label: 'Fren Takımı', href: '/kategori/fren-takimi' },
          { label: 'Fren Balatası', href: '/kategori/fren-balatasi' },
          { label: 'Gidon', href: '/kategori/gidon' },
          { label: 'Ruble', href: '/kategori/ruble' },
        ],
      },
      {
        label: 'Motosiklet Ürünleri',
        href: '/kategori/motosiklet-urunleri',
        subItems: [
          { label: 'Motosiklet Lastikleri', href: '/kategori/motosiklet-lastikleri' },
          { label: 'Motosiklet Karter Korumaları', href: '/kategori/motosiklet-karter' },
        ],
      },
    ],
  },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()
  const { getTotalItems, toggleCart } = useCartStore()
  const totalItems = getTotalItems()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)

    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setAccountMenuOpen(false)
    setMobileOpen(false)
    router.push('/')
  }

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Kullanıcı'

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenMenu(id)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenMenu(null), 120)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-soft' : ''
        } bg-white border-b border-surface-container`}
      >
        <div className="page-container">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="font-headline font-bold text-xl tracking-tighter text-on-surface hover:text-primary transition-colors"
            >
              ALTUNEL BİSİKLET
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center h-full" aria-label="Ana navigasyon">
              {MENU_STRUCTURE.map((menu) => (
                <div
                  key={menu.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(menu.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={menu.href}
                    className={`flex items-center gap-1 px-4 h-full text-label-md font-semibold transition-colors ${
                      openMenu === menu.id ? 'text-primary' : 'text-secondary hover:text-primary'
                    }`}
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {menu.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openMenu === menu.id ? 'rotate-180' : ''
                      }`}
                    />
                  </Link>

                  {/* Dropdown */}
                  {openMenu === menu.id && (
                    <div
                      className="absolute top-full left-0 bg-white border border-surface-container shadow-medium animate-fade-in z-50"
                      style={{ minWidth: menu.id === 'aksesuarlar' ? '680px' : '220px' }}
                      onMouseEnter={() => handleMouseEnter(menu.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {menu.id === 'aksesuarlar' ? (
                        // Mega Menü (3 sütun)
                        <div className="grid grid-cols-3 gap-0 p-2">
                          {(menu.children as Array<{ label: string; href: string; subItems?: Array<{ label: string; href: string }> }>).map((group) => (
                            <div key={group.label} className="p-4">
                              <Link
                                href={group.href}
                                className="block text-label-md font-bold text-on-surface hover:text-primary mb-3 pb-2 border-b border-surface-container"
                              >
                                {group.label}
                              </Link>
                              {group.subItems && (
                                <ul className="space-y-1">
                                  {group.subItems.map((sub) => (
                                    <li key={sub.label}>
                                      <Link
                                        href={sub.href}
                                        className="block px-2 py-1.5 text-sm text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
                                        onClick={() => setOpenMenu(null)}
                                      >
                                        {sub.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Normal dropdown
                        <div className="py-1">
                          {(menu.children as Array<{ label: string; href: string }>).map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-5 py-3 text-label-md text-secondary hover:text-primary hover:bg-surface-container-low transition-colors border-b border-surface-container last:border-0"
                              onClick={() => setOpenMenu(null)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {user ? (
                <div 
                  className="relative hidden md:block"
                  onMouseEnter={() => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current)
                    setAccountMenuOpen(true)
                  }}
                  onMouseLeave={() => {
                    timeoutRef.current = setTimeout(() => setAccountMenuOpen(false), 120)
                  }}
                >
                  <button className="flex items-center gap-1.5 px-4 py-2 text-label-md text-secondary hover:text-primary transition-colors">
                    <User className="w-4 h-4" />
                    Hesabım
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {accountMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-surface-container shadow-medium animate-fade-in z-50 py-2">
                      <div className="px-4 py-2 border-b border-surface-container mb-1">
                        <p className="text-sm font-semibold text-on-surface truncate">{userDisplayName}</p>
                        <p className="text-xs text-secondary truncate">{user.email}</p>
                      </div>
                      <Link href="/hesabim/siparisler" className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-container-low transition-colors" onClick={() => setAccountMenuOpen(false)}>
                        Siparişlerim
                      </Link>
                      <Link href="/hesabim" className="block px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-surface-container-low transition-colors" onClick={() => setAccountMenuOpen(false)}>
                        Hesap Bilgileri / Adres
                      </Link>
                      <div className="border-t border-surface-container mt-1 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/hesap/giris"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 text-label-md text-secondary hover:text-primary transition-colors"
                  id="nav-login-link"
                >
                  <User className="w-4 h-4" />
                  Giriş Yap
                </Link>
              )}

              <button
                onClick={toggleCart}
                className="relative p-2.5 text-secondary hover:text-primary hover:bg-surface-container-low rounded-full transition-colors"
                aria-label="Sepeti aç"
                id="cart-toggle-btn"
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 text-secondary hover:text-primary hover:bg-surface-container-low rounded-full transition-colors"
                aria-label="Menüyü aç"
                id="mobile-menu-btn"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-surface-container bg-white animate-fade-in overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="page-container py-4">
              {MENU_STRUCTURE.map((menu) => (
                <div key={menu.id} className="border-b border-surface-container last:border-0">
                  <button
                    onClick={() =>
                      setOpenMobileMenu(openMobileMenu === menu.id ? null : menu.id)
                    }
                    className="flex items-center justify-between w-full py-4 text-label-md font-semibold text-on-surface"
                  >
                    {menu.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openMobileMenu === menu.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openMobileMenu === menu.id && (
                    <div className="pb-4 pl-4 space-y-1 animate-fade-in">
                      {menu.id === 'aksesuarlar'
                        ? (menu.children as Array<{ label: string; href: string; subItems?: Array<{ label: string; href: string }> }>).map((group) => (
                            <div key={group.label} className="mb-3">
                              <Link
                                href={group.href}
                                className="block py-2 text-sm font-bold text-on-surface"
                                onClick={() => setMobileOpen(false)}
                              >
                                {group.label}
                              </Link>
                              {group.subItems?.map((sub) => (
                                <Link
                                  key={sub.label}
                                  href={sub.href}
                                  className="block py-1.5 pl-3 text-sm text-secondary hover:text-primary"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          ))
                        : (menu.children as Array<{ label: string; href: string }>).map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block py-2.5 text-sm text-secondary hover:text-primary"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                    </div>
                  )}
                </div>
              ))}

              {user ? (
                <div className="pt-4 border-t border-surface-container">
                  <div className="px-4 py-2 mb-2 bg-surface-container-low">
                    <p className="text-sm font-semibold text-on-surface truncate">{userDisplayName}</p>
                    <p className="text-xs text-secondary truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/hesabim/siparisler"
                    className="block py-2.5 px-4 text-sm text-secondary hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Siparişlerim
                  </Link>
                  <Link
                    href="/hesabim"
                    className="block py-2.5 px-4 text-sm text-secondary hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Hesap Bilgileri / Adres
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2.5 px-4 text-sm text-red-600 hover:bg-red-50 mt-2 border-t border-surface-container flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-surface-container">
                  <Link
                    href="/hesap/giris"
                    className="flex items-center gap-2 py-3 px-4 text-label-md text-secondary hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Giriş Yap / Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  )
}
