import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminGuard from '@/components/admin/AdminGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-surface">
        <AdminSidebar />
        <main className="flex-1 lg:ml-60 min-w-0">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}
