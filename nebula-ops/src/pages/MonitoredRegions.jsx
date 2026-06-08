import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import {
  badgeStyle,
  formatDateTime,
  formatKilometers,
  formatSignedDelta,
  formatSoilMoisture,
  getRiskMeta,
  getWeatherCodeLabel,
  getWindDirectionLabel,
} from '../lib/orbital'
import { riskOrder } from '../data/orbitalData'

export default function MonitoredRegions() {
  const navigate = useNavigate()
  const { addRegionFromCep, regions, syncRealWeather } = useAppData()
  const [search, setSearch] = useState('')
  const [cep, setCep] = useState('')
  const [riskFilter, setRiskFilter] = useState('todos')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [savingRegion, setSavingRegion] = useState(false)
  const [syncingWeather, setSyncingWeather] = useState(false)

  const filteredRegions = useMemo(() => {
    return regions
      .filter(region => {
        const matchesSearch =
          region.name.toLowerCase().includes(search.toLowerCase()) ||
          region.city?.toLowerCase().includes(search.toLowerCase())
        const matchesRisk = riskFilter === 'todos' || region.risk === riskFilter || region.climateRisk === riskFilter
        return matchesSearch && matchesRisk
      })
      .sort((a, b) => riskOrder.indexOf(a.risk) - riskOrder.indexOf(b.risk))
  }, [regions, riskFilter, search])

  const clearMessages = () => {
    setTimeout(() => {
      setFeedback('')
      setError('')
    }, 3000)
  }

  const handleAddRegion = async () => {
    setSavingRegion(true)
    setFeedback('')
    setError('')

    try {
      const region = await addRegionFromCep(cep)
      setFeedback(`Regiao ${region.name} cadastrada com sucesso`)
      setCep('')
    } catch (err) {
      if (err.message === 'CEP_INVALID') {
        setError('Informe um CEP valido com 8 digitos.')
      } else if (err.message === 'CEP_NOT_FOUND') {
        setError('Nao foi possivel localizar esse CEP.')
      } else if (err.message === 'GEOCODING_NOT_FOUND') {
        setError('Endereco encontrado, mas nao foi possivel obter coordenadas para essa regiao.')
      } else {
        setError('Nao foi possivel cadastrar a regiao agora.')
      }
    } finally {
      setSavingRegion(false)
      clearMessages()
    }
  }

  const handleSyncRealWeather = async () => {
    setSyncingWeather(true)
    setFeedback('')
    setError('')

    try {
      await syncRealWeather()
      setFeedback('Clima real, risco oficial e automacoes atualizados com sucesso')
    } catch (err) {
      if (err.message === 'NO_REGIONS') {
        setError('Cadastre ao menos uma regiao por CEP antes de sincronizar o clima real.')
      } else {
        setError('Nao foi possivel buscar dados reais agora. Mantendo dados simulados.')
      }
    } finally {
      setSyncingWeather(false)
      clearMessages()
    }
  }

  return (
    <AppLayout title="REGIOES MONITORADAS">
      <div className="p-4 md:p-6 max-w-6xl">
        <div className="glass-card p-4 mb-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
            <div className="flex-1">
              <h1 className="font-heading font-semibold text-xl text-white">Regioes monitoradas</h1>
              <p className="text-[#AAB2C8] text-sm mt-1">
                Cadastre regioes brasileiras por CEP, sincronize clima real e acompanhe a camada oficial.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative">
                <Icon name="pin_drop" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB2C8]" />
                <input
                  value={cep}
                  onChange={event => setCep(event.target.value)}
                  placeholder="Digite o CEP"
                  className="w-full sm:w-56 bg-[#151B2E] border border-[#3a494b] rounded-lg py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-[#4F8CFF]/60"
                />
              </div>
              <button onClick={handleAddRegion} disabled={savingRegion} className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
                <Icon name={savingRegion ? 'progress_activity' : 'add_location_alt'} size={14} />
                {savingRegion ? 'Buscando CEP...' : 'Salvar regiao'}
              </button>
              <button onClick={handleSyncRealWeather} disabled={syncingWeather} className="btn-ghost flex items-center justify-center gap-2 disabled:opacity-60">
                <Icon name={syncingWeather ? 'progress_activity' : 'cloud_sync'} size={14} />
                {syncingWeather ? 'Sincronizando...' : 'Atualizar clima real'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAB2C8]" />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Buscar regiao ou cidade"
                className="w-full sm:w-56 bg-[#151B2E] border border-[#3a494b] rounded-lg py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-[#4F8CFF]/60"
              />
            </div>
            <select
              value={riskFilter}
              onChange={event => setRiskFilter(event.target.value)}
              className="bg-[#151B2E] border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#4F8CFF]/60"
            >
              <option value="todos">Todos os riscos</option>
              <option value="baixo">Baixo</option>
              <option value="medio">Medio</option>
              <option value="alto">Alto</option>
              <option value="critico">Critico</option>
            </select>
          </div>
        </div>

        {(feedback || error) ? (
          <div className={`mb-4 rounded-xl px-4 py-3 text-sm border ${feedback ? 'bg-[#2ECC71]/10 border-[#2ECC71]/30 text-[#d5f7e2]' : 'bg-[#E74C3C]/10 border-[#E74C3C]/30 text-[#ffcbc3]'}`}>
            {feedback || error}
          </div>
        ) : null}

        {!filteredRegions.length ? (
          <div className="glass-card p-8 text-center">
            <Icon name="map" size={36} className="text-[#4F8CFF] mx-auto mb-3" />
            <p className="font-heading font-semibold text-white text-lg">Nenhuma regiao cadastrada</p>
            <p className="text-[#AAB2C8] text-sm mt-2">
              Digite um CEP brasileiro, salve a regiao e depois clique em "Atualizar clima real".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRegions.map(region => {
              const riskMeta = getRiskMeta(region.risk)
              const climateMeta = getRiskMeta(region.climateRisk)
              const officialMeta = getRiskMeta(region.officialRisk?.combinedRisk ?? 'baixo')

              return (
                <button
                  key={region.id}
                  onClick={() => navigate(`/regions/${region.id}`)}
                  className="glass-card p-5 text-left hover:bg-[#222b33]/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-heading font-semibold text-lg text-white">{region.name}</p>
                      <p className="text-[#AAB2C8] text-sm">{region.city}/{region.state} | CEP {region.cep}</p>
                    </div>
                    <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(riskMeta.color)}>
                      {riskMeta.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(climateMeta.color)}>
                      Meteo {climateMeta.label}
                    </span>
                    <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(officialMeta.color)}>
                      Oficial {officialMeta.label}
                    </span>
                    <span className="label-caps text-[9px] px-2 py-1 rounded-full border border-[#3a494b]/40 text-[#AAB2C8]">
                      Fonte: {region.sourceLabel}
                    </span>
                    {region.isSimulated ? (
                      <span className="label-caps text-[9px] px-2 py-1 rounded-full border border-[#4F8CFF]/40 text-[#4F8CFF]">
                        Simulacao ativa
                      </span>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0B1020]/60 border border-[#3a494b]/30 rounded-lg p-3">
                      <p className="label-caps text-[9px] text-[#AAB2C8]">Clima atual</p>
                      <p className="text-sm text-white mt-1">{region.temperature} C / {region.humidity}%</p>
                      <p className="text-[#AAB2C8] text-[11px] mt-2">{getWeatherCodeLabel(region.weatherCode)}</p>
                      <p className="text-[#AAB2C8] text-[11px] mt-2">Temp. percebida {region.apparentTemperature} C</p>
                    </div>
                    <div className="bg-[#0B1020]/60 border border-[#3a494b]/30 rounded-lg p-3">
                      <p className="label-caps text-[9px] text-[#AAB2C8]">Vento</p>
                      <p className="text-sm text-white mt-1">{region.wind} km/h</p>
                      <p className="text-[#AAB2C8] text-[11px] mt-2">Dir. {getWindDirectionLabel(region.windDirection)} / Rajadas {region.windGusts} km/h</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-[#AAB2C8]"><span className="text-white">Visibilidade:</span> {formatKilometers(region.visibility)}</p>
                    <p className="text-[#AAB2C8]"><span className="text-white">Nuvens:</span> {region.cloudCover}%</p>
                    <p className="text-[#AAB2C8]"><span className="text-white">Precipitacao:</span> {region.precipitation} mm</p>
                    <p className="text-[#AAB2C8]"><span className="text-white">Chance de chuva:</span> {region.precipitationProbability}%</p>
                    <p className="text-[#AAB2C8]"><span className="text-white">Solo 0-1 cm:</span> {formatSoilMoisture(region.soilMoisture0To1cm)}</p>
                    <p className="text-[#AAB2C8]"><span className="text-white">Status:</span> {region.operationalStatus}</p>
                    <p className="text-[#AAB2C8]"><span className="text-white">Alerta atual:</span> {region.lastAlert}</p>
                    <p className="text-[#AAB2C8]"><span className="text-white">Sensores:</span> {region.sensorsCount}</p>
                  </div>

                  <div className="mt-4 rounded-xl border border-[#4F8CFF]/20 bg-[#0B1020]/60 p-3">
                    <p className="text-[#4F8CFF] text-xs font-semibold">Selo oficial</p>
                    <p className="text-[#AAB2C8] text-[11px] mt-1">
                      INPE: {region.officialRisk?.inpe?.summary ?? 'Dado oficial indisponivel'}
                    </p>
                    <p className="text-[#AAB2C8] text-[11px] mt-1">
                      CEMADEN: {region.officialRisk?.cemaden?.summary ?? 'Dado oficial indisponivel'}
                    </p>
                    <p className="text-[#AAB2C8] text-[11px] mt-1">
                      Ultima consulta oficial: {region.officialRisk?.lastOfficialSync ? formatDateTime(region.officialRisk.lastOfficialSync) : 'Indisponivel'}
                    </p>
                  </div>

                  {region.latestRegionSync ? (
                    <div className="mt-4 rounded-xl border border-[#2ECC71]/30 bg-[#2ECC71]/10 p-3">
                      <p className="text-[#2ECC71] text-xs font-semibold">Open-Meteo atualizou esta regiao</p>
                      <p className="text-[#d5f7e2] text-[11px] mt-1">Resposta em {formatDateTime(region.latestRegionSync.apiTime)}</p>
                      <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                        <div>
                          <p className="text-[#AAB2C8]">Temp</p>
                          <p className="text-white">{region.latestRegionSync.current.temperature} C</p>
                          <p className="text-[#4F8CFF]">{formatSignedDelta(region.latestRegionSync.current.temperature - region.latestRegionSync.previous.temperature, ' C')}</p>
                        </div>
                        <div>
                          <p className="text-[#AAB2C8]">Umidade</p>
                          <p className="text-white">{region.latestRegionSync.current.humidity}%</p>
                          <p className="text-[#4F8CFF]">{formatSignedDelta(region.latestRegionSync.current.humidity - region.latestRegionSync.previous.humidity, '%')}</p>
                        </div>
                        <div>
                          <p className="text-[#AAB2C8]">Vento</p>
                          <p className="text-white">{region.latestRegionSync.current.wind} km/h</p>
                          <p className="text-[#4F8CFF]">{formatSignedDelta(region.latestRegionSync.current.wind - region.latestRegionSync.previous.wind, ' km/h')}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center gap-2 text-[#4F8CFF] text-xs">
                    <Icon name="open_in_new" size={14} />
                    Abrir detalhes da regiao
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
