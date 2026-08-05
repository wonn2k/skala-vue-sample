import axios from 'axios'

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const REVERSE_GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse'

export async function fetchWeatherByCoordinates(latitude, longitude, signal) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error('VITE_OPENWEATHER_API_KEY가 설정되지 않았습니다.')
  }

  const { data } = await axios.get(WEATHER_URL, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: apiKey,
      units: 'metric',
      lang: 'kr',
    },
    signal,
  })

  return data
}

export async function reverseGeocode(latitude, longitude, signal) {
  const { data } = await axios.get(REVERSE_GEOCODING_URL, {
    params: {
      lat: latitude,
      lon: longitude,
      format: 'jsonv2',
      addressdetails: 1,
      zoom: 10,
      'accept-language': 'ko',
    },
    signal,
  })

  return data
}
