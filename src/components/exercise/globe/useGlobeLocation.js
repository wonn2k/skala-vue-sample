import { onBeforeUnmount, ref } from 'vue'
import { fetchWeatherByCoordinates, reverseGeocode } from './locationApi.js'

export function useGlobeLocation() {
  const selectedCoordinates = ref(null)
  const weather = ref(null)
  const place = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const warningMessages = ref([])
  let activeRequest = null

  const selectLocation = async ({ latitude, longitude }) => {
    activeRequest?.abort()
    const requestController = new AbortController()
    activeRequest = requestController

    selectedCoordinates.value = { latitude, longitude }
    weather.value = null
    place.value = null
    errorMessage.value = ''
    warningMessages.value = []
    isLoading.value = true

    const [weatherResult, placeResult] = await Promise.allSettled([
      fetchWeatherByCoordinates(latitude, longitude, requestController.signal),
      reverseGeocode(latitude, longitude, requestController.signal),
    ])

    if (requestController.signal.aborted || activeRequest !== requestController) return

    if (weatherResult.status === 'fulfilled') {
      weather.value = weatherResult.value
    } else {
      warningMessages.value.push('날씨 정보를 불러오지 못했습니다.')
      console.error('날씨 조회 실패:', weatherResult.reason)
    }

    if (placeResult.status === 'fulfilled') {
      place.value = placeResult.value
    } else {
      warningMessages.value.push('지역 이름과 주소를 불러오지 못했습니다.')
      console.error('역지오코딩 실패:', placeResult.reason)
    }

    if (!weather.value && !place.value) {
      errorMessage.value = '선택한 위치의 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.'
    }

    isLoading.value = false
  }

  onBeforeUnmount(() => activeRequest?.abort())

  return {
    selectedCoordinates,
    weather,
    place,
    isLoading,
    errorMessage,
    warningMessages,
    selectLocation,
  }
}
