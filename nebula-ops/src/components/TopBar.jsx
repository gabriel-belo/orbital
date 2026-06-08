import { useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'

const titles = {
  '/dashboard': 'ORBITAL GUARDIAN',
  '/alerts': 'ALERTAS',
  '/sensors': 'SENSORES',
  '/regions': 'REGIOES MONITORADAS',
  '/history': 'HISTORICO',
  '/recommendations': 'RECOMENDACOES',
  '/settings': 'CONFIGURACOES',
  '/profile': 'PERFIL',
  '/ai-analysis': 'ANALISE VISUAL',
  '/emergency': 'ACAO EMERGENCIAL',
}

export default function TopBar({ title, showBack = false, onMenuClick }) {
  const navigate = useNavigate()
  const location = useLocation()
  const pageTitle = title || titles[location.pathname] || 'ORBITAL GUARDIAN'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0b141c]/95 backdrop-blur-md border-b border-[#3a494b]/40 flex items-center justify-between px-4 md:pl-64">
      <button
        onClick={() => (showBack ? navigate(-1) : onMenuClick?.())}
        className="p-1.5 rounded-lg hover:bg-[#182028] transition-colors"
      >
        <Icon name={showBack ? 'arrow_back' : 'menu'} size={20} className="text-[#b9cacb]" />
      </button>

      <div className="flex items-center gap-2">
        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#00dbe7] animate-pulse" />
        <span className="font-heading font-semibold text-xs tracking-[0.15em] text-[#e1fdff]">
          {pageTitle}
        </span>
      </div>

      <button className="p-1.5 rounded-lg hover:bg-[#182028] transition-colors">
        <Icon name="satellite_alt" size={20} className="text-[#b9cacb]" />
      </button>
    </header>
  )
}
