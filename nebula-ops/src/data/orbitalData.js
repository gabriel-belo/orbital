export const riskOrder = ['critico', 'alto', 'medio', 'baixo']
export const priorityOrder = ['critico', 'alto', 'medio', 'baixo']
export const alertStatusOrder = ['novo', 'em_analise', 'em_atendimento', 'monitorando', 'resolvido']

export const riskLabels = {
  baixo: 'Baixo',
  medio: 'Medio',
  alto: 'Alto',
  critico: 'Critico',
}

export const priorityLabels = {
  baixo: 'Baixa',
  medio: 'Media',
  alto: 'Alta',
  critico: 'Critica',
}

export const alertStatusLabels = {
  novo: 'Novo',
  em_analise: 'Em analise',
  em_atendimento: 'Em atendimento',
  monitorando: 'Monitorando',
  resolvido: 'Resolvido',
}

export const sensorStatusLabels = {
  online: 'Online',
  offline: 'Offline',
  instavel: 'Instavel',
}

export const recommendationTypeLabels = {
  operacional: 'Operacional',
  preventiva: 'Preventiva',
  tecnica: 'Tecnica',
  seguranca: 'Seguranca',
}

export const riskColors = {
  baixo: '#2ECC71',
  medio: '#F1C40F',
  alto: '#E67E22',
  critico: '#E74C3C',
}

export const sensorStatusColors = {
  online: '#2ECC71',
  offline: '#E74C3C',
  instavel: '#F1C40F',
}

export const sourceLabels = {
  visual: 'Analise Visual',
  sensor: 'Sensor Ambiental',
  api: 'Open-Meteo',
  mock: 'Dados simulados',
  open_meteo: 'Open-Meteo',
  inpe: 'INPE Queimadas',
  cemaden: 'CEMADEN',
  simulated: 'Simulacao controlada',
  demo: 'Demonstracao',
}

export const demoUser = {
  id: 'OP-742',
  name: 'Operador Ambiental',
  profile: 'Analista',
  email: 'demo@orbitalguardian.com',
}

export const initialRegions = []

export const initialAlerts = [
  {
    id: 'ALT-1001',
    title: 'Fumaca provavel detectada',
    regionId: 'serra-norte',
    priority: 'critico',
    status: 'em_analise',
    origin: 'visual',
    confidence: 87,
    shortDescription: 'Padrao visual compativel com pluma de fumaca em area de mata.',
    fullDescription: 'A analise visual identificou uma formacao compativel com fumaca proxima ao limite leste da Serra Norte. A elevacao de temperatura e a baixa umidade sustentam o risco operacional.',
    recommendation: 'Despachar equipe para confirmacao em campo e ampliar observacao por camera.',
    timestamp: '2026-05-27T11:42:00-03:00',
    updateHistory: [
      { time: '2026-05-27 11:42', text: 'Alerta gerado pelo modulo de analise visual.' },
      { time: '2026-05-27 11:46', text: 'Operador iniciou avaliacao manual das imagens.' },
    ],
  },
  {
    id: 'ALT-1002',
    title: 'Temperatura extrema',
    regionId: 'vale-verde',
    priority: 'alto',
    status: 'novo',
    origin: 'sensor',
    confidence: null,
    shortDescription: 'Sensor ambiental registrou pico de temperatura acima da faixa segura.',
    fullDescription: 'A leitura de temperatura em Vale Verde ultrapassou o limite operacional esperado para a janela atual, com vento sustentado que pode acelerar propagacao de focos.',
    recommendation: 'Ampliar vigilancia terrestre e revisar evolucao termica da regiao.',
    timestamp: '2026-05-27T10:58:00-03:00',
    updateHistory: [
      { time: '2026-05-27 10:58', text: 'Alerta criado a partir de sensor ambiental.' },
    ],
  },
  {
    id: 'ALT-1003',
    title: 'Baixa umidade critica',
    regionId: 'comunidade-solar',
    priority: 'medio',
    status: 'monitorando',
    origin: 'sensor',
    confidence: null,
    shortDescription: 'Indice de umidade abaixo da faixa ideal para a regiao habitacional.',
    fullDescription: 'A Comunidade Solar apresentou queda persistente de umidade associada a ventilacao moderada. O quadro exige observacao e validacao do sensor instavel.',
    recommendation: 'Verificar sensor local e reforcar orientacao preventiva para a equipe de campo.',
    timestamp: '2026-05-27T09:34:00-03:00',
    updateHistory: [
      { time: '2026-05-27 09:34', text: 'Sensor de umidade entrou em faixa de atencao.' },
      { time: '2026-05-27 09:50', text: 'Ocorrencia mantida em monitoramento.' },
    ],
  },
]

export const initialSensors = [
  {
    id: 'SEN-001',
    name: 'Sensor de Temperatura',
    type: 'Temperatura',
    regionId: 'serra-norte',
    value: 39,
    displayValue: '39 C',
    unit: 'C',
    status: 'online',
    lastReading: '2026-05-27T11:40:00-03:00',
    battery: 91,
    critical: true,
  },
  {
    id: 'SEN-002',
    name: 'Sensor de Umidade',
    type: 'Umidade',
    regionId: 'serra-norte',
    value: 18,
    displayValue: '18%',
    unit: '%',
    status: 'online',
    lastReading: '2026-05-27T11:40:00-03:00',
    battery: 88,
    critical: true,
  },
  {
    id: 'SEN-003',
    name: 'Sensor de Vento',
    type: 'Vento',
    regionId: 'vale-verde',
    value: 24,
    displayValue: '24 km/h',
    unit: 'km/h',
    status: 'online',
    lastReading: '2026-05-27T11:31:00-03:00',
    battery: 83,
    critical: false,
  },
  {
    id: 'SEN-004',
    name: 'Sensor de Fumaca',
    type: 'Fumaca',
    regionId: 'serra-norte',
    value: 84,
    displayValue: 'Nivel Elevado',
    unit: 'indice',
    status: 'online',
    lastReading: '2026-05-27T11:43:00-03:00',
    battery: 76,
    critical: true,
  },
  {
    id: 'SEN-005',
    name: 'Sensor de Temperatura',
    type: 'Temperatura',
    regionId: 'reserva-horizonte',
    value: 27,
    displayValue: '27 C',
    unit: 'C',
    status: 'online',
    lastReading: '2026-05-27T11:18:00-03:00',
    battery: 95,
    critical: false,
  },
  {
    id: 'SEN-006',
    name: 'Sensor de Umidade',
    type: 'Umidade',
    regionId: 'comunidade-solar',
    value: 31,
    displayValue: '31%',
    unit: '%',
    status: 'instavel',
    lastReading: '2026-05-27T11:15:00-03:00',
    battery: 44,
    critical: false,
  },
]

export const visualAnalysisPresets = [
  {
    id: 'analysis-safe',
    result: 'Sem risco visual',
    confidence: 72,
    risk: 'baixo',
    regionId: 'reserva-horizonte',
    alertId: null,
    explanation: 'Nao foram encontrados sinais visuais relevantes na amostra atual.',
  },
  {
    id: 'analysis-smoke',
    result: 'Fumaca provavel detectada',
    confidence: 87,
    risk: 'alto',
    regionId: 'serra-norte',
    alertId: 'ALT-1001',
    explanation: 'A formacao visual indica padrao consistente com fumaca em deslocamento.',
  },
  {
    id: 'analysis-fire',
    result: 'Fogo provavel detectado',
    confidence: 91,
    risk: 'critico',
    regionId: 'serra-norte',
    alertId: 'ALT-1001',
    explanation: 'A amostra apresenta pontos de calor e contraste compativeis com fogo ativo.',
  },
]

export const initialHistory = [
  {
    id: 'HIS-001',
    timestamp: '2026-05-26T18:20:00-03:00',
    regionId: 'serra-norte',
    alertType: 'Fumaca detectada',
    priority: 'critico',
    finalStatus: 'Resolvido',
    resolutionTime: '2h15min',
    team: 'Equipe Delta',
  },
  {
    id: 'HIS-002',
    timestamp: '2026-05-25T16:05:00-03:00',
    regionId: 'vale-verde',
    alertType: 'Temperatura extrema',
    priority: 'alto',
    finalStatus: 'Resolvido',
    resolutionTime: '1h40min',
    team: 'Equipe Bravo',
  },
  {
    id: 'HIS-003',
    timestamp: '2026-05-25T09:50:00-03:00',
    regionId: 'comunidade-solar',
    alertType: 'Sensor instavel',
    priority: 'medio',
    finalStatus: 'Resolvido',
    resolutionTime: '35min',
    team: 'Equipe Aurora',
  },
]

export const initialRecommendations = [
  {
    id: 'REC-001',
    title: 'Priorizar analise da Serra Norte',
    description: 'Concentrar validacao operacional na Serra Norte devido ao risco critico atual.',
    priority: 'critico',
    regionId: 'serra-norte',
    type: 'operacional',
    completed: false,
  },
  {
    id: 'REC-002',
    title: 'Verificar sensor de umidade da Comunidade Solar',
    description: 'Sensor instavel exige confirmacao de leitura e inspeção de campo.',
    priority: 'alto',
    regionId: 'comunidade-solar',
    type: 'tecnica',
    completed: false,
  },
  {
    id: 'REC-003',
    title: 'Acionar equipe preventiva',
    description: 'Manter equipe preventiva preparada para areas com baixa umidade persistente.',
    priority: 'alto',
    regionId: 'vale-verde',
    type: 'preventiva',
    completed: false,
  },
  {
    id: 'REC-004',
    title: 'Monitorar regioes acima de 35 C',
    description: 'Dar prioridade para regioes com picos termicos acima da faixa segura.',
    priority: 'medio',
    regionId: null,
    type: 'operacional',
    completed: false,
  },
  {
    id: 'REC-005',
    title: 'Revisar alertas com confianca visual acima de 85%',
    description: 'Alertas visuais de alta confianca devem ser mantidos em fila prioritaria.',
    priority: 'medio',
    regionId: null,
    type: 'seguranca',
    completed: false,
  },
  {
    id: 'REC-006',
    title: 'Manter backup dos logs criticos',
    description: 'Registrar e preservar trilha operacional das ocorrencias de maior risco.',
    priority: 'baixo',
    regionId: null,
    type: 'tecnica',
    completed: true,
  },
]
