import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  initialAlerts,
  initialHistory,
  initialRecommendations,
  initialRegions,
  initialSensors,
  riskOrder,
  visualAnalysisPresets,
} from '../data/orbitalData'
import { getAddressByCep } from '../services/cepService'
import { getCoordinatesForBrazilianAddress } from '../services/geocodingService'
import { getCemadenOfficialRiskForRegion, getCemadenSnapshot } from '../services/cemadenService'
import { getInpeOfficialRiskForRegion, getLatestInpeFocusDataset } from '../services/inpeService'
import { getCurrentWeather } from '../services/weatherService'

const AppDataContext = createContext(null)
const REGIONS_STORAGE_KEY = 'orbital_guardian_regions'

const SENSOR_RANGES = {
  Temperatura: { min: 24, max: 42 },
  Umidade: { min: 16, max: 52 },
  Vento: { min: 6, max: 30 },
  Fumaca: { min: 30, max: 96 },
}

const SENSOR_DEFINITIONS = [
  { type: 'Temperatura', unit: 'C', label: 'Temperatura', metricKey: 'temperature' },
  { type: 'Umidade', unit: '%', label: 'Umidade', metricKey: 'humidity' },
  { type: 'Vento', unit: 'km/h', label: 'Vento', metricKey: 'wind' },
]

const REGION_DEFAULTS = {
  type: 'Area monitorada',
  description: '',
  risk: 'baixo',
  temperature: 0,
  apparentTemperature: 0,
  humidity: 0,
  wind: 0,
  windDirection: 0,
  windGusts: 0,
  precipitation: 0,
  rain: 0,
  showers: 0,
  weatherCode: 0,
  cloudCover: 0,
  surfacePressure: 0,
  seaLevelPressure: 0,
  visibility: 0,
  vapourPressureDeficit: 0,
  precipitationProbability: 0,
  soilMoisture0To1cm: 0,
  soilMoisture1To3cm: 0,
  soilMoisture3To9cm: 0,
  soilMoisture9To27cm: 0,
  soilMoisture27To81cm: 0,
  dailyTemperatureMax: 0,
  dailyTemperatureMin: 0,
  dailyPrecipitationSum: 0,
  dailyRainSum: 0,
  dailyShowersSum: 0,
  dailyPrecipitationProbabilityMax: 0,
  dailyWindGustsMax: 0,
  dailyWindDirectionDominant: 0,
  dailyUvIndexMax: 0,
  dataSource: 'mock',
  operationalStatus: 'Aguardando sincronizacao',
  lastAlert: 'Nenhum alerta ativo',
  actionRecommendation: 'Sincronizar clima real para iniciar o monitoramento.',
  officialRisk: null,
}

const SIMULATION_SCENARIOS = [
  {
    id: 'heat-extreme',
    title: 'Calor extremo',
    description: 'Eleva a temperatura e a sensacao termica para um quadro de calor intenso.',
    expectedRisk: 'alto',
    overrides: {
      temperature: 38,
      apparentTemperature: 42,
      weatherCode: 0,
      cloudCover: 12,
      dailyTemperatureMax: 40,
      dailyUvIndexMax: 9,
    },
  },
  {
    id: 'low-humidity',
    title: 'Baixa umidade',
    description: 'Reduz a umidade do ar e do solo para um quadro de ressecamento.',
    expectedRisk: 'alto',
    overrides: {
      humidity: 18,
      precipitationProbability: 8,
      soilMoisture0To1cm: 0.09,
      soilMoisture1To3cm: 0.11,
      soilMoisture3To9cm: 0.14,
      dailyRainSum: 0,
      dailyPrecipitationSum: 0,
    },
  },
  {
    id: 'strong-wind',
    title: 'Vento forte',
    description: 'Acelera o vento sustentado e as rajadas para simular espalhamento.',
    expectedRisk: 'alto',
    overrides: {
      wind: 29,
      windGusts: 52,
      windDirection: 135,
      dailyWindGustsMax: 58,
      dailyWindDirectionDominant: 135,
    },
  },
  {
    id: 'low-visibility',
    title: 'Visibilidade critica',
    description: 'Reduz a visibilidade para um cenario de observacao comprometida.',
    expectedRisk: 'medio',
    overrides: {
      visibility: 850,
      weatherCode: 45,
      cloudCover: 84,
    },
  },
  {
    id: 'drought',
    title: 'Estiagem',
    description: 'Remove chuva e reduz umidade do solo para um periodo seco prolongado.',
    expectedRisk: 'medio',
    overrides: {
      precipitation: 0,
      rain: 0,
      showers: 0,
      precipitationProbability: 6,
      dailyPrecipitationSum: 0,
      dailyRainSum: 0,
      dailyShowersSum: 0,
      dailyPrecipitationProbabilityMax: 8,
      soilMoisture0To1cm: 0.08,
      soilMoisture1To3cm: 0.1,
      soilMoisture3To9cm: 0.12,
      soilMoisture9To27cm: 0.16,
      soilMoisture27To81cm: 0.19,
    },
  },
  {
    id: 'critical-complete',
    title: 'Risco critico completo',
    description: 'Combina calor, secura, vento e baixa visibilidade num quadro operacional maximo.',
    expectedRisk: 'critico',
    overrides: {
      temperature: 37,
      apparentTemperature: 41,
      humidity: 20,
      wind: 28,
      windGusts: 55,
      windDirection: 118,
      precipitation: 0,
      rain: 0,
      showers: 0,
      precipitationProbability: 4,
      visibility: 1200,
      weatherCode: 45,
      cloudCover: 58,
      soilMoisture0To1cm: 0.08,
      soilMoisture1To3cm: 0.1,
      soilMoisture3To9cm: 0.12,
      dailyTemperatureMax: 39,
      dailyRainSum: 0,
      dailyPrecipitationSum: 0,
      dailyPrecipitationProbabilityMax: 5,
      dailyWindGustsMax: 60,
    },
  },
  {
    id: 'inpe-focus',
    title: 'Foco oficial INPE',
    description: 'Simula foco ativo oficial proximo para demonstracao de precedencia oficial.',
    expectedRisk: 'critico',
    overrides: {
      officialRisk: {
        combinedRisk: 'critico',
        inpe: {
          status: 'ok',
          risk: 'critico',
          nearbyFocusCount: 4,
          nearestDistanceKm: 3.2,
          summary: 'Cenario de demonstracao: focos oficiais proximos reportados pelo INPE.',
        },
        cemaden: {
          status: 'ok',
          risk: 'alto',
          criteriaMatched: true,
          summary: 'Cenario de demonstracao com criterio oficial favoravel a propagacao.',
          granularity: 'nacional',
        },
      },
    },
  },
]

function getNowIso() {
  return new Date().toISOString()
}

function formatHistoryTime(value) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPriorityIndex(priority) {
  return riskOrder.indexOf(priority)
}

function getHigherRisk(firstRisk, secondRisk) {
  return getPriorityIndex(firstRisk) <= getPriorityIndex(secondRisk) ? firstRisk : secondRisk
}

function calculateClimateRisk({ temperature, humidity, wind }) {
  if (temperature >= 35 && humidity <= 25 && wind >= 20) return 'critico'
  if (temperature >= 32 && humidity <= 35) return 'alto'
  if (temperature >= 28 && humidity <= 45) return 'medio'
  return 'baixo'
}

function getDataSourceLabel(source) {
  if (source === 'api') return 'Open-Meteo'
  if (source === 'simulated') return 'Simulacao controlada'
  return 'Dados simulados'
}

function buildRegionOperationalStatus(risk, isSimulated = false) {
  if (isSimulated) return 'Modo demonstracao ativo'
  if (risk === 'critico') return 'Intervencao imediata'
  if (risk === 'alto') return 'Monitoramento reforcado'
  if (risk === 'medio') return 'Observacao ativa'
  return 'Rotina normal'
}

function buildRegionName(address) {
  const primary = address.bairro || address.logradouro || address.city
  return `${primary}, ${address.city} - ${address.state}`
}

function buildRegionDescription(address) {
  const pieces = [address.logradouro, address.bairro, `${address.city}/${address.state}`].filter(Boolean)
  return `Regiao cadastrada por CEP a partir de ${pieces.join(', ')}.`
}

function buildDefaultOfficialRisk(region, status = 'indisponivel') {
  return {
    regionId: region.id,
    city: region.city,
    state: region.state,
    combinedRisk: 'baixo',
    lastOfficialSync: null,
    sourceStatus: {
      inpe: status,
      cemaden: status,
    },
    inpe: {
      status,
      risk: 'baixo',
      summary: 'Dado oficial indisponivel',
      nearbyFocusCount: 0,
      nearestDistanceKm: null,
    },
    cemaden: {
      status,
      risk: 'baixo',
      summary: 'Dado oficial indisponivel',
      criteriaMatched: false,
      granularity: 'nacional',
    },
  }
}

function normalizeStoredRegion(region) {
  const normalized = {
    ...REGION_DEFAULTS,
    ...region,
  }

  const officialRisk = normalized.officialRisk ?? buildDefaultOfficialRisk(normalized)

  return {
    ...normalized,
    apparentTemperature: normalized.apparentTemperature || normalized.temperature || 0,
    windDirection: normalized.windDirection || 0,
    seaLevelPressure: normalized.seaLevelPressure || 0,
    precipitationProbability: normalized.precipitationProbability || 0,
    soilMoisture0To1cm: normalized.soilMoisture0To1cm || 0,
    soilMoisture1To3cm: normalized.soilMoisture1To3cm || 0,
    soilMoisture3To9cm: normalized.soilMoisture3To9cm || 0,
    soilMoisture9To27cm: normalized.soilMoisture9To27cm || 0,
    soilMoisture27To81cm: normalized.soilMoisture27To81cm || 0,
    dailyTemperatureMax: normalized.dailyTemperatureMax || normalized.temperature || 0,
    dailyTemperatureMin: normalized.dailyTemperatureMin || normalized.temperature || 0,
    dailyPrecipitationSum: normalized.dailyPrecipitationSum || normalized.precipitation || 0,
    dailyRainSum: normalized.dailyRainSum || normalized.rain || 0,
    dailyShowersSum: normalized.dailyShowersSum || normalized.showers || 0,
    dailyPrecipitationProbabilityMax: normalized.dailyPrecipitationProbabilityMax || normalized.precipitationProbability || 0,
    dailyWindGustsMax: normalized.dailyWindGustsMax || normalized.windGusts || 0,
    dailyWindDirectionDominant: normalized.dailyWindDirectionDominant || normalized.windDirection || 0,
    dailyUvIndexMax: normalized.dailyUvIndexMax || 0,
    officialRisk: {
      ...buildDefaultOfficialRisk(normalized),
      ...officialRisk,
      inpe: {
        ...buildDefaultOfficialRisk(normalized).inpe,
        ...(officialRisk.inpe ?? {}),
      },
      cemaden: {
        ...buildDefaultOfficialRisk(normalized).cemaden,
        ...(officialRisk.cemaden ?? {}),
      },
    },
  }
}

function loadRegionsFromStorage() {
  try {
    const raw = localStorage.getItem(REGIONS_STORAGE_KEY)
    if (!raw) return initialRegions
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(normalizeStoredRegion) : initialRegions
  } catch {
    return initialRegions
  }
}

function formatSensorDisplay(type, value) {
  if (type === 'Temperatura') return `${value} C`
  if (type === 'Umidade') return `${value}%`
  if (type === 'Vento') return `${value} km/h`
  if (type === 'Fumaca') {
    if (value >= 80) return 'Nivel Elevado'
    if (value >= 55) return 'Nivel Moderado'
    return 'Nivel Baixo'
  }
  return String(value)
}

function isCriticalSensor(type, value) {
  if (type === 'Temperatura') return value >= 38
  if (type === 'Umidade') return value <= 20
  if (type === 'Vento') return value >= 25
  if (type === 'Fumaca') return value >= 80
  return false
}

function createRegionFromLookup(address, coordinates) {
  return {
    id: `region-${address.cep.replace(/\D/g, '')}`,
    name: buildRegionName(address),
    cep: address.cep,
    logradouro: address.logradouro,
    bairro: address.bairro,
    city: address.city,
    state: address.state,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    timezone: coordinates.timezone,
    ...REGION_DEFAULTS,
    description: buildRegionDescription(address),
    createdAt: getNowIso(),
  }
}

function mapWeatherToRegionMetrics(weather) {
  const temperature = Math.round(weather.temperature ?? 0)
  const apparentTemperature = Math.round(weather.apparentTemperature ?? weather.temperature ?? 0)
  const humidity = Math.round(weather.humidity ?? 0)
  const wind = Math.round(weather.wind ?? 0)
  const windDirection = Math.round(weather.windDirection ?? 0)
  const windGusts = Math.round(weather.gusts ?? 0)
  const precipitation = Number(weather.precipitation ?? 0)
  const rain = Number(weather.rain ?? 0)
  const showers = Number(weather.showers ?? 0)
  const weatherCode = Number(weather.weatherCode ?? 0)
  const cloudCover = Math.round(weather.cloudCover ?? 0)
  const surfacePressure = Math.round(weather.surfacePressure ?? 0)
  const seaLevelPressure = Math.round(weather.seaLevelPressure ?? 0)
  const visibility = Math.round(weather.visibility ?? 0)
  const vapourPressureDeficit = Number(weather.vapourPressureDeficit ?? 0)
  const precipitationProbability = Math.round(weather.precipitationProbability ?? 0)
  const soilMoisture0To1cm = Number(weather.soilMoisture0To1cm ?? 0)
  const soilMoisture1To3cm = Number(weather.soilMoisture1To3cm ?? 0)
  const soilMoisture3To9cm = Number(weather.soilMoisture3To9cm ?? 0)
  const soilMoisture9To27cm = Number(weather.soilMoisture9To27cm ?? 0)
  const soilMoisture27To81cm = Number(weather.soilMoisture27To81cm ?? 0)
  const dailyTemperatureMax = Math.round(weather.dailyTemperatureMax ?? temperature)
  const dailyTemperatureMin = Math.round(weather.dailyTemperatureMin ?? temperature)
  const dailyPrecipitationSum = Number(weather.dailyPrecipitationSum ?? precipitation)
  const dailyRainSum = Number(weather.dailyRainSum ?? rain)
  const dailyShowersSum = Number(weather.dailyShowersSum ?? showers)
  const dailyPrecipitationProbabilityMax = Math.round(weather.dailyPrecipitationProbabilityMax ?? precipitationProbability)
  const dailyWindGustsMax = Math.round(weather.dailyWindGustsMax ?? windGusts)
  const dailyWindDirectionDominant = Math.round(weather.dailyWindDirectionDominant ?? windDirection)
  const dailyUvIndexMax = Number(weather.dailyUvIndexMax ?? 0)

  return {
    temperature,
    apparentTemperature,
    humidity,
    wind,
    windDirection,
    windGusts,
    precipitation,
    rain,
    showers,
    weatherCode,
    cloudCover,
    surfacePressure,
    seaLevelPressure,
    visibility,
    vapourPressureDeficit,
    precipitationProbability,
    soilMoisture0To1cm,
    soilMoisture1To3cm,
    soilMoisture3To9cm,
    soilMoisture9To27cm,
    soilMoisture27To81cm,
    dailyTemperatureMax,
    dailyTemperatureMin,
    dailyPrecipitationSum,
    dailyRainSum,
    dailyShowersSum,
    dailyPrecipitationProbabilityMax,
    dailyWindGustsMax,
    dailyWindDirectionDominant,
    dailyUvIndexMax,
  }
}

async function buildOfficialRiskMap(nextRegions, sourceTime) {
  let inpeDataset = null
  let cemadenSnapshot = null
  let inpeStatus = 'ok'
  let cemadenStatus = 'ok'

  try {
    inpeDataset = await getLatestInpeFocusDataset()
  } catch {
    inpeStatus = 'erro'
  }

  try {
    cemadenSnapshot = await getCemadenSnapshot()
  } catch {
    cemadenStatus = 'erro'
  }

  return Object.fromEntries(
    nextRegions.map(region => {
      const officialRisk = buildDefaultOfficialRisk(region, 'indisponivel')
      const inpe = inpeDataset
        ? getInpeOfficialRiskForRegion(region, inpeDataset)
        : {
            ...officialRisk.inpe,
            status: inpeStatus,
            summary: 'Nao foi possivel consultar o INPE agora.',
          }

      const cemaden = cemadenSnapshot
        ? getCemadenOfficialRiskForRegion(region, cemadenSnapshot)
        : {
            ...officialRisk.cemaden,
            status: cemadenStatus,
            summary: 'Nao foi possivel consultar o CEMADEN agora.',
          }

      const combinedRisk = getHigherRisk(inpe.risk, cemaden.risk)

      return [
        region.id,
        {
          regionId: region.id,
          city: region.city,
          state: region.state,
          combinedRisk,
          lastOfficialSync: sourceTime,
          sourceStatus: {
            inpe: inpe.status,
            cemaden: cemaden.status,
          },
          inpe,
          cemaden,
        },
      ]
    }),
  )
}

function buildSimulationOfficialRisk(region, scenario, timestamp) {
  const base = region.officialRisk ?? buildDefaultOfficialRisk(region)
  if (!scenario.overrides.officialRisk) {
    return {
      ...base,
      lastOfficialSync: timestamp,
    }
  }

  const override = scenario.overrides.officialRisk
  return {
    ...base,
    ...override,
    lastOfficialSync: timestamp,
    sourceStatus: {
      inpe: override.inpe ? 'ok' : base.sourceStatus?.inpe ?? 'indisponivel',
      cemaden: override.cemaden ? 'ok' : base.sourceStatus?.cemaden ?? 'indisponivel',
    },
    inpe: {
      ...base.inpe,
      ...(override.inpe ?? {}),
    },
    cemaden: {
      ...base.cemaden,
      ...(override.cemaden ?? {}),
    },
  }
}

function applySimulationToRegion(region, simulation) {
  if (!simulation) {
    const climateRisk = calculateClimateRisk(region)
    const officialRisk = region.officialRisk ?? buildDefaultOfficialRisk(region)
    return {
      ...region,
      climateRisk,
      effectiveSource: region.dataSource,
      isSimulated: false,
      simulation: null,
      sourceLabel: getDataSourceLabel(region.dataSource),
      operationalStatus: buildRegionOperationalStatus(climateRisk, false),
      risk: getHigherRisk(climateRisk, officialRisk.combinedRisk ?? 'baixo'),
      officialRisk,
    }
  }

  const merged = {
    ...region,
    ...simulation.overrides,
    dataSource: 'simulated',
  }
  const officialRisk = buildSimulationOfficialRisk(region, simulation, simulation.activatedAt)
  const climateRisk = calculateClimateRisk(merged)

  return {
    ...merged,
    climateRisk,
    officialRisk,
    effectiveSource: 'simulated',
    isSimulated: true,
    simulation,
    sourceLabel: 'Simulacao controlada',
    operationalStatus: buildRegionOperationalStatus(climateRisk, true),
    risk: getHigherRisk(climateRisk, officialRisk.combinedRisk ?? 'baixo'),
  }
}

function buildEffectiveRegions(baseRegions, simulationByRegion) {
  return baseRegions.map(region => applySimulationToRegion(region, simulationByRegion[region.id]))
}

function buildAlertSpec(region, config) {
  return {
    id: `AUTO-${region.id}-${config.ruleId}`,
    title: config.title,
    regionId: region.id,
    priority: config.priority,
    origin: config.origin,
    confidence: config.confidence ?? null,
    shortDescription: config.shortDescription,
    fullDescription: config.fullDescription,
    recommendation: config.recommendation,
    triggerType: config.ruleId,
    triggerValues: config.triggerValues,
    sourceEvidence: config.sourceEvidence ?? null,
    automatic: true,
    official: config.official ?? false,
    sourceType: config.sourceType ?? 'meteorologico',
    sourceSummary: config.sourceSummary ?? null,
  }
}

function buildAutomaticAlertSpecs(region) {
  const specs = []
  const alertOrigin = region.isSimulated ? 'simulated' : 'open_meteo'
  const officialRisk = region.officialRisk ?? buildDefaultOfficialRisk(region)

  if (region.temperature >= 35 && region.humidity <= 25 && region.wind >= 20) {
    specs.push(
      buildAlertSpec(region, {
        ruleId: 'propagacao-critica',
        priority: 'critico',
        origin: alertOrigin,
        title: 'Propagacao critica por calor, secura e vento',
        shortDescription: 'Temperatura alta, umidade muito baixa e vento forte elevam o risco de propagacao.',
        fullDescription: 'A combinacao de temperatura elevada, umidade reduzida e vento sustentado cria um cenario critico para propagacao rapida de focos e exige resposta imediata.',
        recommendation: 'Priorizar equipes de campo, reforcar observacao e preparar resposta imediata na regiao.',
        triggerValues: {
          temperature: region.temperature,
          humidity: region.humidity,
          wind: region.wind,
        },
        sourceSummary: region.isSimulated ? 'Cenario de demonstracao aplicado sobre a regiao.' : 'Regra meteorologica baseada em clima real sincronizado.',
      }),
    )
  }

  if (region.temperature >= 32 && region.humidity <= 35) {
    specs.push(
      buildAlertSpec(region, {
        ruleId: 'ressecamento-termico',
        priority: 'alto',
        origin: alertOrigin,
        title: 'Ressecamento termico persistente',
        shortDescription: 'Calor elevado e baixa umidade favorecem secura ambiental na regiao.',
        fullDescription: 'O quadro termico atual indica ressecamento persistente com potencial de degradacao rapida do ambiente, exigindo monitoramento reforcado.',
        recommendation: 'Reforcar vigilancia terrestre e revisar a evolucao termica e hidrica da regiao.',
        triggerValues: {
          temperature: region.temperature,
          humidity: region.humidity,
        },
        sourceSummary: region.isSimulated ? 'Cenario de demonstracao aplicado sobre a regiao.' : 'Regra meteorologica baseada em clima real sincronizado.',
      }),
    )
  }

  if (region.wind >= 25 || region.windGusts >= 40) {
    specs.push(
      buildAlertSpec(region, {
        ruleId: 'vento-espalhamento',
        priority: region.windGusts >= 50 ? 'alto' : 'medio',
        origin: alertOrigin,
        title: 'Vento favorece espalhamento',
        shortDescription: 'Vento sustentado ou rajadas elevadas podem acelerar o deslocamento de fumaca e focos.',
        fullDescription: 'A intensidade atual do vento e das rajadas indica condicao operacional de espalhamento, com impacto sobre visibilidade, deslocamento de fumaca e controle de campo.',
        recommendation: 'Avaliar direcao do vento, revisar rotas de equipe e ampliar observacao da borda da regiao.',
        triggerValues: {
          wind: region.wind,
          windGusts: region.windGusts,
          windDirection: region.windDirection,
        },
        sourceSummary: region.isSimulated ? 'Cenario de demonstracao aplicado sobre a regiao.' : 'Regra meteorologica baseada em clima real sincronizado.',
      }),
    )
  }

  if (region.visibility > 0 && region.visibility <= 2000) {
    specs.push(
      buildAlertSpec(region, {
        ruleId: 'visibilidade-reduzida',
        priority: region.visibility <= 1000 ? 'alto' : 'medio',
        origin: alertOrigin,
        title: 'Visibilidade operacional reduzida',
        shortDescription: 'A visibilidade caiu para faixa que compromete observacao e deslocamento seguro.',
        fullDescription: 'A reducao da visibilidade pode estar associada a fumaca, nevoa ou condicoes atmosfericas adversas, comprometendo monitoramento visual e deslocamento operacional.',
        recommendation: 'Checar apoio visual alternativo e revisar deslocamento de campo com foco em seguranca.',
        triggerValues: {
          visibility: region.visibility,
          weatherCode: region.weatherCode,
        },
        sourceSummary: region.isSimulated ? 'Cenario de demonstracao aplicado sobre a regiao.' : 'Regra meteorologica baseada em clima real sincronizado.',
      }),
    )
  }

  if (region.soilMoisture0To1cm <= 0.12 || region.soilMoisture1To3cm <= 0.14) {
    specs.push(
      buildAlertSpec(region, {
        ruleId: 'solo-seco',
        priority: 'medio',
        origin: alertOrigin,
        title: 'Solo superficial com baixa umidade',
        shortDescription: 'A camada superficial do solo apresenta secura relevante para o risco ambiental.',
        fullDescription: 'A umidade das camadas superficiais do solo se encontra em faixa seca, aumentando a suscetibilidade ambiental e reforcando a necessidade de observacao preventiva.',
        recommendation: 'Priorizar acompanhamento preventivo e revisar tendencia de chuva e secura do terreno.',
        triggerValues: {
          soilMoisture0To1cm: region.soilMoisture0To1cm,
          soilMoisture1To3cm: region.soilMoisture1To3cm,
        },
        sourceSummary: region.isSimulated ? 'Cenario de demonstracao aplicado sobre a regiao.' : 'Regra meteorologica baseada em clima real sincronizado.',
      }),
    )
  }

  if (region.rain === 0 && region.dailyRainSum === 0 && region.precipitationProbability <= 20) {
    specs.push(
      buildAlertSpec(region, {
        ruleId: 'estiagem-persistente',
        priority: 'medio',
        origin: alertOrigin,
        title: 'Persistencia de estiagem operacional',
        shortDescription: 'Ausencia de chuva e baixa probabilidade de precipitacao mantem o cenario seco.',
        fullDescription: 'A ausencia de chuva combinada com baixa probabilidade de precipitacao prolonga o periodo de estiagem, o que sustenta a secura operacional da regiao.',
        recommendation: 'Manter vigilancia preventiva e revisar a necessidade de ampliar observacao em periodos de calor.',
        triggerValues: {
          rain: region.rain,
          dailyRainSum: region.dailyRainSum,
          precipitationProbability: region.precipitationProbability,
        },
        sourceSummary: region.isSimulated ? 'Cenario de demonstracao aplicado sobre a regiao.' : 'Regra meteorologica baseada em clima real sincronizado.',
      }),
    )
  }

  if (officialRisk.cemaden?.status === 'ok' && officialRisk.cemaden.criteriaMatched) {
    const relatedRule = specs.find(item => ['propagacao-critica', 'ressecamento-termico', 'vento-espalhamento'].includes(item.triggerType))
    if (relatedRule) {
      relatedRule.priority = getHigherRisk(relatedRule.priority, officialRisk.cemaden.risk)
      relatedRule.origin = region.isSimulated ? 'simulated' : 'cemaden'
      relatedRule.official = true
      relatedRule.sourceType = 'oficial'
      relatedRule.sourceEvidence = officialRisk.cemaden.summary
      relatedRule.sourceSummary = `Risco meteorologico reforcado pelo criterio oficial do CEMADEN. ${officialRisk.cemaden.summary}`
      relatedRule.recommendation = 'Priorizar resposta preventiva e alinhar a leitura local com o criterio oficial de propagacao.'
    } else {
      specs.push(
        buildAlertSpec(region, {
          ruleId: 'cemaden-propagacao',
          priority: officialRisk.cemaden.risk,
          origin: region.isSimulated ? 'simulated' : 'cemaden',
          title: 'Criterio oficial de propagacao atendido',
          shortDescription: officialRisk.cemaden.summary,
          fullDescription: `A regiao ${region.name} atende ao criterio publicado pelo CEMADEN para propagacao de fogo, considerando calor, baixa umidade e vento.`,
          recommendation: 'Priorizar monitoramento e revisar a resposta com base no criterio oficial de propagacao.',
          triggerValues: {
            temperature: region.temperature,
            humidity: region.humidity,
            wind: region.wind,
          },
          sourceEvidence: officialRisk.cemaden.summary,
          official: true,
          sourceType: 'oficial',
          sourceSummary: region.isSimulated ? 'Cenario de demonstracao com risco oficial simulado.' : 'Criterio oficial do CEMADEN aplicado a partir do clima real.',
        }),
      )
    }
  }

  if (officialRisk.inpe?.status === 'ok' && officialRisk.inpe.nearbyFocusCount > 0) {
    specs.push(
      buildAlertSpec(region, {
        ruleId: 'inpe-focos-proximos',
        priority: officialRisk.inpe.risk,
        origin: region.isSimulated ? 'simulated' : 'inpe',
        title: 'Focos ativos oficiais proximos',
        shortDescription: officialRisk.inpe.summary,
        fullDescription: `O INPE Queimadas identificou focos ativos proximos da regiao ${region.name}, com distancia minima de ${officialRisk.inpe.nearestDistanceKm ?? '--'} km.`,
        recommendation: 'Validar a ocorrencia em campo e priorizar observacao imediata da regiao.',
        triggerValues: {
          nearbyFocusCount: officialRisk.inpe.nearbyFocusCount,
          nearestDistanceKm: officialRisk.inpe.nearestDistanceKm,
        },
        sourceEvidence: officialRisk.inpe.summary,
        official: true,
        sourceType: 'oficial',
        sourceSummary: region.isSimulated ? 'Cenario de demonstracao com foco oficial simulado.' : 'Evidencia oficial do INPE por proximidade de focos ativos.',
      }),
    )
  }

  return specs
}

function buildAutomaticRecommendationSpecs(region, activeAlerts) {
  const regionAlerts = activeAlerts.filter(item => item.regionId === region.id && item.status !== 'resolvido')
  const byTrigger = new Set(regionAlerts.map(item => item.triggerType))
  const recommendations = []

  if (byTrigger.has('propagacao-critica')) {
    recommendations.push({
      id: `AUTO-REC-${region.id}-propagacao`,
      title: `Priorizar resposta imediata em ${region.city}`,
      description: 'Calor, secura e vento forte formam um quadro de propagacao critica. Reforce observacao e prepare resposta imediata.',
      priority: 'critico',
      regionId: region.id,
      type: 'operacional',
      completed: false,
      automatic: true,
      origin: region.isSimulated ? 'simulated' : 'open_meteo',
      reason: 'Calor alto + baixa umidade + vento forte.',
    })
  }

  if (byTrigger.has('inpe-focos-proximos')) {
    recommendations.push({
      id: `AUTO-REC-${region.id}-focos`,
      title: `Confirmar foco oficial proximo em ${region.city}`,
      description: 'Existe foco oficial proximo segundo o INPE. Valide a ocorrencia e aumente a prontidao da equipe.',
      priority: 'critico',
      regionId: region.id,
      type: 'seguranca',
      completed: false,
      automatic: true,
      origin: region.isSimulated ? 'simulated' : 'inpe',
      reason: 'Focos oficiais proximos reportados pelo INPE.',
    })
  }

  if (byTrigger.has('visibilidade-reduzida')) {
    recommendations.push({
      id: `AUTO-REC-${region.id}-visibilidade`,
      title: `Checar visibilidade operacional em ${region.city}`,
      description: 'Revise deslocamento e observacao visual por causa da visibilidade reduzida.',
      priority: 'alto',
      regionId: region.id,
      type: 'seguranca',
      completed: false,
      automatic: true,
      origin: region.isSimulated ? 'simulated' : 'open_meteo',
      reason: 'Visibilidade em faixa critica de observacao.',
    })
  }

  if (byTrigger.has('solo-seco')) {
    recommendations.push({
      id: `AUTO-REC-${region.id}-solo`,
      title: `Monitorar solo seco em ${region.city}`,
      description: 'A camada superficial do solo esta seca e indica aumento de suscetibilidade ambiental.',
      priority: 'alto',
      regionId: region.id,
      type: 'preventiva',
      completed: false,
      automatic: true,
      origin: region.isSimulated ? 'simulated' : 'open_meteo',
      reason: 'Umidade do solo superficial abaixo da faixa segura.',
    })
  }

  if (byTrigger.has('estiagem-persistente')) {
    recommendations.push({
      id: `AUTO-REC-${region.id}-estiagem`,
      title: `Revisar persistencia de estiagem em ${region.city}`,
      description: 'Sem chuva e com baixa probabilidade de precipitacao, a regiao pede observacao preventiva reforcada.',
      priority: 'medio',
      regionId: region.id,
      type: 'operacional',
      completed: false,
      automatic: true,
      origin: region.isSimulated ? 'simulated' : 'open_meteo',
      reason: 'Ausencia de chuva e baixa probabilidade de precipitacao.',
    })
  }

  if (byTrigger.has('vento-espalhamento')) {
    recommendations.push({
      id: `AUTO-REC-${region.id}-vento`,
      title: `Ajustar resposta ao vento em ${region.city}`,
      description: 'Acompanhe a direcao do vento e avalie impacto sobre propagacao, fumaca e rotas de deslocamento.',
      priority: 'alto',
      regionId: region.id,
      type: 'operacional',
      completed: false,
      automatic: true,
      origin: region.isSimulated ? 'simulated' : 'open_meteo',
      reason: 'Vento sustentado ou rajadas elevadas favorecem espalhamento.',
    })
  }

  if (byTrigger.has('cemaden-propagacao') || byTrigger.has('propagacao-critica')) {
    recommendations.push({
      id: `AUTO-REC-${region.id}-cemaden`,
      title: `Alinhar leitura local ao risco oficial em ${region.city}`,
      description: 'O risco meteorologico local converge com criterio oficial. Prepare resposta coerente com a camada oficial.',
      priority: 'alto',
      regionId: region.id,
      type: 'tecnica',
      completed: false,
      automatic: true,
      origin: region.isSimulated ? 'simulated' : 'cemaden',
      reason: 'Criterio oficial de propagacao reforca o quadro local.',
    })
  }

  return recommendations
}

function summarizeRegionLastAlert(activeAlerts) {
  const critical = activeAlerts.find(item => item.priority === 'critico')
  if (critical) return critical.title
  return activeAlerts[0]?.title ?? 'Nenhum alerta ativo'
}

function summarizeRegionAction(activeAlerts) {
  return activeAlerts[0]?.recommendation ?? 'Sincronizacao concluida. Continue acompanhando os indicadores climaticos.'
}

function buildSensorName(region, label) {
  return `${label} - ${region.city}`
}

function upsertClimateSensors(currentSensors, effectiveRegions, sourceTime) {
  const nextById = new Map(currentSensors.map(sensor => [sensor.id, sensor]))

  effectiveRegions.forEach(region => {
    SENSOR_DEFINITIONS.forEach(definition => {
      const id = `AUTO-SEN-${region.id}-${definition.type.toLowerCase()}`
      const value = region[definition.metricKey]
      nextById.set(id, {
        ...(nextById.get(id) ?? {}),
        id,
        name: buildSensorName(region, definition.label),
        type: definition.type,
        regionId: region.id,
        value,
        displayValue: formatSensorDisplay(definition.type, value),
        unit: definition.unit,
        status: 'online',
        lastReading: sourceTime,
        battery: nextById.get(id)?.battery ?? 100,
        critical: isCriticalSensor(definition.type, value),
        readingMode: region.isSimulated ? 'simulated' : 'api',
        readingSource: region.isSimulated ? 'Leitura derivada de simulacao controlada' : 'Leitura real sincronizada',
      })
    })
  })

  return Array.from(nextById.values()).filter(sensor => {
    if (!sensor.id.startsWith('AUTO-SEN-')) return true
    return effectiveRegions.some(region => region.id === sensor.regionId)
  })
}

function buildSyncHistoryEvent(region, timestamp) {
  return {
    id: `EVT-sync-${region.id}-${timestamp}`,
    regionId: region.id,
    eventType: 'sincronizacao',
    priority: region.climateRisk,
    timestamp,
    summary: 'Sincronizacao real concluida',
    details: `Open-Meteo sincronizada para ${region.name} com temperatura ${region.temperature} C, umidade ${region.humidity}% e vento ${region.wind} km/h.`,
    source: 'real',
  }
}

function buildClimateRiskChangeEvent(region, previousRisk, timestamp) {
  return {
    id: `EVT-climate-risk-${region.id}-${timestamp}`,
    regionId: region.id,
    eventType: 'mudanca_risco_meteorologico',
    priority: region.climateRisk,
    timestamp,
    summary: 'Mudanca de risco meteorologico',
    details: `A regiao ${region.name} mudou de risco meteorologico ${previousRisk} para ${region.climateRisk}.`,
    source: 'real',
  }
}

function buildOfficialRiskChangeEvent(region, previousRisk, timestamp) {
  return {
    id: `EVT-official-risk-${region.id}-${timestamp}`,
    regionId: region.id,
    eventType: 'mudanca_risco_oficial',
    priority: region.officialRisk?.combinedRisk ?? 'baixo',
    timestamp,
    summary: 'Mudanca de risco oficial',
    details: `A camada oficial da regiao ${region.name} mudou de ${previousRisk} para ${region.officialRisk?.combinedRisk ?? 'baixo'}.`,
    source: 'official',
  }
}

function buildOfficialSyncEvent(region, timestamp) {
  return {
    id: `EVT-official-${region.id}-${timestamp}`,
    regionId: region.id,
    eventType: 'sincronizacao_oficial',
    priority: region.officialRisk?.combinedRisk ?? region.climateRisk,
    timestamp,
    summary: 'Consulta oficial INPE/CEMADEN concluida',
    details: `Camada oficial atualizada para ${region.name}: INPE ${region.officialRisk?.inpe?.risk ?? 'indisponivel'} | CEMADEN ${region.officialRisk?.cemaden?.risk ?? 'indisponivel'}.`,
    source: 'official',
  }
}

function buildSimulationEvent(region, action, simulation, timestamp) {
  const activated = action === 'activated'
  return {
    id: `EVT-sim-${region.id}-${action}-${timestamp}`,
    regionId: region.id,
    eventType: activated ? 'simulacao_ativada' : 'simulacao_encerrada',
    priority: region.risk,
    timestamp,
    summary: activated ? 'Cenario de demonstracao ativado' : 'Cenario de demonstracao encerrado',
    details: activated
      ? `O cenario "${simulation.title}" foi aplicado sobre ${region.name}.`
      : `A regiao ${region.name} voltou a operar com dados reais apos encerrar o modo demonstracao.`,
    source: 'simulated',
  }
}

function buildAlertLifecycleEvent(alert, eventType, timestamp, previousPriority = null) {
  const summaries = {
    created: 'Alerta automatico criado',
    escalated: 'Alerta automatico agravado',
    resolved: 'Alerta automatico resolvido',
  }

  const detailsByType = {
    created: `O alerta "${alert.title}" foi criado automaticamente a partir de ${alert.origin === 'simulated' ? 'uma simulacao controlada' : 'regras operacionais'}.`,
    escalated: `O alerta "${alert.title}" teve agravamento de prioridade de ${previousPriority} para ${alert.priority}.`,
    resolved: `O alerta "${alert.title}" foi resolvido automaticamente porque o gatilho deixou de existir.`,
  }

  return {
    id: `EVT-alert-${alert.id}-${eventType}-${timestamp}`,
    regionId: alert.regionId,
    eventType: 'alerta_automatico',
    priority: alert.priority,
    timestamp,
    summary: summaries[eventType],
    details: detailsByType[eventType],
    source: alert.official ? 'official' : alert.origin === 'simulated' ? 'simulated' : 'real',
  }
}

function reconcileAutomaticAlerts(previousAlerts, specs, timestamp) {
  const previousMap = new Map(previousAlerts.map(alert => [alert.id, alert]))
  const nextAlerts = []
  const historyEvents = []
  const activeIds = new Set()

  specs.forEach(spec => {
    activeIds.add(spec.id)
    const previous = previousMap.get(spec.id)
    const baseHistory = previous?.updateHistory ?? []
    const nextStatus =
      previous && previous.status !== 'resolvido'
        ? previous.status
        : 'novo'

    const nextAlert = {
      ...previous,
      ...spec,
      status: nextStatus,
      timestamp,
      updateHistory: baseHistory,
    }

    if (!previous) {
      nextAlert.updateHistory = [
        {
          time: formatHistoryTime(timestamp),
          text: spec.origin === 'simulated'
            ? 'Alerta automatico criado a partir de simulacao controlada.'
            : 'Alerta automatico criado a partir das regras operacionais atuais.',
        },
      ]
      historyEvents.push(buildAlertLifecycleEvent(nextAlert, 'created', timestamp))
    } else if (getPriorityIndex(spec.priority) < getPriorityIndex(previous.priority)) {
      nextAlert.updateHistory = [
        { time: formatHistoryTime(timestamp), text: `Prioridade agravada para ${spec.priority}.` },
        ...baseHistory,
      ]
      historyEvents.push(buildAlertLifecycleEvent(nextAlert, 'escalated', timestamp, previous.priority))
    }

    nextAlerts.push(nextAlert)
  })

  previousAlerts.forEach(alert => {
    if (activeIds.has(alert.id)) return
    const resolvedAlert = {
      ...alert,
      status: 'resolvido',
      timestamp,
      updateHistory: [
        {
          time: formatHistoryTime(timestamp),
          text: alert.origin === 'simulated'
            ? 'Cenario de simulacao encerrado ou normalizado. Alerta resolvido automaticamente.'
            : 'Gatilho operacional deixou de estar ativo. Alerta resolvido automaticamente.',
        },
        ...alert.updateHistory,
      ],
    }
    nextAlerts.push(resolvedAlert)
    if (alert.status !== 'resolvido') {
      historyEvents.push(buildAlertLifecycleEvent(resolvedAlert, 'resolved', timestamp))
    }
  })

  return { nextAlerts, historyEvents }
}

function formatWeatherSyncEntry(previousRegion, region, sourceTime) {
  return {
    regionId: region.id,
    regionName: region.name,
    latitude: region.latitude,
    longitude: region.longitude,
    apiTime: sourceTime,
    previous: {
      temperature: previousRegion.temperature,
      humidity: previousRegion.humidity,
      wind: previousRegion.wind,
    },
    current: {
      temperature: region.temperature,
      apparentTemperature: region.apparentTemperature,
      humidity: region.humidity,
      wind: region.wind,
      windDirection: region.windDirection,
      windGusts: region.windGusts,
      precipitation: region.precipitation,
      rain: region.rain,
      showers: region.showers,
      weatherCode: region.weatherCode,
      cloudCover: region.cloudCover,
      surfacePressure: region.surfacePressure,
      seaLevelPressure: region.seaLevelPressure,
      visibility: region.visibility,
      vapourPressureDeficit: region.vapourPressureDeficit,
      precipitationProbability: region.precipitationProbability,
      soilMoisture27To81cm: region.soilMoisture27To81cm,
      dailyRainSum: region.dailyRainSum,
      dailyShowersSum: region.dailyShowersSum,
      dailyPrecipitationProbabilityMax: region.dailyPrecipitationProbabilityMax,
      dailyWindDirectionDominant: region.dailyWindDirectionDominant,
      officialRisk: region.officialRisk?.combinedRisk ?? 'baixo',
    },
  }
}

export function AppDataProvider({ children }) {
  const [regions, setRegions] = useState(() => loadRegionsFromStorage())
  const [alerts, setAlerts] = useState(initialAlerts)
  const [autoAlerts, setAutoAlerts] = useState([])
  const [sensors, setSensors] = useState(initialSensors)
  const [history] = useState(initialHistory)
  const [automationHistory, setAutomationHistory] = useState([])
  const [recommendations, setRecommendations] = useState(initialRecommendations)
  const [recommendationOverrides, setRecommendationOverrides] = useState({})
  const [lastUpdated, setLastUpdated] = useState('2026-05-27T11:50:00-03:00')
  const [analysisIndex, setAnalysisIndex] = useState(1)
  const [weatherSyncHistory, setWeatherSyncHistory] = useState([])
  const [simulationByRegion, setSimulationByRegion] = useState({})

  useEffect(() => {
    localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(regions))
  }, [regions])

  useEffect(() => {
    const effective = buildEffectiveRegions(regions, simulationByRegion)
    const specs = effective.flatMap(region => buildAutomaticAlertSpecs(region))
    const seededAlerts = specs.map(spec => ({
      ...spec,
      status: 'novo',
      timestamp: lastUpdated,
      updateHistory: [
        {
          time: formatHistoryTime(lastUpdated),
          text: spec.origin === 'simulated'
            ? 'Alerta reconstruido a partir de simulacao ativa.'
            : 'Alerta reconstruido a partir do estado operacional atual.',
        },
      ],
    }))

    setAutoAlerts(current => (current.length ? current : seededAlerts))
    setSensors(current => upsertClimateSensors(current, effective, lastUpdated))
  }, [])

  const applyOperationalState = (baseRegions, nextSimulations, timestamp, extraEvents = []) => {
    const effectiveRegions = buildEffectiveRegions(baseRegions, nextSimulations)
    const specs = effectiveRegions.flatMap(region => buildAutomaticAlertSpecs(region))
    const { nextAlerts, historyEvents } = reconcileAutomaticAlerts(autoAlerts, specs, timestamp)

    setAutoAlerts(nextAlerts)
    setAutomationHistory(current => [...extraEvents, ...historyEvents, ...current].slice(0, 160))
    setSensors(current => upsertClimateSensors(current, effectiveRegions, timestamp))
  }

  const syncDerivedState = async (previousRegions, nextRegions, sourceTime) => {
    const officialRiskMap = await buildOfficialRiskMap(nextRegions, sourceTime)
    const regionsWithOfficial = nextRegions.map(region => {
      const climateRisk = calculateClimateRisk(region)
      return normalizeStoredRegion({
        ...region,
        risk: climateRisk,
        officialRisk: officialRiskMap[region.id] ?? buildDefaultOfficialRisk(region, 'erro'),
      })
    })

    const nextHistoryEvents = []
    regionsWithOfficial.forEach(region => {
      const previousRegion = previousRegions.find(item => item.id === region.id)
      const previousClimateRisk = previousRegion ? calculateClimateRisk(previousRegion) : 'baixo'
      const previousOfficialRisk = previousRegion?.officialRisk?.combinedRisk ?? 'baixo'
      const currentClimateRisk = calculateClimateRisk(region)

      nextHistoryEvents.push(buildSyncHistoryEvent({ ...region, climateRisk: currentClimateRisk }, sourceTime))
      nextHistoryEvents.push(buildOfficialSyncEvent(region, sourceTime))

      if (previousRegion && previousClimateRisk !== currentClimateRisk) {
        nextHistoryEvents.push(buildClimateRiskChangeEvent({ ...region, climateRisk: currentClimateRisk }, previousClimateRisk, sourceTime))
      }

      if (previousRegion && previousOfficialRisk !== (region.officialRisk?.combinedRisk ?? 'baixo')) {
        nextHistoryEvents.push(buildOfficialRiskChangeEvent(region, previousOfficialRisk, sourceTime))
      }
    })

    applyOperationalState(regionsWithOfficial, simulationByRegion, sourceTime, nextHistoryEvents)

    setWeatherSyncHistory(current => [
      {
        id: `sync-${sourceTime}`,
        syncedAt: sourceTime,
        source: 'Open-Meteo',
        entries: regionsWithOfficial.map(region => {
          const previousRegion = previousRegions.find(item => item.id === region.id) ?? REGION_DEFAULTS
          return formatWeatherSyncEntry(previousRegion, region, sourceTime)
        }),
      },
      ...current,
    ].slice(0, 10))

    return regionsWithOfficial
  }

  const effectiveRegions = useMemo(
    () => buildEffectiveRegions(regions, simulationByRegion),
    [regions, simulationByRegion],
  )

  const regionMap = useMemo(
    () => Object.fromEntries(effectiveRegions.map(region => [region.id, region])),
    [effectiveRegions],
  )

  const dynamicRecommendations = useMemo(() => {
    const activeAutoAlerts = autoAlerts.filter(item => item.status !== 'resolvido')
    return effectiveRegions.flatMap(region => buildAutomaticRecommendationSpecs(region, activeAutoAlerts))
  }, [autoAlerts, effectiveRegions])

  const mergedRecommendations = useMemo(() => {
    const normalizedDynamic = dynamicRecommendations.map(item => ({
      ...item,
      completed: recommendationOverrides[item.id] ?? item.completed,
    }))

    return [...recommendations, ...normalizedDynamic]
  }, [dynamicRecommendations, recommendationOverrides, recommendations])

  const allAlerts = useMemo(() => [...alerts, ...autoAlerts], [alerts, autoAlerts])

  const filteredAlerts = useMemo(
    () => allAlerts.filter(alert => !alert.regionId || regionMap[alert.regionId]),
    [allAlerts, regionMap],
  )

  const activeAlerts = useMemo(
    () => filteredAlerts.filter(alert => alert.status !== 'resolvido'),
    [filteredAlerts],
  )

  const computedHistory = useMemo(() => {
    const manualHistory = history
      .filter(item => !item.regionId || regionMap[item.regionId])
      .map(item => ({
        ...item,
        eventType: item.eventType ?? 'ocorrencia',
        summary: item.summary ?? item.alertType,
        details: item.details ?? `${item.alertType} encerrado em ${item.resolutionTime}.`,
        source: item.source ?? 'demo',
      }))

    return [...manualHistory, ...automationHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [automationHistory, history, regionMap])

  const generalRisk = useMemo(() => {
    const alertRisk = activeAlerts.map(alert => alert.priority)
    const regionRisk = effectiveRegions.map(region => region.risk)
    const combined = [...alertRisk, ...regionRisk]

    if (combined.includes('critico')) return 'critico'
    if (combined.includes('alto')) return 'alto'
    if (combined.includes('medio')) return 'medio'
    return 'baixo'
  }, [activeAlerts, effectiveRegions])

  const latestAlert = useMemo(
    () => [...filteredAlerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] ?? null,
    [filteredAlerts],
  )

  const criticalAlert = useMemo(
    () => [...activeAlerts]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .find(alert => alert.priority === 'critico') ?? null,
    [activeAlerts],
  )

  const enrichedRegions = useMemo(
    () =>
      effectiveRegions
        .map(region => {
          const linkedSensors = sensors.filter(sensor => sensor.regionId === region.id)
          const linkedAlerts = filteredAlerts.filter(alert => alert.regionId === region.id)
          const activeAutoRegionAlerts = linkedAlerts.filter(alert => alert.automatic && alert.status !== 'resolvido')
          const latestRegionSync = weatherSyncHistory[0]?.entries.find(entry => entry.regionId === region.id) ?? null

          return {
            ...region,
            sensorsCount: linkedSensors.length,
            linkedSensors,
            linkedAlerts,
            latestRegionSync,
            activeAutoAlertsCount: activeAutoRegionAlerts.length,
            lastAlert: summarizeRegionLastAlert(activeAutoRegionAlerts),
            actionRecommendation: summarizeRegionAction(activeAutoRegionAlerts),
            officialRisk: region.officialRisk ?? buildDefaultOfficialRisk(region),
          }
        })
        .sort((a, b) => getPriorityIndex(a.risk) - getPriorityIndex(b.risk)),
    [effectiveRegions, filteredAlerts, sensors, weatherSyncHistory],
  )

  const availableRegionOptions = useMemo(
    () => enrichedRegions,
    [enrichedRegions],
  )

  const officialRiskByRegion = useMemo(
    () => Object.fromEntries(enrichedRegions.map(region => [region.id, region.officialRisk ?? buildDefaultOfficialRisk(region)])),
    [enrichedRegions],
  )

  const analysis = useMemo(() => {
    const preset = visualAnalysisPresets[analysisIndex]
    const regionId = enrichedRegions[0]?.id ?? preset.regionId
    return {
      ...preset,
      regionId,
      timestamp: lastUpdated,
      origin: 'Modulo Python/OpenCV',
    }
  }, [analysisIndex, enrichedRegions, lastUpdated])

  const refreshData = () => {
    setLastUpdated(getNowIso())
  }

  const updateAlertStatus = (alertId, nextStatus) => {
    const updateEntry = {
      time: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      text: `Status atualizado para ${nextStatus.replaceAll('_', ' ')}.`,
    }

    if (alertId.startsWith('AUTO-')) {
      setAutoAlerts(current =>
        current.map(alert =>
          alert.id === alertId
            ? {
                ...alert,
                status: nextStatus,
                updateHistory: [updateEntry, ...(alert.updateHistory ?? [])],
              }
            : alert,
        ),
      )
      return
    }

    setAlerts(current =>
      current.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: nextStatus,
              updateHistory: [updateEntry, ...(alert.updateHistory ?? [])],
            }
          : alert,
      ),
    )
  }

  const simulateSensorReadings = () => {
    const now = getNowIso()
    setSensors(current =>
      current.map(sensor => {
        if (!regionMap[sensor.regionId]) return sensor
        const range = SENSOR_RANGES[sensor.type]
        if (!range) return sensor
        const nextValue = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
        return {
          ...sensor,
          value: nextValue,
          displayValue: formatSensorDisplay(sensor.type, nextValue),
          lastReading: now,
          critical: isCriticalSensor(sensor.type, nextValue),
          readingMode: 'simulated',
          readingSource: 'Leitura simulada local',
        }
      }),
    )
    setLastUpdated(now)
  }

  const addRegionFromCep = async cep => {
    const address = await getAddressByCep(cep)
    const coordinates = await getCoordinatesForBrazilianAddress(address)
    const weather = await getCurrentWeather(coordinates.latitude, coordinates.longitude)
    const nextMetrics = mapWeatherToRegionMetrics(weather)
    const climateRisk = calculateClimateRisk(nextMetrics)

    const nextRegion = normalizeStoredRegion({
      ...createRegionFromLookup(address, coordinates),
      ...nextMetrics,
      risk: climateRisk,
      dataSource: 'api',
      operationalStatus: buildRegionOperationalStatus(climateRisk),
    })

    const nextRegions = [...regions.filter(region => region.id !== nextRegion.id), nextRegion]
    const sourceTime = getNowIso()
    const syncedRegions = await syncDerivedState(regions, nextRegions, sourceTime)
    setRegions(syncedRegions)
    setLastUpdated(sourceTime)

    return nextRegion
  }

  const syncRealWeather = async () => {
    if (!regions.length) {
      throw new Error('NO_REGIONS')
    }

    const weatherResults = await Promise.all(
      regions.map(async region => {
        const weather = await getCurrentWeather(region.latitude, region.longitude)
        return { regionId: region.id, weather }
      }),
    )

    const sourceTime = getNowIso()
    const weatherMap = Object.fromEntries(weatherResults.map(item => [item.regionId, item.weather]))

    const nextRegions = regions.map(region => {
      const nextMetrics = mapWeatherToRegionMetrics(weatherMap[region.id])
      const climateRisk = calculateClimateRisk(nextMetrics)

      return normalizeStoredRegion({
        ...region,
        ...nextMetrics,
        risk: climateRisk,
        dataSource: 'api',
        operationalStatus: buildRegionOperationalStatus(climateRisk),
      })
    })

    const syncedRegions = await syncDerivedState(regions, nextRegions, sourceTime)
    setRegions(syncedRegions)
    setLastUpdated(sourceTime)
  }

  const activateSimulation = (regionId, scenarioId) => {
    const scenario = SIMULATION_SCENARIOS.find(item => item.id === scenarioId)
    const region = regions.find(item => item.id === regionId)
    if (!scenario || !region) return

    const timestamp = getNowIso()
    const nextSimulation = {
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      expectedRisk: scenario.expectedRisk,
      overrides: scenario.overrides,
      activatedAt: timestamp,
    }
    const nextSimulationByRegion = {
      ...simulationByRegion,
      [regionId]: nextSimulation,
    }

    setSimulationByRegion(nextSimulationByRegion)
    applyOperationalState(regions, nextSimulationByRegion, timestamp, [
      buildSimulationEvent(applySimulationToRegion(region, nextSimulation), 'activated', nextSimulation, timestamp),
    ])
    setLastUpdated(timestamp)
  }

  const clearSimulation = regionId => {
    const region = regions.find(item => item.id === regionId)
    const currentSimulation = simulationByRegion[regionId]
    if (!region || !currentSimulation) return

    const timestamp = getNowIso()
    const nextSimulationByRegion = { ...simulationByRegion }
    delete nextSimulationByRegion[regionId]

    setSimulationByRegion(nextSimulationByRegion)
    applyOperationalState(regions, nextSimulationByRegion, timestamp, [
      buildSimulationEvent(applySimulationToRegion(region, null), 'cleared', currentSimulation, timestamp),
    ])
    setLastUpdated(timestamp)
  }

  const simulateVisualAnalysis = () => {
    setAnalysisIndex(current => (current + 1) % visualAnalysisPresets.length)
    setLastUpdated(getNowIso())
  }

  const toggleRecommendation = recommendationId => {
    if (recommendationId.startsWith('AUTO-REC-')) {
      setRecommendationOverrides(current => ({
        ...current,
        [recommendationId]: !(current[recommendationId] ?? false),
      }))
      return
    }

    setRecommendations(current =>
      current.map(item =>
        item.id === recommendationId ? { ...item, completed: !item.completed } : item,
      ),
    )
  }

  const value = {
    regions: enrichedRegions,
    regionMap,
    availableRegionOptions,
    alerts: filteredAlerts,
    activeAlerts,
    sensors: sensors.filter(sensor => !sensor.regionId || regionMap[sensor.regionId]),
    history: computedHistory,
    recommendations: mergedRecommendations,
    lastUpdated,
    generalRisk,
    latestAlert,
    criticalAlert,
    analysis,
    weatherSyncHistory,
    officialRiskByRegion,
    simulationScenarios: SIMULATION_SCENARIOS,
    simulationByRegion,
    effectiveRegionState: regionId => regionMap[regionId] ?? null,
    refreshData,
    addRegionFromCep,
    syncRealWeather,
    activateSimulation,
    clearSimulation,
    updateAlertStatus,
    simulateSensorReadings,
    simulateVisualAnalysis,
    toggleRecommendation,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider')
  }
  return context
}
