const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'rain',
  'showers',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'surface_pressure',
  'pressure_msl',
  'visibility',
  'vapour_pressure_deficit',
]

const HOURLY_FIELDS = [
  'precipitation_probability',
  'soil_moisture_0_to_1cm',
  'soil_moisture_1_to_3cm',
  'soil_moisture_3_to_9cm',
  'soil_moisture_9_to_27cm',
  'soil_moisture_27_to_81cm',
]

const DAILY_FIELDS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'rain_sum',
  'showers_sum',
  'precipitation_probability_max',
  'wind_gusts_10m_max',
  'wind_direction_10m_dominant',
  'uv_index_max',
]

function getSeriesValue(block, key, index = 0) {
  const values = block?.[key]
  if (!Array.isArray(values) || values.length === 0) return null
  return values[index] ?? null
}

function getHourlyIndex(hourly, targetTime) {
  if (!hourly?.time?.length) return 0
  const exactIndex = hourly.time.findIndex(value => value === targetTime)
  if (exactIndex >= 0) return exactIndex
  return 0
}

export async function getCurrentWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS.join(','),
    hourly: HOURLY_FIELDS.join(','),
    daily: DAILY_FIELDS.join(','),
    timezone: 'America/Sao_Paulo',
  })

  const response = await fetch(`${BASE_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed: ${response.status}`)
  }

  const data = await response.json()
  const current = data.current
  const hourly = data.hourly
  const daily = data.daily

  if (!current) {
    throw new Error('Open-Meteo response missing current weather')
  }

  const hourlyIndex = getHourlyIndex(hourly, current.time)

  return {
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    wind: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    gusts: current.wind_gusts_10m,
    precipitation: current.precipitation,
    rain: current.rain,
    showers: current.showers,
    weatherCode: current.weather_code,
    cloudCover: current.cloud_cover,
    surfacePressure: current.surface_pressure,
    seaLevelPressure: current.pressure_msl,
    visibility: current.visibility,
    vapourPressureDeficit: current.vapour_pressure_deficit,
    precipitationProbability: getSeriesValue(hourly, 'precipitation_probability', hourlyIndex),
    soilMoisture0To1cm: getSeriesValue(hourly, 'soil_moisture_0_to_1cm', hourlyIndex),
    soilMoisture1To3cm: getSeriesValue(hourly, 'soil_moisture_1_to_3cm', hourlyIndex),
    soilMoisture3To9cm: getSeriesValue(hourly, 'soil_moisture_3_to_9cm', hourlyIndex),
    soilMoisture9To27cm: getSeriesValue(hourly, 'soil_moisture_9_to_27cm', hourlyIndex),
    soilMoisture27To81cm: getSeriesValue(hourly, 'soil_moisture_27_to_81cm', hourlyIndex),
    dailyTemperatureMax: getSeriesValue(daily, 'temperature_2m_max'),
    dailyTemperatureMin: getSeriesValue(daily, 'temperature_2m_min'),
    dailyPrecipitationSum: getSeriesValue(daily, 'precipitation_sum'),
    dailyRainSum: getSeriesValue(daily, 'rain_sum'),
    dailyShowersSum: getSeriesValue(daily, 'showers_sum'),
    dailyPrecipitationProbabilityMax: getSeriesValue(daily, 'precipitation_probability_max'),
    dailyWindGustsMax: getSeriesValue(daily, 'wind_gusts_10m_max'),
    dailyWindDirectionDominant: getSeriesValue(daily, 'wind_direction_10m_dominant'),
    dailyUvIndexMax: getSeriesValue(daily, 'uv_index_max'),
    time: current.time,
  }
}
