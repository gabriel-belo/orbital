const INPE_FOCUS_INDEX_URL = 'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/10min/'
const INPE_FOCUS_BASE_URL = 'https://dataserver-coids.inpe.br/queimadas/queimadas/focos/csv/10min/'
const FOCUS_MATCH_KM = 50

function extractLatestCsvName(html) {
  const matches = Array.from(html.matchAll(/focos_10min_\d{8}_\d{4}\.csv/g)).map(match => match[0])
  if (!matches.length) {
    throw new Error('INPE_INDEX_EMPTY')
  }

  return matches.sort().at(-1)
}

function parseCsv(text) {
  const lines = text.trim().split('\n').slice(1)
  return lines
    .map(line => line.split(',').map(part => part.trim()))
    .filter(parts => parts.length >= 4)
    .map(parts => ({
      latitude: Number(parts[0]),
      longitude: Number(parts[1]),
      satellite: parts[2],
      timestamp: parts[3].replace(' ', 'T'),
    }))
    .filter(item => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
}

function toRadians(value) {
  return (value * Math.PI) / 180
}

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) ** 2

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function classifyFocusRisk(focusCount, nearestDistanceKm) {
  if (focusCount >= 3 || nearestDistanceKm <= 15) return 'critico'
  if (focusCount >= 1 || nearestDistanceKm <= FOCUS_MATCH_KM) return 'alto'
  return 'baixo'
}

export async function getLatestInpeFocusDataset() {
  const indexResponse = await fetch(INPE_FOCUS_INDEX_URL)
  if (!indexResponse.ok) {
    throw new Error(`INPE_INDEX_FAILED_${indexResponse.status}`)
  }

  const html = await indexResponse.text()
  const latestCsvName = extractLatestCsvName(html)
  const csvUrl = `${INPE_FOCUS_BASE_URL}${latestCsvName}`
  const csvResponse = await fetch(csvUrl)

  if (!csvResponse.ok) {
    throw new Error(`INPE_CSV_FAILED_${csvResponse.status}`)
  }

  const csvText = await csvResponse.text()
  const records = parseCsv(csvText)

  return {
    sourceUrl: csvUrl,
    csvName: latestCsvName,
    records,
  }
}

export function getInpeOfficialRiskForRegion(region, dataset) {
  const distances = dataset.records
    .map(record => ({
      ...record,
      distanceKm: haversineDistanceKm(region.latitude, region.longitude, record.latitude, record.longitude),
    }))
    .filter(record => record.distanceKm <= FOCUS_MATCH_KM)
    .sort((a, b) => a.distanceKm - b.distanceKm)

  const nearest = distances[0] ?? null
  const focusCount = distances.length
  const nearestDistanceKm = nearest ? Number(nearest.distanceKm.toFixed(1)) : null
  const risk = classifyFocusRisk(focusCount, nearestDistanceKm ?? Number.POSITIVE_INFINITY)

  return {
    status: 'ok',
    granularity: 'proximidade',
    sourceUrl: dataset.sourceUrl,
    csvName: dataset.csvName,
    risk,
    nearbyFocusCount: focusCount,
    nearestDistanceKm,
    latestFocusTimestamp: nearest?.timestamp ?? null,
    satellites: Array.from(new Set(distances.map(item => item.satellite))),
    summary:
      focusCount > 0
        ? `${focusCount} focos ativos proximos em ate ${FOCUS_MATCH_KM} km`
        : 'Nenhum foco ativo proximo encontrado no recorte atual',
  }
}
