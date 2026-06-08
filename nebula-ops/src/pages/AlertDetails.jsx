import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import { badgeStyle, formatDateTime, getAlertStatusMeta, getPriorityMeta, getSourceLabel } from '../lib/orbital'

export default function AlertDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { alerts, regionMap, updateAlertStatus } = useAppData()
  const [message, setMessage] = useState('')
  const alert = alerts.find(item => item.id === id)

  if (!alert) {
    return (
      <AppLayout title="ALERTA" showBack>
        <div className="p-4 md:p-6 max-w-5xl">
          <div className="glass-card p-8 text-center">
            <p className="font-heading font-semibold text-white text-lg">Alerta nao encontrado</p>
            <p className="text-[#AAB2C8] text-sm mt-2">Esse alerta nao esta disponivel para as regioes cadastradas.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const region = regionMap[alert.regionId]
  const priorityMeta = getPriorityMeta(alert.priority)
  const statusMeta = getAlertStatusMeta(alert.status)
  const canOpenEmergency = alert.priority === 'critico' && alert.status !== 'resolvido'

  const handleUpdate = status => {
    updateAlertStatus(alert.id, status)
    setMessage('Status atualizado com sucesso')
    setTimeout(() => setMessage(''), 1800)
  }

  return (
    <AppLayout title={alert.title} showBack>
      <div className="p-4 md:p-6 max-w-5xl">
        <div className="glass-card p-5 mb-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(priorityMeta.color)}>
                  {priorityMeta.label}
                </span>
                <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(statusMeta.color)}>
                  {statusMeta.label}
                </span>
                <span className="text-[#AAB2C8] text-xs">{formatDateTime(alert.timestamp)}</span>
              </div>
              <h1 className="font-heading font-bold text-2xl text-white">{alert.title}</h1>
              <p className="text-[#AAB2C8] text-sm mt-2">{alert.fullDescription}</p>
            </div>
            {message ? (
              <span className="text-xs text-[#2ECC71] bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-lg px-3 py-2 h-fit">
                {message}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="glass-card p-4">
            <p className="label-caps text-[#AAB2C8] mb-3">Contexto operacional</p>
            <div className="space-y-3 text-sm">
              <p className="text-[#AAB2C8]"><span className="text-white">Regiao:</span> {region?.name ?? 'Nao vinculada'}</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Origem:</span> {getSourceLabel(alert.origin)}</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Camada:</span> {alert.sourceType ?? 'operacional'}</p>
              {alert.triggerType ? <p className="text-[#AAB2C8]"><span className="text-white">Regra:</span> {alert.triggerType}</p> : null}
              <p className="text-[#AAB2C8]"><span className="text-white">Temperatura:</span> {region?.temperature ?? '--'} C</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Umidade:</span> {region?.humidity ?? '--'}%</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Vento:</span> {region?.wind ?? '--'} km/h</p>
              {alert.confidence ? <p className="text-[#AAB2C8]"><span className="text-white">Confianca:</span> {alert.confidence}%</p> : null}
              {alert.sourceEvidence ? <p className="text-[#AAB2C8]"><span className="text-white">Evidencia:</span> {alert.sourceEvidence}</p> : null}
              {alert.sourceSummary ? <p className="text-[#AAB2C8]"><span className="text-white">Resumo:</span> {alert.sourceSummary}</p> : null}
            </div>
            {alert.triggerValues ? (
              <div className="mt-4 rounded-lg bg-[#0B1020]/60 border border-[#3a494b]/30 p-3">
                <p className="label-caps text-[#AAB2C8] mb-2">Variaveis que dispararam o alerta</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {Object.entries(alert.triggerValues).map(([key, value]) => (
                    <p key={key} className="text-[#AAB2C8]">
                      <span className="text-white">{key}:</span> {value}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="glass-card p-4">
            <p className="label-caps text-[#AAB2C8] mb-3">Recomendacao de acao</p>
            <p className="text-white text-sm leading-relaxed mb-4">{alert.recommendation}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button onClick={() => handleUpdate('em_analise')} className="btn-ghost text-[10px] py-3">Marcar em analise</button>
              <button onClick={() => handleUpdate('em_atendimento')} className="btn-ghost text-[10px] py-3">Marcar em atendimento</button>
              <button onClick={() => handleUpdate('resolvido')} className="btn-primary text-[10px] py-3">Marcar resolvido</button>
            </div>
            {canOpenEmergency ? (
              <button onClick={() => navigate(`/emergency?alert=${alert.id}`)} className="btn-primary w-full mt-3 flex items-center justify-center gap-2">
                <Icon name="warning" size={14} />
                Abrir acao emergencial
              </button>
            ) : null}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="history" size={16} className="text-[#4F8CFF]" />
            <p className="label-caps text-[#AAB2C8]">Historico de atualizacao</p>
          </div>
          <div className="space-y-3">
            {(alert.updateHistory ?? []).map((item, index) => (
              <div key={`${item.time}-${index}`} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[#4F8CFF] mt-1.5" />
                <div>
                  <p className="text-white text-sm">{item.text}</p>
                  <p className="text-[#AAB2C8] text-xs mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/alerts')} className="mt-4 text-[#4F8CFF] text-sm flex items-center gap-2">
            <Icon name="arrow_back" size={14} />
            Voltar para lista de alertas
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
