import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import {
  badgeStyle,
  formatDateTime,
  formatKilometers,
  formatSignedDelta,
  formatSoilMoisture,
  getPriorityMeta,
  getRiskMeta,
  getWeatherCodeLabel,
  getWindDirectionLabel,
} from '../lib/orbital'

export default function RegionDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activateSimulation, clearSimulation, regions, simulationScenarios } = useAppData()
  const region = regions.find(item => item.id === id)

  if (!region) {
    return (
      <AppLayout title="REGIAO" showBack>
        <div className="p-4 md:p-6 max-w-4xl">
          <div className="glass-card p-8 text-center">
            <Icon name="location_off" size={36} className="text-[#4F8CFF] mx-auto mb-3" />
            <p className="font-heading font-semibold text-white text-lg">Regiao nao encontrada</p>
            <p className="text-[#AAB2C8] text-sm mt-2">Essa regiao nao existe mais ou ainda nao foi cadastrada por CEP.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const riskMeta = getRiskMeta(region.risk)
  const climateMeta = getRiskMeta(region.climateRisk)
  const officialMeta = getRiskMeta(region.officialRisk?.combinedRisk ?? 'baixo')
  const criticalAlert = region.linkedAlerts.find(item => item.priority === 'critico' && item.status !== 'resolvido')

  return (
    <AppLayout title={region.name} showBack>
      <div className="p-4 md:p-6 max-w-6xl">
        <div className="glass-card p-5 mb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="forest" size={16} className="text-[#4F8CFF]" />
                <span className="label-caps text-[#AAB2C8]">Detalhes da regiao</span>
              </div>
              <h1 className="font-heading font-bold text-2xl text-white">{region.name}</h1>
              <p className="text-[#AAB2C8] text-sm mt-2 max-w-2xl">{region.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(climateMeta.color)}>
                  Meteo {climateMeta.label}
                </span>
                <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(officialMeta.color)}>
                  Oficial {officialMeta.label}
                </span>
                <span className="label-caps text-[9px] px-2 py-1 rounded-full border border-[#3a494b]/40 text-[#AAB2C8]">
                  Fonte predominante: {region.sourceLabel}
                </span>
                {region.isSimulated ? (
                  <span className="label-caps text-[9px] px-2 py-1 rounded-full border border-[#4F8CFF]/40 text-[#4F8CFF]">
                    Modo demonstracao ativo
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="label-caps text-[9px] px-2 py-1 rounded-full h-fit" style={badgeStyle(riskMeta.color)}>
                Risco {riskMeta.label}
              </span>
              <button onClick={() => navigate('/radar')} className="btn-ghost flex items-center gap-2 text-[10px] py-2">
                <Icon name="radar" size={14} />
                Abrir mapa operacional
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 mb-4 border-[#4F8CFF]/25">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="science" size={16} className="text-[#4F8CFF]" />
            <p className="label-caps text-[#AAB2C8]">Modo demonstracao</p>
          </div>
          <p className="text-[#AAB2C8] text-sm mb-4">
            Aplique cenarios controlados sobre esta regiao para demonstrar alertas, historico e precedencia entre risco meteorologico e risco oficial.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {simulationScenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => activateSimulation(region.id, scenario.id)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  region.simulation?.id === scenario.id
                    ? 'border-[#4F8CFF]/50 bg-[#4F8CFF]/10'
                    : 'border-[#3a494b]/30 bg-[#0B1020]/60 hover:border-[#4F8CFF]/30'
                }`}
              >
                <p className="font-heading font-semibold text-white text-sm">{scenario.title}</p>
                <p className="text-[#AAB2C8] text-xs mt-1">{scenario.description}</p>
                <p className="text-[#4F8CFF] text-[11px] mt-2">Risco esperado: {getRiskMeta(scenario.expectedRisk).label}</p>
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
            <p className="text-[#AAB2C8] text-xs">
              {region.isSimulated
                ? `Cenario ativo: ${region.simulation?.title}. Dados reais continuam preservados em segundo plano.`
                : 'Nenhum cenario ativo. A regiao esta operando com seus dados reais atuais.'}
            </p>
            {region.isSimulated ? (
              <button onClick={() => clearSimulation(region.id)} className="btn-primary flex items-center gap-2">
                <Icon name="restart_alt" size={14} />
                Voltar para dados reais
              </button>
            ) : null}
          </div>
        </div>

        {region.latestRegionSync ? (
          <div className="glass-card p-4 mb-4 border-[#2ECC71]/30">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="cloud_done" size={16} className="text-[#2ECC71]" />
              <p className="label-caps text-[#AAB2C8]">Prova de sincronizacao da API</p>
            </div>
            <p className="text-white text-sm">
              Open-Meteo respondeu para esta regiao em {formatDateTime(region.latestRegionSync.apiTime)}
            </p>
            <p className="text-[#AAB2C8] text-xs mt-1">
              Coordenadas consultadas: {region.latestRegionSync.latitude}, {region.latestRegionSync.longitude}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm">
              <div className="bg-[#0B1020]/60 border border-[#3a494b]/30 rounded-lg p-3">
                <p className="text-[#AAB2C8] text-xs">Temperatura</p>
                <p className="text-white">{region.latestRegionSync.previous.temperature} C {'->'} {region.latestRegionSync.current.temperature} C</p>
                <p className="text-[#4F8CFF] text-xs mt-1">{formatSignedDelta(region.latestRegionSync.current.temperature - region.latestRegionSync.previous.temperature, ' C')}</p>
              </div>
              <div className="bg-[#0B1020]/60 border border-[#3a494b]/30 rounded-lg p-3">
                <p className="text-[#AAB2C8] text-xs">Umidade</p>
                <p className="text-white">{region.latestRegionSync.previous.humidity}% {'->'} {region.latestRegionSync.current.humidity}%</p>
                <p className="text-[#4F8CFF] text-xs mt-1">{formatSignedDelta(region.latestRegionSync.current.humidity - region.latestRegionSync.previous.humidity, '%')}</p>
              </div>
              <div className="bg-[#0B1020]/60 border border-[#3a494b]/30 rounded-lg p-3">
                <p className="text-[#AAB2C8] text-xs">Vento</p>
                <p className="text-white">{region.latestRegionSync.previous.wind} km/h {'->'} {region.latestRegionSync.current.wind} km/h</p>
                <p className="text-[#4F8CFF] text-xs mt-1">{formatSignedDelta(region.latestRegionSync.current.wind - region.latestRegionSync.previous.wind, ' km/h')}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Temperatura', value: `${region.temperature} C`, icon: 'thermometer' },
            { label: 'Temp. percebida', value: `${region.apparentTemperature} C`, icon: 'device_thermostat' },
            { label: 'Umidade', value: `${region.humidity}%`, icon: 'humidity_percentage' },
            { label: 'Vento', value: `${region.wind} km/h`, icon: 'air' },
            { label: 'Rajadas', value: `${region.windGusts} km/h`, icon: 'airwave' },
            { label: 'Visibilidade', value: formatKilometers(region.visibility), icon: 'visibility' },
          ].map(card => (
            <div key={card.label} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={card.icon} size={16} className="text-[#4F8CFF]" />
                <p className="label-caps text-[#AAB2C8]">{card.label}</p>
              </div>
              <p className="font-heading font-bold text-3xl text-white">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="verified" size={16} className="text-[#4F8CFF]" />
              <p className="label-caps text-[#AAB2C8]">Risco oficial</p>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-[#AAB2C8]"><span className="text-white">Nivel combinado:</span> {officialMeta.label}</p>
              <div>
                <p className="text-white">INPE Queimadas</p>
                <p className="text-[#AAB2C8] mt-1">{region.officialRisk?.inpe?.summary ?? 'Dado oficial indisponivel'}</p>
              </div>
              <div>
                <p className="text-white">CEMADEN</p>
                <p className="text-[#AAB2C8] mt-1">{region.officialRisk?.cemaden?.summary ?? 'Dado oficial indisponivel'}</p>
                <p className="text-[#AAB2C8] mt-1">Granularidade: {region.officialRisk?.cemaden?.granularity ?? 'nacional'}</p>
              </div>
              <p className="text-[#AAB2C8]">
                <span className="text-white">Ultima consulta oficial:</span> {region.officialRisk?.lastOfficialSync ? formatDateTime(region.officialRisk.lastOfficialSync) : 'Indisponivel'}
              </p>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="partly_cloudy_day" size={16} className="text-[#4F8CFF]" />
              <p className="label-caps text-[#AAB2C8]">Condicao atual</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-[#AAB2C8]"><span className="text-white">Risco meteorologico:</span> {climateMeta.label}</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Codigo WMO:</span> {region.weatherCode}</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Leitura humana:</span> {getWeatherCodeLabel(region.weatherCode)}</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Cobertura de nuvens:</span> {region.cloudCover}%</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Direcao do vento:</span> {region.windDirection} graus ({getWindDirectionLabel(region.windDirection)})</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Pressao de superficie:</span> {region.surfacePressure} hPa</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Pressao ao nivel do mar:</span> {region.seaLevelPressure} hPa</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Deficit de pressao de vapor:</span> {region.vapourPressureDeficit} kPa</p>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="water_drop" size={16} className="text-[#4F8CFF]" />
              <p className="label-caps text-[#AAB2C8]">Chuva e solo</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-[#AAB2C8]"><span className="text-white">Chuva:</span> {region.rain} mm</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Pancadas:</span> {region.showers} mm</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Chance de precipitacao:</span> {region.precipitationProbability}%</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Solo 0-1 cm:</span> {formatSoilMoisture(region.soilMoisture0To1cm)}</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Solo 1-3 cm:</span> {formatSoilMoisture(region.soilMoisture1To3cm)}</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Solo 3-9 cm:</span> {formatSoilMoisture(region.soilMoisture3To9cm)}</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Solo 9-27 cm:</span> {formatSoilMoisture(region.soilMoisture9To27cm)}</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Solo 27-81 cm:</span> {formatSoilMoisture(region.soilMoisture27To81cm)}</p>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="today" size={16} className="text-[#4F8CFF]" />
              <p className="label-caps text-[#AAB2C8]">Resumo diario</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-[#AAB2C8]"><span className="text-white">Maxima:</span> {region.dailyTemperatureMax} C</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Minima:</span> {region.dailyTemperatureMin} C</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Chuva do dia:</span> {region.dailyPrecipitationSum} mm</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Rain sum:</span> {region.dailyRainSum} mm</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Showers sum:</span> {region.dailyShowersSum} mm</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Prob. max de chuva:</span> {region.dailyPrecipitationProbabilityMax}%</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Rajada maxima:</span> {region.dailyWindGustsMax} km/h</p>
              <p className="text-[#AAB2C8]"><span className="text-white">Dir. dominante:</span> {region.dailyWindDirectionDominant} graus ({getWindDirectionLabel(region.dailyWindDirectionDominant)})</p>
              <p className="text-[#AAB2C8]"><span className="text-white">UV max:</span> {region.dailyUvIndexMax}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <p className="label-caps text-[#AAB2C8] mb-3">Sensores vinculados</p>
            {region.linkedSensors.length ? (
              <div className="space-y-3">
                {region.linkedSensors.map(sensor => (
                  <button
                    key={sensor.id}
                    onClick={() => navigate(`/sensors/${sensor.id}`)}
                    className="w-full flex items-center justify-between gap-3 bg-[#0B1020]/60 border border-[#3a494b]/30 rounded-lg p-3 text-left hover:border-[#4F8CFF]/30"
                  >
                    <div>
                      <p className="text-white text-sm">{sensor.name}</p>
                      <p className="text-[#AAB2C8] text-xs">{sensor.displayValue}</p>
                      {sensor.readingSource ? <p className="text-[#4F8CFF] text-[11px] mt-1">{sensor.readingSource}</p> : null}
                    </div>
                    <Icon name="chevron_right" size={16} className="text-[#AAB2C8]" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[#AAB2C8] text-sm">Nenhum sensor vinculado a esta regiao no prototipo atual.</p>
            )}
          </div>

          <div className="glass-card p-4">
            <p className="label-caps text-[#AAB2C8] mb-3">Alertas recentes</p>
            {region.linkedAlerts.length ? (
              <div className="space-y-3">
                {region.linkedAlerts.map(alert => {
                  const meta = getPriorityMeta(alert.priority)
                  return (
                    <button
                      key={alert.id}
                      onClick={() => navigate(`/alerts/${alert.id}`)}
                      className="w-full bg-[#0B1020]/60 border border-[#3a494b]/30 rounded-lg p-3 text-left hover:border-[#4F8CFF]/30"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-white text-sm">{alert.title}</p>
                        <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(meta.color)}>
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-[#AAB2C8] text-xs">{alert.shortDescription}</p>
                      <p className="text-[#4F8CFF] text-[11px] mt-2">{alert.sourceSummary ?? `Origem ${alert.origin}`}</p>
                    </button>
                  )
                })}
              </div>
            ) : (
              <p className="text-[#AAB2C8] text-sm">Nenhum alerta vinculado a esta regiao no modo atual.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-4 mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="label-caps text-[#AAB2C8] mb-1">Recomendacao de acao</p>
            <p className="text-white text-sm">{region.actionRecommendation}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={() => navigate(`/alerts?region=${region.id}`)} className="btn-primary flex items-center gap-2">
              <Icon name="notifications_active" size={14} />
              Ver alertas desta regiao
            </button>
            {criticalAlert ? (
              <button onClick={() => navigate(`/emergency?alert=${criticalAlert.id}`)} className="btn-ghost flex items-center gap-2">
                <Icon name="warning" size={14} />
                Abrir acao emergencial
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
