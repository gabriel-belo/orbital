import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import { badgeStyle, formatDateTime, getRiskMeta } from '../lib/orbital'

export default function AIAnalysis() {
  const navigate = useNavigate()
  const { analysis, regionMap, simulateVisualAnalysis } = useAppData()
  const [message, setMessage] = useState('')
  const region = regionMap[analysis.regionId]
  const riskMeta = getRiskMeta(analysis.risk)

  const handleSimulate = () => {
    simulateVisualAnalysis()
    setMessage('Nova analise simulada com sucesso')
    setTimeout(() => setMessage(''), 1800)
  }

  return (
    <AppLayout title="ANALISE VISUAL">
      <div className="p-4 md:p-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F8CFF] animate-pulse" />
                <span className="label-caps text-[#AAB2C8]">Analise Visual por IA</span>
              </div>
              <button onClick={handleSimulate} className="btn-primary text-[10px] py-2">
                Simular nova analise
              </button>
            </div>

            <div className="relative bg-[#060f16] rounded-lg overflow-hidden aspect-video border border-[#3a494b]/40">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(#4F8CFF 1px, transparent 1px), linear-gradient(90deg, #4F8CFF 1px, transparent 1px)',
                  backgroundSize: '10% 10%',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="satellite" size={40} className="text-[#4F8CFF] mx-auto mb-3" />
                  <p className="font-heading font-semibold text-white">{region?.name}</p>
                  <p className="text-[#AAB2C8] text-sm">Imagem simulada para demonstracao academica</p>
                </div>
              </div>
            </div>

            <p className="text-[#AAB2C8] text-sm leading-relaxed mt-4">
              A imagem foi processada por visao computacional para identificar padroes compativeis com fumaca ou fogo. O resultado ajuda no calculo de prioridade do alerta.
            </p>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="label-caps text-[#AAB2C8]">Resultado</p>
                <span className="label-caps text-[9px] px-2 py-1 rounded-full" style={badgeStyle(riskMeta.color)}>
                  {riskMeta.label}
                </span>
              </div>
              <p className="font-heading font-semibold text-lg text-white">{analysis.result}</p>
              <p className="text-[#AAB2C8] text-sm mt-2">{analysis.explanation}</p>
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-[#AAB2C8] text-xs">Confianca</span>
                  <span className="text-white text-xs">{analysis.confidence}%</span>
                </div>
                <div className="h-2 bg-[#3a494b] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${analysis.confidence}%`, backgroundColor: riskMeta.color }} />
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <p className="label-caps text-[#AAB2C8] mb-3">Metadados</p>
              <div className="space-y-2 text-sm text-[#AAB2C8]">
                <p><span className="text-white">Regiao:</span> {region?.name}</p>
                <p><span className="text-white">Origem:</span> {analysis.origin}</p>
                <p><span className="text-white">Analise em:</span> {formatDateTime(analysis.timestamp)}</p>
              </div>
            </div>

            <div className="glass-card p-4">
              <p className="label-caps text-[#AAB2C8] mb-3">Alerta relacionado</p>
              {analysis.alertId ? (
                <>
                  <p className="text-white text-sm mb-3">Existe um alerta vinculado a este resultado visual.</p>
                  <button onClick={() => navigate(`/alerts/${analysis.alertId}`)} className="btn-primary w-full text-[10px] py-3">
                    Ver alerta relacionado
                  </button>
                </>
              ) : (
                <p className="text-[#AAB2C8] text-sm">Nenhum alerta ativo relacionado a esta analise.</p>
              )}
              {message && <p className="text-[#2ECC71] text-xs mt-3">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
