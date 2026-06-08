import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import { badgeStyle, formatDateTime, getSensorStatusMeta } from '../lib/orbital'

export default function SensorNetwork() {
  const navigate = useNavigate()
  const { regionMap, sensors, simulateSensorReadings } = useAppData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [regionFilter, setRegionFilter] = useState('todos')
  const [message, setMessage] = useState('')

  const filteredSensors = useMemo(() => {
    return sensors.filter(sensor => {
      const region = regionMap[sensor.regionId]
      const term = search.toLowerCase()
      const matchesSearch =
        sensor.name.toLowerCase().includes(term) ||
        sensor.type.toLowerCase().includes(term) ||
        region?.name?.toLowerCase().includes(term)
      const matchesStatus = statusFilter === 'todos' || sensor.status === statusFilter
      const matchesRegion = regionFilter === 'todos' || sensor.regionId === regionFilter
      return matchesSearch && matchesStatus && matchesRegion
    })
  }, [regionFilter, regionMap, search, sensors, statusFilter])

  const handleSimulate = () => {
    simulateSensorReadings()
    setMessage('Leituras simuladas com sucesso')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <AppLayout title="SENSORES">
      <div className="p-4 md:p-6 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <div>
            <h1 className="font-heading font-semibold text-xl text-white">Sensores ambientais</h1>
            <p className="text-[#AAB2C8] text-sm">Acompanhamento local das leituras e estabilidade da rede.</p>
          </div>
          <div className="flex items-center gap-3">
            {message && <span className="text-xs text-[#2ECC71]">{message}</span>}
            <button onClick={handleSimulate} className="btn-primary flex items-center gap-2">
              <Icon name="sync" size={14} />
              Simular leitura
            </button>
          </div>
        </div>

        {!sensors.length ? (
          <div className="glass-card p-8 text-center">
            <Icon name="sensors_off" size={36} className="text-[#4F8CFF] mx-auto mb-3" />
            <p className="font-heading font-semibold text-white text-lg">Nenhum sensor disponivel</p>
            <p className="text-[#AAB2C8] text-sm mt-2">
              No modo atual, os sensores fixos so aparecem quando existe uma regiao vinculada compatível.
            </p>
          </div>
        ) : (
          <>
            <div className="glass-card p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Buscar por nome, tipo ou regiao"
                className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none"
              />
              <select value={regionFilter} onChange={event => setRegionFilter(event.target.value)} className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
                <option value="todos">Todas as regioes</option>
                {Object.values(regionMap).map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="bg-[#0B1020]/70 border border-[#3a494b] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
                <option value="todos">Todos os status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="instavel">Instavel</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredSensors.map(sensor => {
                const statusMeta = getSensorStatusMeta(sensor.status)
                const region = regionMap[sensor.regionId]
                return (
                  <button
                    key={sensor.id}
                    onClick={() => navigate(`/sensors/${sensor.id}`)}
                    className={`glass-card p-4 w-full text-left transition-all ${sensor.critical ? 'border-[#E74C3C]/40' : 'hover:bg-[#222b33]/60'}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(statusMeta.color)}>
                            {statusMeta.label}
                          </span>
                          <span className="text-[#AAB2C8] text-xs">{region?.name ?? 'Sem regiao ativa'}</span>
                          {region ? <span className="text-[#AAB2C8] text-xs">Fonte: {region.sourceLabel}</span> : null}
                          {sensor.readingSource ? <span className="text-[#4F8CFF] text-xs">{sensor.readingSource}</span> : null}
                        </div>
                        <p className="font-heading font-semibold text-lg text-white">{sensor.name}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                          <div>
                            <p className="text-[#AAB2C8] text-xs">Valor atual</p>
                            <p className="text-white">{sensor.displayValue}</p>
                          </div>
                          <div>
                            <p className="text-[#AAB2C8] text-xs">Tipo</p>
                            <p className="text-white">{sensor.type}</p>
                          </div>
                          <div>
                            <p className="text-[#AAB2C8] text-xs">Ultima leitura</p>
                            <p className="text-white">{formatDateTime(sensor.lastReading)}</p>
                          </div>
                          <div>
                            <p className="text-[#AAB2C8] text-xs">Bateria</p>
                            <p className="text-white">{sensor.battery ?? '--'}%</p>
                          </div>
                        </div>
                      </div>
                      {sensor.critical && (
                        <div className="flex items-center gap-2 text-[#E74C3C] text-xs">
                          <Icon name="priority_high" size={16} />
                          Leitura critica
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
