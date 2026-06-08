import { useMemo, useState } from 'react'
import AppLayout from '../components/AppLayout'
import { useAppData } from '../context/AppDataContext'
import { badgeStyle, formatDateTime, getPriorityMeta } from '../lib/orbital'

const sourceLabels = {
  real: 'Evento de clima real',
  official: 'Evento de risco oficial',
  simulated: 'Evento de simulacao',
  demo: 'Ocorrencia demonstrativa',
}

export default function SystemLogs() {
  const { history, regionMap } = useAppData()
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('todos')
  const [sourceFilter, setSourceFilter] = useState('todos')
  const [regionFilter, setRegionFilter] = useState('todos')

  const filteredHistory = useMemo(() => {
    return [...history]
      .filter(item => {
        const region = regionMap[item.regionId]
        const term = search.toLowerCase()
        const matchesSearch =
          (item.alertType ?? item.summary).toLowerCase().includes(term) ||
          region?.name?.toLowerCase().includes(term)
        const matchesPriority = priorityFilter === 'todos' || item.priority === priorityFilter
        const matchesSource = sourceFilter === 'todos' || item.source === sourceFilter
        const matchesRegion = regionFilter === 'todos' || item.regionId === regionFilter
        return matchesSearch && matchesPriority && matchesSource && matchesRegion
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [history, priorityFilter, regionFilter, regionMap, search, sourceFilter])

  return (
    <AppLayout title="HISTORICO">
      <div className="p-4 md:p-6 max-w-5xl">
        <div className="mb-4">
          <h1 className="font-heading font-semibold text-xl text-white">Historico operacional</h1>
          <p className="text-[#AAB2C8] text-sm">Sincronizacoes reais, risco oficial, alertas automaticos e simulacoes por regiao.</p>
        </div>

        <div className="glass-card p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por regiao ou ocorrencia" className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none" />
          <select value={regionFilter} onChange={event => setRegionFilter(event.target.value)} className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
            <option value="todos">Todas as regioes</option>
            {Object.values(regionMap).map(region => <option key={region.id} value={region.id}>{region.name}</option>)}
          </select>
          <select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)} className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
            <option value="todos">Todas as prioridades</option>
            <option value="critico">Critica</option>
            <option value="alto">Alta</option>
            <option value="medio">Media</option>
            <option value="baixo">Baixa</option>
          </select>
          <select value={sourceFilter} onChange={event => setSourceFilter(event.target.value)} className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
            <option value="todos">Todas as origens</option>
            <option value="real">Clima real</option>
            <option value="official">Risco oficial</option>
            <option value="simulated">Simulacao</option>
            <option value="demo">Demonstrativo</option>
          </select>
        </div>

        {!filteredHistory.length ? (
          <div className="glass-card p-8 text-center">
            <p className="font-heading font-semibold text-white text-lg">Nenhum item de historico encontrado</p>
            <p className="text-[#AAB2C8] text-sm mt-2">Os filtros atuais nao retornaram eventos para as regioes cadastradas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map(item => {
              const priorityMeta = getPriorityMeta(item.priority)
              return (
                <div key={item.id} className="glass-card p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(priorityMeta.color)}>
                          {priorityMeta.label}
                        </span>
                        <span className="text-[#AAB2C8] text-xs">{regionMap[item.regionId]?.name ?? 'Regiao historica nao cadastrada'}</span>
                        <span className="label-caps text-[9px] px-2 py-1 rounded-full border border-[#3a494b]/40 text-[#AAB2C8]">
                          {sourceLabels[item.source] ?? 'Evento operacional'}
                        </span>
                      </div>
                      <p className="font-heading font-semibold text-white text-lg">{item.alertType ?? item.summary}</p>
                      <p className="text-[#AAB2C8] text-sm mt-1">{item.summary}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-sm text-[#AAB2C8]">
                        <p>Tipo: {item.eventType}</p>
                        <p>Status final: {item.finalStatus ?? 'Atualizacao automatica'}</p>
                        <p>Equipe: {item.team ?? 'Motor operacional'}</p>
                      </div>
                      <p className="text-[#AAB2C8] text-sm mt-3">{item.details}</p>
                    </div>
                    <p className="text-[#AAB2C8] text-xs">{formatDateTime(item.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
