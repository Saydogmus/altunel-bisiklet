'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Upload,
  Settings,
  ArrowLeft,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Ürünler', href: '/admin/urunler', icon: Package },
  { label: 'Siparişler', href: '/admin/siparisler', icon: ShoppingBag },
  { label: 'Stok', href: '/admin/stok', icon: BarChart3 },
  { label: 'Toplu Yükleme', href: '/admin/urunler/yukle', icon: Upload },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white border border-surface-container shadow-soft"
        aria-label="Menü aç"
      >
        <LayoutDashboard className="w-5 h-5 text-secondary" />
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-surface-container flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-surface-container">
          <div>
            <p className="font-headline font-bold text-sm tracking-tight text-on-surface">
              ALTUNEL BİSİKLET
            </p>
            <p className="text-xs text-secondary mt-0.5">Yönetim Paneli</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 hover:bg-surface-container transition-colors"
            aria-label="Menü kapat"
          >
            <X className="w-4 h-4 text-secondary" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3" aria-label="Admin navigasyon">
          <ul className="space-y-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    id={`admin-nav-${label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-surface-container space-y-1">
          <Link
            href="/"
            className="admin-nav-item text-secondary"
            id="admin-back-to-store"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            Mağazaya Dön
          </Link>
        </div>
      </aside>
    </>
  )
}
