import { useState } from 'react'
import TopBar from './TopBar'
import SideNav from './SideNav'
import BottomNav from './BottomNav'

export default function AppLayout({ children, title, showBack = false }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0b141c] text-[#dae3ee] font-sans">
      <SideNav mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <TopBar title={title} showBack={showBack} onMenuClick={() => setMobileOpen(o => !o)} />
      <main className="pt-14 pb-16 md:pb-0 md:ml-60 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
