import {
  alertStatusLabels,
  priorityLabels,
  recommendationTypeLabels,
  riskColors,
  riskLabels,
  sensorStatusColors,
  sensorStatusLabels,
  sourceLabels,
} from '../data/orbitalData'

export function formatDateTime(value) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatShortTime(value) {
  return new Date(value).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatSignedDelta(value, suffix = '') {
  if (value === 0) return `0${suffix}`
  return `${value > 0 ? '+' : ''}${value}${suffix}`
}

export function getRiskMeta(risk) {
  return {
    label: riskLabels[risk],
    color: riskColors[risk],
  }
}

export function getPriorityMeta(priority) {
  return {
    label: priorityLabels[priority],
    color: riskColors[priority],
  }
}

export function getAlertStatusMeta(status) {
  const colorMap = {
    novo: '#4F8CFF',
    em_analise: '#F1C40F',
    em_atendimento: '#E67E22',
    monitorando: '#2ECC71',
    resolvido: '#8B9BB4',
  }

  return {
    label: alertStatusLabels[status],
    color: colorMap[status],
  }
}

export function getSensorStatusMeta(status) {
  return {
    label: sensorStatusLabels[status],
    color: sensorStatusColors[status],
  }
}

export function getRecommendationTypeMeta(type) {
  const colorMap = {
    operacional: '#4F8CFF',
    preventiva: '#E67E22',
    tecnica: '#2ECC71',
    seguranca: '#F1C40F',
  }

  return {
    label: recommendationTypeLabels[type],
    color: colorMap[type],
  }
}

export function getSourceLabel(source) {
  return sourceLabels[source] ?? source
}

export function badgeStyle(color) {
  return {
    color,
    backgroundColor: `${color}20`,
    border: `1px solid ${color}44`,
  }
}

const WEATHER_CODE_LABELS = {
  0: 'Ceu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Encoberto',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Garoa fraca',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  56: 'Garoa congelante fraca',
  57: 'Garoa congelante intensa',
  61: 'Chuva fraca',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva congelante fraca',
  67: 'Chuva congelante forte',
  71: 'Neve fraca',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Graos de neve',
  80: 'Pancadas fracas',
  81: 'Pancadas moderadas',
  82: 'Pancadas fortes',
  85: 'Pancadas de neve fracas',
  86: 'Pancadas de neve fortes',
  95: 'Trovoada',
  96: 'Trovoada com granizo fraco',
  99: 'Trovoada com granizo forte',
}

export function getWeatherCodeLabel(code) {
  return WEATHER_CODE_LABELS[code] ?? 'Condicao nao identificada'
}

export function getWindDirectionLabel(degrees) {
  if (typeof degrees !== 'number') return '-'
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

export function formatKilometers(value) {
  if (typeof value !== 'number') return '-'
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)} km`
  }
  return `${Math.round(value)} m`
}

export function formatSoilMoisture(value) {
  if (typeof value !== 'number') return '-'
  return `${(value * 100).toFixed(1)}%`
}

export function formatElapsedFromNow(value) {
  const diffMs = Math.max(0, Date.now() - new Date(value).getTime())
  const totalMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${String(minutes).padStart(2, '0')} min`
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}min`
}
