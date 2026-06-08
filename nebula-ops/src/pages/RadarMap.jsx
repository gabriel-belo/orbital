import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Icon from '../components/Icon'
import { useAppData } from '../context/AppDataContext'
import { badgeStyle, getRiskMeta } from '../lib/orbital'

function buildRadarPositions(regions) {
  const presets = [
    { x: 50, y: 18 },
    { x: 72, y: 34 },
    { x: 76, y: 62 },
    { x: 50, y: 78 },
    { x: 24, y: 62 },
    { x: 28, y: 34 },
    { x: 50, y: 50 },
    { x: 64, y: 50 },
  ]

  return regions.map((region, index) => ({
    ...region,
    ...(presets[index % presets.length] ?? { x: 50, y: 50 }),
  }))
}

function getNodeColor(region) {
  if (region.isSimulated) return '#4F8CFF'
  if ((region.officialRisk?.combinedRisk ?? 'baixo') === 'critico') return '#E74C3C'
  if (region.risk === 'alto' || region.risk === 'critico') return '#E67E22'
  return '#2ECC71'
}

export default function RadarMap() {
  const navigate = useNavigate()
  const { regions } = useAppData()
  const [hovered, setHovered] = useState(null)
  const nodes = useMemo(() => buildRadarPositions(regions), [regions])
  const criticalNode = nodes.find(region => region.risk === 'critico')

  return (
    <AppLayout title="MAPA OPERACIONAL">
      <div className="p-4 md:p-6">
        {!nodes.length ? (
          <div className="glass-card p-8 text-center max-w-4xl">
            <Icon name="radar" size={36} className="text-[#4F8CFF] mx-auto mb-3" />
            <p className="font-heading font-semibold text-white text-lg">Nenhuma regiao no mapa</p>
            <p className="text-[#AAB2C8] text-sm mt-2">Cadastre uma regiao por CEP para ativar o painel operacional.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 glass-card p-4 aspect-square max-h-[560px]">
              <div className="relative w-full h-full min-h-[320px] bg-[#060f16] rounded-lg overflow-hidden border border-[#3a494b]/30">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(#00dbe7 1px, transparent 1px), linear-gradient(90deg, #00dbe7 1px, transparent 1px)',
                    backgroundSize: '10% 10%',
                  }}
                />

                {[20, 35, 50, 65, 80].map(radius => (
                  <div
                    key={radius}
                    className="radar-ring pointer-events-none"
                    style={{ width: `${radius * 2}%`, height: `${radius * 2}%` }}
                  />
                ))}

                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#00dbe7]/10" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#00dbe7]/10" />
                <div
                  className="absolute inset-0 rounded-full pointer-events-none animate-radar-sweep origin-center"
                  style={{ background: 'conic-gradient(from 0deg, transparent 300deg, #00dbe730 360deg)' }}
                />

                {nodes.map(node => {
                  const color = getNodeColor(node)
                  return (
                    <div
                      key={node.id}
                      className="absolute cursor-pointer"
                      style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                      onMouseEnter={() => setHovered(node.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => navigate(`/regions/${node.id}`)}
                    >
                      <div className="absolute inset-0 rounded-full animate-pulse-ring pointer-events-none" style={{ backgroundColor: `${color}40`, margin: '-5px' }} />
                      <div
                        className="w-3 h-3 rounded-full border"
                        style={{
                          backgroundColor: `${color}40`,
                          borderColor: color,
                          boxShadow: `0 0 8px ${color}80`,
                        }}
                      />
                      {hovered === node.id ? (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 whitespace-nowrap">
                          <div className="bg-[#182028] border border-[#3a494b] rounded-lg px-2.5 py-1.5 shadow-xl">
                            <p className="label-caps text-[9px] text-[#e1fdff]">{node.name}</p>
                            <p className="label-caps text-[8px]" style={{ color }}>
                              {node.isSimulated ? 'SIMULACAO' : `RISCO ${getRiskMeta(node.risk).label.toUpperCase()}`}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )
                })}

                <div className="absolute bottom-3 left-3 bg-[#0b141c]/90 border border-[#3a494b]/60 rounded-lg px-3 py-2">
                  <p className="label-caps text-[9px] text-[#849495]">STATUS OPERACIONAL</p>
                  <p className="font-heading font-semibold text-sm text-[#e1fdff]">
                    Regioes ativas: <span className="text-[#00dbe7]">{nodes.length}</span>
                  </p>
                </div>

                {criticalNode ? (
                  <div className="absolute top-3 right-3 bg-[#93000a]/60 border border-[#ffb4ab]/30 rounded-lg px-3 py-2 max-w-[200px]">
                    <p className="label-caps text-[9px] text-[#ffb4ab] flex items-center gap-1 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-blink inline-block" />
                      ALERTA CRITICO
                    </p>
                    <p className="text-[#ffb4ab] text-[11px] leading-snug">{criticalNode.name} esta em faixa critica.</p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-3">
              <div className="glass-card p-4">
                <p className="label-caps text-[#849495] text-[10px] mb-3">LEGENDA</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Nominal', color: '#2ECC71' },
                    { label: 'Risco elevado', color: '#E67E22' },
                    { label: 'Risco oficial critico', color: '#E74C3C' },
                    { label: 'Simulacao ativa', color: '#4F8CFF' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}80` }} />
                      <span className="text-[#b9cacb] text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <p className="label-caps text-[#849495] text-[10px]">REGIOES NO PAINEL</p>
                  <button onClick={() => navigate('/regions')} className="text-[#4F8CFF] text-xs">Abrir lista</button>
                </div>
                <div className="space-y-2">
                  {nodes.map(node => {
                    const overall = getRiskMeta(node.risk)
                    const color = getNodeColor(node)
                    return (
                      <button
                        key={node.id}
                        onClick={() => navigate(`/regions/${node.id}`)}
                        className="w-full flex items-start gap-2.5 py-2 px-3 rounded-lg hover:bg-[#222b33] transition-colors text-left"
                      >
                        <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: color }} />
                        <div className="flex-1">
                          <p className="text-[#e1fdff] text-xs font-heading">{node.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="label-caps text-[8px] px-2 py-1 rounded-full" style={badgeStyle(overall.color)}>
                              {overall.label}
                            </span>
                            {node.isSimulated ? (
                              <span className="label-caps text-[8px] px-2 py-1 rounded-full border border-[#4F8CFF]/40 text-[#4F8CFF]">
                                Simulacao
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
