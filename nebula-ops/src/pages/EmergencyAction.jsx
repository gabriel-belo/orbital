import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import { formatElapsedFromNow, getSourceLabel } from '../lib/orbital'

export default function EmergencyAction() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { alerts, regionMap, updateAlertStatus } = useAppData()
  const [seconds, setSeconds] = useState(0)
  const [isolated, setIsolated] = useState(false)
  const [glitch, setGlitch] = useState(false)

  const alertId = searchParams.get('alert')
  const alert = alerts.find(item => item.id === alertId) ?? alerts.find(item => item.priority === 'critico' && item.status !== 'resolvido') ?? null
  const region = alert ? regionMap[alert.regionId] : null

  useEffect(() => {
    const timer = setInterval(() => setSeconds(current => current + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 150)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const fmt = value => {
    const minutes = Math.floor(value / 60)
    const secs = value % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleIsolate = () => {
    if (alert) {
      updateAlertStatus(alert.id, 'em_atendimento')
    }
    setIsolated(true)
    setTimeout(() => navigate(alert ? `/alerts/${alert.id}` : '/alerts'), 2500)
  }

  if (!alert || !region) {
    return (
      <div className="min-h-screen bg-[#0b141c] flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-xl">
          <Icon name="warning" size={36} className="text-[#ffb4ab] mx-auto mb-3" />
          <p className="font-heading font-semibold text-white text-lg">Nenhum alerta critico disponivel</p>
          <p className="text-[#AAB2C8] text-sm mt-2">Abra a acao emergencial a partir de um alerta critico real ou simulado.</p>
          <button onClick={() => navigate('/alerts')} className="btn-primary mt-4">Voltar para alertas</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b141c] flex flex-col relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#ffb4ab 1px, transparent 1px), linear-gradient(90deg, #ffb4ab 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[60%] bg-[radial-gradient(ellipse_at_50%_0%,#93000a30,transparent_70%)] pointer-events-none" />
      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffb4ab30] to-transparent animate-scan-line pointer-events-none" />

      <header className="relative z-10 h-14 border-b border-[#ffb4ab]/20 flex items-center justify-between px-4">
        <button onClick={() => navigate(alert ? `/alerts/${alert.id}` : '/alerts')} className="flex items-center gap-1.5 text-[#849495] text-xs font-heading hover:text-[#b9cacb] transition-colors">
          <Icon name="arrow_back" size={16} />
          VOLTAR
        </button>
        <span className="font-heading font-semibold text-xs tracking-[0.15em] text-[#ffb4ab]">
          ACAO EMERGENCIAL
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-blink" />
          <span className="label-caps text-[9px] text-[#ffb4ab]">MODO EMERGENCIA</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {isolated ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#00dbe7]/10 border border-[#00dbe7]/30 flex items-center justify-center mx-auto mb-4">
              <Icon name="check_circle" size={40} className="text-[#00dbe7]" />
            </div>
            <p className="font-heading font-semibold text-xl text-[#e1fdff] mb-2">PROTOCOLO ACIONADO</p>
            <p className="text-[#849495] text-sm">A resposta operacional foi registrada. Redirecionando...</p>
          </div>
        ) : (
          <>
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-[#ffb4ab]/10 blur-2xl animate-pulse" />
              <div className="absolute -inset-4 rounded-full border border-[#ffb4ab]/10 animate-pulse-ring" />
              <div className="relative w-24 h-24 rounded-full bg-[#93000a]/20 border border-[#ffb4ab]/40 flex items-center justify-center shadow-[0_0_40px_#ffb4ab20]">
                <Icon name="warning" size={44} className="text-[#ffb4ab]" />
              </div>
            </div>

            <h1 className={`font-heading font-bold text-3xl text-[#ffb4ab] tracking-tight mb-1 ${glitch ? 'animate-glitch' : ''}`}>
              AMEACA DETECTADA
            </h1>
            <p className="text-[#849495] text-sm font-heading mb-8">Resposta emergencial contextual</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-3xl mb-8">
              <div className="glass-card p-3 text-center border-[#ffb4ab]/20">
                <p className="label-caps text-[9px] text-[#849495] mb-1">REGIAO</p>
                <p className="font-heading font-semibold text-sm text-[#e1fdff]">{region.name}</p>
                <p className="text-[10px] text-[#849495]">{region.isSimulated ? 'SIMULACAO ATIVA' : 'DADO OPERACIONAL'}</p>
              </div>
              <div className="glass-card p-3 text-center border-[#ffb4ab]/20">
                <p className="label-caps text-[9px] text-[#849495] mb-1">TEMPO DECORRIDO</p>
                <p className="font-heading font-bold text-lg text-[#ffb4ab] tabular-nums">{fmt(seconds)}</p>
                <p className="text-[10px] text-[#849495]">Deteccao ha {formatElapsedFromNow(alert.timestamp)}</p>
              </div>
              <div className="glass-card p-3 text-center border-[#ffb4ab]/20">
                <p className="label-caps text-[9px] text-[#849495] mb-1">ORIGEM</p>
                <p className="font-heading font-semibold text-xs text-[#e1fdff]">{getSourceLabel(alert.origin)}</p>
                <p className="text-[10px] text-[#849495]">{alert.sourceType ?? 'operacional'}</p>
              </div>
            </div>

            <div className="glass-card p-4 max-w-3xl w-full mb-6 border-[#ffb4ab]/20">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <p className="font-heading font-semibold text-[#e1fdff] text-lg">{alert.title}</p>
                  <p className="text-[#b9cacb] text-sm mt-1">{alert.shortDescription}</p>
                  <p className="text-[#849495] text-xs mt-2">{alert.sourceSummary ?? alert.recommendation}</p>
                </div>
                <div className="text-left md:text-right text-xs text-[#849495]">
                  <p>Risco meteo: {region.climateRisk}</p>
                  <p>Risco oficial: {region.officialRisk?.combinedRisk ?? 'baixo'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              <button
                onClick={handleIsolate}
                className="col-span-2 flex items-center justify-center gap-2 bg-[#93000a]/40 hover:bg-[#93000a]/60 border border-[#ffb4ab]/50 hover:border-[#ffb4ab] text-[#ffb4ab] font-heading font-semibold tracking-widest text-sm py-4 rounded-xl transition-all shadow-[0_0_30px_#ffb4ab15] hover:shadow-[0_0_40px_#ffb4ab25]"
              >
                <Icon name="lock" size={20} />
                ACIONAR RESPOSTA
              </button>
              <button onClick={() => updateAlertStatus(alert.id, 'em_analise')} className="btn-ghost py-3 text-[11px]">
                EM ANALISE
              </button>
              <button onClick={() => updateAlertStatus(alert.id, 'resolvido')} className="btn-ghost py-3 text-[11px]">
                DISPENSAR
              </button>
              <button onClick={() => navigate(`/regions/${region.id}`)} className="col-span-2 text-[#849495] text-xs font-heading hover:text-[#b9cacb] py-2 transition-colors">
                VOLTAR PARA A REGIAO
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
