const CEMADEN_FIRE_URL = 'https://produtos.cemaden.gov.br/fogo/'
const CEMADEN_DATA_URL = 'https://produtos.cemaden.gov.br/fogo/data'
const REQUEST_TIMEOUT_MS = 6000

const CEMADEN_MODELS = [
  {
    id: 'gefs_mean',
    model: 'Cenario medio GEFS',
    imageUrl: `${CEMADEN_DATA_URL}/PropFogo_inter_18Z.png`,
  },
  {
    id: 'gefs_extreme',
    model: 'Cenario extremo GEFS',
    imageUrl: `${CEMADEN_DATA_URL}/PropFogo_max_inter_18Z.png`,
  },
  {
    id: 'eta_deterministic',
    model: 'Cenario deterministico ETA',
    imageUrl: `${CEMADEN_DATA_URL}/PropFogo_ETA_inter_18Z.png`,
  },
]

function classifyCemadenRisk(region) {
  if (region.temperature > 30 && region.humidity < 30 && region.wind > 15) return 'critico'
  if (region.temperature > 30 && region.humidity < 30) return 'alto'
  return 'baixo'
}

async function fetchImageHead(model) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(model.imageUrl, {
      method: 'HEAD',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`CEMADEN_IMAGE_FAILED_${response.status}`)
    }

    return {
      ...model,
      status: 'ok',
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
      checkedBy: 'head',
    }
  } finally {
    clearTimeout(timer)
  }
}

function probeImageLoad(model) {
  if (typeof Image === 'undefined') {
    throw new Error('IMAGE_PROBE_UNAVAILABLE')
  }

  return new Promise((resolve, reject) => {
    const image = new Image()
    const timer = setTimeout(() => {
      image.onload = null
      image.onerror = null
      reject(new Error('CEMADEN_IMAGE_TIMEOUT'))
    }, REQUEST_TIMEOUT_MS)

    image.onload = () => {
      clearTimeout(timer)
      resolve({
        ...model,
        status: 'ok',
        width: image.naturalWidth,
        height: image.naturalHeight,
        checkedBy: 'image',
      })
    }

    image.onerror = () => {
      clearTimeout(timer)
      reject(new Error('CEMADEN_IMAGE_LOAD_FAILED'))
    }

    image.src = `${model.imageUrl}?t=${Date.now()}`
  })
}

async function validateCemadenModel(model) {
  try {
    return await fetchImageHead(model)
  } catch {
    try {
      return await probeImageLoad(model)
    } catch (error) {
      return {
        ...model,
        status: 'erro',
        error: error.message,
      }
    }
  }
}

export async function getCemadenSnapshot() {
  const checkedAt = new Date().toISOString()
  const models = await Promise.all(CEMADEN_MODELS.map(validateCemadenModel))
  const preferred = models.find(model => model.id === 'gefs_mean' && model.status === 'ok')
    ?? models.find(model => model.status === 'ok')
    ?? models[0]

  if (!preferred || preferred.status !== 'ok') {
    throw new Error('CEMADEN_UNAVAILABLE')
  }

  return {
    sourceUrl: CEMADEN_FIRE_URL,
    imageUrl: preferred.imageUrl,
    publishedAt: preferred.lastModified ? new Date(preferred.lastModified).toISOString() : null,
    checkedAt,
    granularity: 'nacional',
    model: preferred.model,
    status: 'ok',
    models,
  }
}

export function getCemadenOfficialRiskForRegion(region, snapshot) {
  const risk = classifyCemadenRisk(region)
  const criteriaMatched = risk !== 'baixo'

  return {
    status: 'ok',
    granularity: snapshot.granularity,
    sourceUrl: snapshot.sourceUrl,
    imageUrl: snapshot.imageUrl,
    publishedAt: snapshot.publishedAt,
    checkedAt: snapshot.checkedAt,
    model: snapshot.model,
    availableModels: snapshot.models?.filter(model => model.status === 'ok').map(model => model.model) ?? [],
    risk,
    criteriaMatched,
    summary: criteriaMatched
      ? 'Criterio oficial de propagacao compativel com o boletim Cemaden'
      : 'Sem combinacao local compativel com o criterio publicado pelo Cemaden',
  }
}
