import { useMemo, useState } from 'react'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import { badgeStyle, getPriorityMeta, getRecommendationTypeMeta, getSourceLabel } from '../lib/orbital'

export default function Reports() {
  const { recommendations, regionMap, toggleRecommendation } = useAppData()
  const [priorityFilter, setPriorityFilter] = useState('todos')

  const pending = useMemo(
    () => recommendations.filter(item => !item.completed && (priorityFilter === 'todos' || item.priority === priorityFilter)),
    [priorityFilter, recommendations],
  )
  const completed = useMemo(
    () => recommendations.filter(item => item.completed && (priorityFilter === 'todos' || item.priority === priorityFilter)),
    [priorityFilter, recommendations],
  )

  const renderCard = item => {
    const priorityMeta = getPriorityMeta(item.priority)
    const typeMeta = getRecommendationTypeMeta(item.type)
    return (
      <div key={item.id} className="glass-card p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="font-heading font-semibold text-white text-lg">{item.title}</p>
            <p className="text-[#AAB2C8] text-sm mt-1">{item.description}</p>
            {item.reason ? <p className="text-[#4F8CFF] text-xs mt-2">Motivo: {item.reason}</p> : null}
          </div>
          <button onClick={() => toggleRecommendation(item.id)} className="btn-ghost text-[10px] py-2">
            {item.completed ? 'Reabrir' : 'Concluir'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(priorityMeta.color)}>
            {priorityMeta.label}
          </span>
          <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(typeMeta.color)}>
            {typeMeta.label}
          </span>
          {item.automatic ? (
            <span className="label-caps text-[9px] px-2 py-1 rounded-full border border-[#4F8CFF]/40 text-[#4F8CFF]">
              Regra automatica
            </span>
          ) : null}
          {item.origin ? (
            <span className="label-caps text-[9px] px-2 py-1 rounded-full border border-[#3a494b]/40 text-[#AAB2C8]">
              Origem: {getSourceLabel(item.origin)}
            </span>
          ) : null}
          {item.regionId ? (
            <span className="label-caps text-[9px] px-2 py-1 rounded-full border border-[#3a494b]/40 text-[#AAB2C8]">
              {regionMap[item.regionId]?.name ?? 'Regiao demonstrativa'}
            </span>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <AppLayout title="RECOMENDACOES">
      <div className="p-4 md:p-6 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h1 className="font-heading font-semibold text-xl text-white">Recomendacoes operacionais</h1>
            <p className="text-[#AAB2C8] text-sm">Acoes dinamicas, oficiais e simuladas para apoiar a priorizacao operacional.</p>
          </div>
          <select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)} className="bg-[#151B2E] border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
            <option value="todos">Todas as prioridades</option>
            <option value="critico">Critica</option>
            <option value="alto">Alta</option>
            <option value="medio">Media</option>
            <option value="baixo">Baixa</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="pending_actions" size={16} className="text-[#4F8CFF]" />
              <p className="label-caps text-[#AAB2C8]">Pendentes</p>
            </div>
            <div className="space-y-3">
              {pending.map(renderCard)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Icon name="task_alt" size={16} className="text-[#2ECC71]" />
              <p className="label-caps text-[#AAB2C8]">Concluidas</p>
            </div>
            <div className="space-y-3">
              {completed.map(renderCard)}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
