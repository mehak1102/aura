import { Outlet } from 'react-router-dom'
import { Sidebar } from '@components/layout/Sidebar'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  )
}
