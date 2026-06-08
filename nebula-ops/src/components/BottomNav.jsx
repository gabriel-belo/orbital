import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const navItems = [
  { path: '/dashboard', icon: 'grid_view', label: 'Inicio' },
  { path: '/regions', icon: 'location_on', label: 'Regioes' },
  { path: '/radar', icon: 'radar', label: 'Mapa' },
  { path: '/alerts', icon: 'notifications_active', label: 'Alertas' },
  { path: '/profile', icon: 'manage_accounts', label: 'Perfil' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#060f16]/95 backdrop-blur-md border-t border-[#3a494b]/40 flex">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-2.5 transition-all duration-200 ${
              isActive ? 'text-[#00dbe7]' : 'text-[#849495] hover:text-[#b9cacb]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative flex items-center justify-center w-8 h-5">
                {isActive && <div className="absolute inset-0 bg-[#00dbe7]/10 rounded-full blur-sm" />}
                <Icon name={item.icon} size={20} fill={isActive} />
              </div>
              <span className="font-heading font-semibold tracking-[0.08em] text-[9px] uppercase">
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
