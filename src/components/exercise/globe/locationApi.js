import axios from 'axios'

/** 외부 서비스 주소를 한곳에 모아 요청 함수가 엔드포인트 문자열에 의존하지 않게 합니다. */
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const REVERSE_GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse'

/**
 * 좌표의 현재 날씨를 OpenWeatherMap에서 섭씨·한국어 형식으로 조회합니다.
 * VITE_ 접두사가 있는 키는 클라이언트 번들에 노출되므로 날씨 조회 전용 키만 사용해야 합니다.
 */
export async function fetchWeatherByCoordinates(latitude, longitude, signal) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error('VITE_OPENWEATHER_API_KEY가 설정되지 않았습니다.')
  }

  // signal은 사용자가 다른 위치를 선택했을 때 axios 요청을 취소하는 데 사용됩니다.
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

/**
 * Nominatim 역지오코딩 API로 위도/경도를 사람이 읽을 수 있는 지역명과 주소로 변환합니다.
 * zoom 10은 도시/행정구역 수준의 결과를 요청하고 한국어 표기를 우선합니다.
 */
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
