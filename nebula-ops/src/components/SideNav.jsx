import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const navItems = [
  { path: '/dashboard', icon: 'grid_view', label: 'Dashboard' },
  { path: '/regions', icon: 'location_on', label: 'Regioes' },
  { path: '/alerts', icon: 'notifications_active', label: 'Alertas' },
  { path: '/sensors', icon: 'sensors', label: 'Sensores' },
  { path: '/radar', icon: 'radar', label: 'Mapa Operacional' },
  { path: '/ai-analysis', icon: 'psychology', label: 'Analise IA' },
  { path: '/history', icon: 'history', label: 'Historico' },
  { path: '/recommendations', icon: 'task_alt', label: 'Recomendacoes' },
  { path: '/profile', icon: 'manage_accounts', label: 'Perfil' },
  { path: '/settings', icon: 'settings', label: 'Ajustes' },
]

export default function SideNav({ mobileOpen = false, onClose }) {
  return (
    <aside className={`fixed left-0 top-0 bottom-0 w-60 flex-col bg-[#060f16] border-r border-[#3a494b]/40 z-40 transition-transform duration-300 ${
      mobileOpen ? 'flex translate-x-0' : '-translate-x-full md:translate-x-0 md:flex hidden'
    }`}>
      <div className="h-14 flex items-center px-5 border-b border-[#3a494b]/40">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-[#00dbe7]/20 border border-[#00dbe7]/40 flex items-center justify-center">
            <Icon name="hexagon" size={14} className="text-[#00dbe7]" />
          </div>
          <span className="font-heading font-semibold text-sm tracking-widest text-[#e1fdff]">ORBITAL GUARDIAN</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <p className="label-caps text-[#3a494b] mb-3 px-2">NAVIGATION</p>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 text-sm font-heading font-medium tracking-wide ${
                isActive
                  ? 'bg-[#00dbe7]/10 text-[#00dbe7] border border-[#00dbe7]/20'
                  : 'text-[#849495] hover:text-[#b9cacb] hover:bg-[#182028]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} size={18} fill={isActive} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-[#3a494b]/40">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="status-dot-online" />
            <div className="absolute inset-0 bg-[#00dbe7] rounded-full animate-pulse-ring opacity-60" />
          </div>
          <div>
            <p className="label-caps text-[#849495] text-[10px]">PROTOTIPO ACADEMICO</p>
            <p className="text-[10px] text-[#3a494b] font-heading">MONITORAMENTO ATIVO</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
