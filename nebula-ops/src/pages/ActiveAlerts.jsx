import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import { badgeStyle, formatDateTime, getAlertStatusMeta, getPriorityMeta, getSourceLabel } from '../lib/orbital'
import { priorityOrder } from '../data/orbitalData'

export default function ActiveAlerts() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { alerts, availableRegionOptions, regionMap } = useAppData()
  const [search, setSearch] = useState('')

  const priorityFilter = searchParams.get('priority') ?? 'todos'
  const statusFilter = searchParams.get('status') ?? 'todos'
  const regionFilter = searchParams.get('region') ?? 'todos'

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter(alert => {
        const region = regionMap[alert.regionId]
        const term = search.toLowerCase()
        const matchesSearch =
          alert.title.toLowerCase().includes(term) ||
          region?.name?.toLowerCase().includes(term)
        const matchesPriority = priorityFilter === 'todos' || alert.priority === priorityFilter
        const matchesStatus = statusFilter === 'todos' || alert.status === statusFilter
        const matchesRegion = regionFilter === 'todos' || alert.regionId === regionFilter
        return matchesSearch && matchesPriority && matchesStatus && matchesRegion
      })
      .sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority))
  }, [alerts, priorityFilter, regionFilter, regionMap, search, statusFilter])

  const counts = {
    critico: alerts.filter(alert => alert.priority === 'critico' && alert.status !== 'resolvido').length,
    alto: alerts.filter(alert => alert.priority === 'alto' && alert.status !== 'resolvido').length,
    medio: alerts.filter(alert => alert.priority === 'medio' && alert.status !== 'resolvido').length,
    resolvido: alerts.filter(alert => alert.status === 'resolvido').length,
  }

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'todos') next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  return (
    <AppLayout title="ALERTAS">
      <div className="p-4 md:p-6 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <div>
            <h1 className="font-heading font-semibold text-xl text-white">Alertas operacionais</h1>
            <p className="text-[#AAB2C8] text-sm">Lista hibrida de alertas meteorologicos, oficiais e simulados.</p>
          </div>
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB2C8]" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Buscar por titulo ou regiao"
              className="w-full md:w-72 bg-[#151B2E] border border-[#3a494b] rounded-lg py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-[#4F8CFF]/60"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Criticos', value: counts.critico, color: '#E74C3C' },
            { label: 'Altos', value: counts.alto, color: '#E67E22' },
            { label: 'Medios', value: counts.medio, color: '#F1C40F' },
            { label: 'Resolvidos', value: counts.resolvido, color: '#2ECC71' },
          ].map(item => (
            <div key={item.label} className="glass-card p-4">
              <p className="font-heading font-bold text-3xl" style={{ color: item.color }}>{item.value}</p>
              <p className="text-[#AAB2C8] text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <select value={priorityFilter} onChange={event => updateFilter('priority', event.target.value)} className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
            <option value="todos">Todas as prioridades</option>
            <option value="critico">Critica</option>
            <option value="alto">Alta</option>
            <option value="medio">Media</option>
            <option value="baixo">Baixa</option>
          </select>
          <select value={statusFilter} onChange={event => updateFilter('status', event.target.value)} className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
            <option value="todos">Todos os status</option>
            <option value="novo">Novo</option>
            <option value="em_analise">Em analise</option>
            <option value="em_atendimento">Em atendimento</option>
            <option value="monitorando">Monitorando</option>
            <option value="resolvido">Resolvido</option>
          </select>
          <select value={regionFilter} onChange={event => updateFilter('region', event.target.value)} className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
            <option value="todos">Todas as regioes</option>
            {availableRegionOptions.map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </div>

        {!filteredAlerts.length ? (
          <div className="glass-card p-8 text-center">
            <Icon name="notifications_off" size={36} className="text-[#4F8CFF] mx-auto mb-3" />
            <p className="font-heading font-semibold text-white text-lg">Nenhum alerta para as regioes cadastradas</p>
            <p className="text-[#AAB2C8] text-sm mt-2">Os alertas automaticos passam a aparecer conforme o clima real, a camada oficial e os cenarios de demonstracao.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map(alert => {
              const priorityMeta = getPriorityMeta(alert.priority)
              const statusMeta = getAlertStatusMeta(alert.status)
              const region = regionMap[alert.regionId]
              const canOpenEmergency = alert.priority === 'critico' && alert.status !== 'resolvido'

              return (
                <div key={alert.id} className="glass-card p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <button onClick={() => navigate(`/alerts/${alert.id}`)} className="flex-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(priorityMeta.color)}>
                          {priorityMeta.label}
                        </span>
                        <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(statusMeta.color)}>
                          {statusMeta.label}
                        </span>
                        <span className="text-[#AAB2C8] text-xs">{region?.name}</span>
                      </div>
                      <p className="font-heading font-semibold text-lg text-white">{alert.title}</p>
                      <p className="text-[#AAB2C8] text-sm mt-1">{alert.shortDescription}</p>
                      <p className="text-[#4F8CFF] text-xs mt-2">
                        Origem: {getSourceLabel(alert.origin)} | Tipo: {alert.sourceType ?? 'operacional'}
                      </p>
                      {alert.triggerType ? (
                        <p className="text-[#AAB2C8] text-xs mt-1">
                          Gatilho: {alert.triggerType} | Variaveis-chave: {Object.keys(alert.triggerValues ?? {}).join(', ')}
                        </p>
                      ) : null}
                      {alert.sourceEvidence ? (
                        <p className="text-[#AAB2C8] text-xs mt-1">Evidencia: {alert.sourceEvidence}</p>
                      ) : null}
                      {alert.sourceSummary ? (
                        <p className="text-[#AAB2C8] text-xs mt-1">{alert.sourceSummary}</p>
                      ) : null}
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#AAB2C8]">
                        <span>{formatDateTime(alert.timestamp)}</span>
                        {alert.confidence ? <span>Confianca: {alert.confidence}%</span> : null}
                        {alert.official ? <span>Camada oficial priorizada</span> : null}
                      </div>
                    </button>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => navigate(`/alerts/${alert.id}`)} className="btn-ghost text-[10px] py-2">
                        Abrir detalhe
                      </button>
                      {canOpenEmergency ? (
                        <button onClick={() => navigate(`/emergency?alert=${alert.id}`)} className="btn-primary text-[10px] py-2">
                          Abrir acao emergencial
                        </button>
                      ) : null}
                    </div>
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
