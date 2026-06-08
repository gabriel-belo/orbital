const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

const STATE_BY_UF = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapa',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceara',
  DF: 'Distrito Federal',
  ES: 'Espirito Santo',
  GO: 'Goias',
  MA: 'Maranhao',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Para',
  PB: 'Paraiba',
  PR: 'Parana',
  PE: 'Pernambuco',
  PI: 'Piaui',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondonia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'Sao Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export async function getCoordinatesForBrazilianAddress(address) {
  const cityQuery = normalize(address.city)
  if (!cityQuery) {
    throw new Error('GEOCODING_NOT_FOUND')
  }

  const params = new URLSearchParams({
    name: cityQuery,
    count: '10',
    format: 'json',
  })

  const response = await fetch(`${GEOCODING_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error('GEOCODING_REQUEST_FAILED')
  }

  const data = await response.json()
  const stateName = normalize(address.stateName || STATE_BY_UF[address.state] || address.state)
  const result = data.results?.find(item =>
    item.country_code === 'BR' &&
    normalize(item.name) === cityQuery &&
    (!stateName || normalize(item.admin1) === stateName),
  ) ?? data.results?.find(item =>
    item.country_code === 'BR' &&
    normalize(item.name) === cityQuery,
  )

  if (!result) {
    throw new Error('GEOCODING_NOT_FOUND')
  }

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone || 'America/Sao_Paulo',
  }
}
