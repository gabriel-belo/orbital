import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import { useAuth } from '../context/AuthContext'
import {
  badgeStyle,
  formatDateTime,
  formatKilometers,
  getPriorityMeta,
  getRiskMeta,
  getWeatherCodeLabel,
} from '../lib/orbital'

export default function Dashboard() {
  const navigate = useNavigate()
  const { operator } = useAuth()
  const {
    activeAlerts,
    criticalAlert,
    generalRisk,
    lastUpdated,
    latestAlert,
    refreshData,
    regions,
    sensors,
    weatherSyncHistory,
  } = useAppData()
  const [feedback, setFeedback] = useState('')

  const riskMeta = getRiskMeta(generalRisk)
  const onlineSensors = sensors.filter(sensor => sensor.status === 'online').length
  const simulatedRegions = regions.filter(region => region.isSimulated).length
  const officialRiskRegions = regions.filter(region => (region.officialRisk?.combinedRisk ?? 'baixo') !== 'baixo').length
  const climateRiskRegions = regions.filter(region => ['medio', 'alto', 'critico'].includes(region.climateRisk)).length
  const autoAlerts = activeAlerts.filter(alert => alert.automatic)
  const latestWeatherSync = weatherSyncHistory[0] ?? null
  const topRegions = regions.slice(0, 3)

  const conditionCount = regions.reduce((accumulator, region) => {
    const label = getWeatherCodeLabel(region.weatherCode)
    accumulator[label] = (accumulator[label] ?? 0) + 1
    return accumulator
  }, {})

  const predominantCondition =
    Object.entries(conditionCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Sem sincronizacao real'

  const handleRefresh = () => {
    refreshData()
    setFeedback('Painel atualizado com sucesso')
    setTimeout(() => setFeedback(''), 2000)
  }

  return (
    <AppLayout title="ORBITAL GUARDIAN">
      <div className="p-4 md:p-6 space-y-4 max-w-6xl">
        <div className="glass-card p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="label-caps text-[#AAB2C8] text-[10px] mb-1">Situacao operacional</p>
            <h1 className="font-heading font-semibold text-xl text-white">Ola, {operator?.name}</h1>
            <p className="text-[#AAB2C8] text-sm">Ultima atualizacao em {formatDateTime(lastUpdated)}</p>
          </div>
          <div className="flex items-center gap-3">
            {feedback ? (
              <span className="text-xs text-[#2ECC71] bg-[#2ECC71]/10 border border-[#2ECC71]/30 rounded-lg px-3 py-2">
                {feedback}
              </span>
            ) : null}
            <button onClick={handleRefresh} className="btn-primary flex items-center gap-2">
              <Icon name="refresh" size={14} />
              Atualizar dados
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="glass-card p-4 md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <p className="label-caps text-[#AAB2C8]">Risco geral</p>
              <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(riskMeta.color)}>
                {riskMeta.label}
              </span>
            </div>
            <p className="font-heading font-bold text-4xl mb-2" style={{ color: riskMeta.color }}>
              {riskMeta.label}
            </p>
            <p className="text-[#AAB2C8] text-sm leading-relaxed">
              O painel cruza clima local, risco oficial e alertas automaticos para priorizar a operacao.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-xs">
              <div className="rounded-lg border border-[#3a494b]/40 bg-[#0B1020]/60 px-3 py-2">
                <p className="text-[#AAB2C8]">Condicao predominante</p>
                <p className="text-white mt-1">{predominantCondition}</p>
              </div>
              <div className="rounded-lg border border-[#3a494b]/40 bg-[#0B1020]/60 px-3 py-2">
                <p className="text-[#AAB2C8]">Fonte predominante</p>
                <p className="text-white mt-1">{simulatedRegions ? 'Simulacao + clima real' : regions.some(region => region.dataSource === 'api') ? 'Open-Meteo' : 'Dados simulados'}</p>
              </div>
            </div>
          </div>

          {[
            { label: 'Regioes com risco oficial', value: officialRiskRegions, icon: 'verified' },
            { label: 'Risco meteorologico elevado', value: climateRiskRegions, icon: 'thermostat' },
            { label: 'Regioes em simulacao', value: simulatedRegions, icon: 'experiment' },
            { label: 'Sensores online', value: onlineSensors, icon: 'sensors' },
          ].map(card => (
            <div key={card.label} className="glass-card p-4">
              <div className="w-9 h-9 rounded-lg bg-[#4F8CFF]/15 border border-[#4F8CFF]/20 flex items-center justify-center mb-3">
                <Icon name={card.icon} size={18} className="text-[#4F8CFF]" />
              </div>
              <p className="font-heading font-bold text-3xl text-white">{card.value}</p>
              <p className="text-[#AAB2C8] text-sm">{card.label}</p>
            </div>
          ))}
        </div>

        {!regions.length ? (
          <div className="glass-card p-8 text-center">
            <Icon name="map" size={36} className="text-[#4F8CFF] mx-auto mb-3" />
            <p className="font-heading font-semibold text-white text-lg">Nenhuma regiao cadastrada</p>
            <p className="text-[#AAB2C8] text-sm mt-2">
              Va para Regioes, cadastre um CEP e sincronize o clima real para iniciar o monitoramento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="label-caps text-[#AAB2C8]">Ultimo alerta critico</p>
                  {criticalAlert ? (
                    <button onClick={() => navigate(`/alerts/${criticalAlert.id}`)} className="btn-ghost text-[10px] py-2">
                      Ver detalhes
                    </button>
                  ) : null}
                </div>
                {criticalAlert ? (
                  <>
                    <p className="font-heading font-semibold text-white text-lg">{criticalAlert.title}</p>
                    <p className="text-[#AAB2C8] text-sm mt-1">{criticalAlert.shortDescription}</p>
                    <p className="text-[#AAB2C8] text-xs mt-3">{formatDateTime(criticalAlert.timestamp)}</p>
                    <p className="text-[#4F8CFF] text-xs mt-1">Origem: {criticalAlert.origin}</p>
                  </>
                ) : (
                  <p className="text-[#AAB2C8] text-sm">Nenhum alerta critico ativo no momento.</p>
                )}
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="label-caps text-[#AAB2C8]">Alerta mais recente</p>
                  {latestAlert ? (
                    <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(getPriorityMeta(latestAlert.priority).color)}>
                      {getPriorityMeta(latestAlert.priority).label}
                    </span>
                  ) : null}
                </div>
                {latestAlert ? (
                  <>
                    <p className="font-heading font-semibold text-white text-lg">{latestAlert.title}</p>
                    <p className="text-[#AAB2C8] text-sm mt-1">{latestAlert.shortDescription}</p>
                    <p className="text-[#AAB2C8] text-xs mt-3">{formatDateTime(latestAlert.timestamp)}</p>
                    <p className="text-[#4F8CFF] text-xs mt-1">{latestAlert.sourceSummary ?? 'Sem evidencias adicionais registradas.'}</p>
                  </>
                ) : (
                  <p className="text-[#AAB2C8] text-sm">Nenhum alerta disponivel para as regioes cadastradas.</p>
                )}
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="cloud_done" size={16} className="text-[#2ECC71]" />
                <p className="label-caps text-[#AAB2C8]">Ultima prova de sincronizacao</p>
              </div>
              {latestWeatherSync ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {latestWeatherSync.entries.slice(0, 4).map(entry => (
                    <div key={entry.regionId} className="rounded-xl bg-[#0B1020]/70 border border-[#3a494b]/40 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-heading font-semibold text-white">{entry.regionName}</p>
                          <p className="text-[#AAB2C8] text-[11px]">Lat {entry.latitude} | Lon {entry.longitude}</p>
                        </div>
                        <span className="text-[#2ECC71] text-[11px]">{formatDateTime(entry.apiTime)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-[#AAB2C8]">
                        <div>
                          <p>Temp</p>
                          <p className="text-white mt-1">{entry.current.temperature} C</p>
                        </div>
                        <div>
                          <p>Umidade</p>
                          <p className="text-white mt-1">{entry.current.humidity}%</p>
                        </div>
                        <div>
                          <p>Vento</p>
                          <p className="text-white mt-1">{entry.current.wind} km/h</p>
                        </div>
                      </div>
                      <p className="text-[#AAB2C8] text-[11px] mt-3">
                        {getWeatherCodeLabel(entry.current.weatherCode)} | Visibilidade {formatKilometers(entry.current.visibility)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-[#0B1020]/70 border border-[#3a494b]/40 p-4">
                  <p className="text-white text-sm">Ainda nao houve sincronizacao real.</p>
                  <p className="text-[#AAB2C8] text-xs mt-1">
                    Va para Regioes e clique em "Atualizar clima real" para registrar a primeira resposta da Open-Meteo.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 glass-card p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="forest" size={16} className="text-[#4F8CFF]" />
                  <p className="label-caps text-[#AAB2C8]">Regioes priorizadas</p>
                </div>
                <div className="space-y-3">
                  {topRegions.map(region => {
                    const risk = getRiskMeta(region.risk)
                    const climate = getRiskMeta(region.climateRisk)
                    const official = getRiskMeta(region.officialRisk?.combinedRisk ?? 'baixo')

                    return (
                      <button
                        key={region.id}
                        onClick={() => navigate(`/regions/${region.id}`)}
                        className="w-full text-left p-4 rounded-xl bg-[#0B1020]/70 border border-[#3a494b]/40 hover:border-[#4F8CFF]/30 transition-all"
                      >
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div>
                            <p className="font-heading font-semibold text-white">{region.name}</p>
                            <p className="text-[#AAB2C8] text-xs">{region.city}/{region.state}</p>
                          </div>
                          <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(risk.color)}>
                            {risk.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-[#AAB2C8]">
                          <span>{region.temperature} C</span>
                          <span>{region.humidity}%</span>
                          <span>{region.wind} km/h</span>
                          <span>{region.activeAutoAlertsCount} alertas</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(climate.color)}>
                            Meteo {climate.label}
                          </span>
                          <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(official.color)}>
                            Oficial {official.label}
                          </span>
                          {region.isSimulated ? (
                            <span className="label-caps text-[9px] px-2 py-1 rounded-full border border-[#4F8CFF]/40 text-[#4F8CFF]">
                              Simulacao ativa
                            </span>
                          ) : null}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="glass-card p-4">
                <p className="label-caps text-[#AAB2C8] mb-3">Acesso rapido</p>
                <div className="space-y-2">
                  {[
                    { label: 'Regioes', icon: 'location_on', path: '/regions' },
                    { label: 'Mapa operacional', icon: 'radar', path: '/radar' },
                    { label: 'Alertas', icon: 'notifications_active', path: '/alerts' },
                    { label: 'Sensores', icon: 'sensors', path: '/sensors' },
                    { label: 'Historico', icon: 'history', path: '/history' },
                    { label: 'Recomendacoes', icon: 'task_alt', path: '/recommendations' },
                  ].map(item => (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-[#0B1020]/60 border border-[#3a494b]/40 hover:border-[#4F8CFF]/30 text-left transition-all"
                    >
                      <Icon name={item.icon} size={16} className="text-[#4F8CFF]" />
                      <span className="text-sm text-white flex-1">{item.label}</span>
                      <Icon name="chevron_right" size={16} className="text-[#AAB2C8]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
