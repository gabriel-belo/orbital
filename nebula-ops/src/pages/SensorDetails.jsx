import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import { useAppData } from '../context/AppDataContext'
import { formatDateTime, getSensorStatusMeta } from '../lib/orbital'

export default function SensorDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { regionMap, sensors } = useAppData()
  const sensor = sensors.find(item => item.id === id)

  if (!sensor) {
    return (
      <AppLayout title="SENSOR" showBack>
        <div className="p-4 md:p-6 max-w-3xl">
          <div className="glass-card p-8 text-center">
            <p className="font-heading font-semibold text-white text-lg">Sensor nao encontrado</p>
            <p className="text-[#AAB2C8] text-sm mt-2">Esse sensor nao esta disponivel no contexto atual.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const region = regionMap[sensor.regionId]
  const statusMeta = getSensorStatusMeta(sensor.status)

  return (
    <AppLayout title={sensor.name} showBack>
      <div className="p-4 md:p-6 max-w-3xl">
        <div className="glass-card p-5 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={{ color: statusMeta.color, backgroundColor: `${statusMeta.color}20`, border: `1px solid ${statusMeta.color}44` }}>
                {statusMeta.label}
              </span>
              <h1 className="font-heading font-bold text-2xl text-white mt-3">{sensor.name}</h1>
              <p className="text-[#AAB2C8] text-sm mt-1">{region?.name ?? 'Sem regiao ativa'}</p>
            </div>
            <button onClick={() => navigate('/sensors')} className="btn-ghost text-[10px] py-2">
              Voltar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <p className="label-caps text-[#AAB2C8] mb-3">Leitura atual</p>
            <p className="font-heading font-bold text-4xl text-white">{sensor.displayValue}</p>
            <p className="text-[#AAB2C8] text-sm mt-2">Ultima leitura em {formatDateTime(sensor.lastReading)}</p>
            {sensor.readingSource ? <p className="text-[#4F8CFF] text-xs mt-2">{sensor.readingSource}</p> : null}
          </div>

          <div className="glass-card p-4">
            <p className="label-caps text-[#AAB2C8] mb-3">Estado do sensor</p>
            <div className="space-y-2 text-sm text-[#AAB2C8]">
              <p><span className="text-white">Tipo:</span> {sensor.type}</p>
              <p><span className="text-white">Unidade:</span> {sensor.unit}</p>
              <p><span className="text-white">Bateria:</span> {sensor.battery ?? '--'}%</p>
              <p><span className="text-white">Critico:</span> {sensor.critical ? 'Sim' : 'Nao'}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
