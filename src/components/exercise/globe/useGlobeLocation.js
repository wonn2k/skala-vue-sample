import { onBeforeUnmount, ref } from 'vue'
import { fetchWeatherByCoordinates, reverseGeocode } from './locationApi.js'

/**
 * 지구본 클릭 좌표를 받아 날씨와 장소 정보를 조회하는 위치 선택 비즈니스 로직입니다.
 * 두 외부 API를 병렬로 호출하고 일부만 성공해도 가능한 정보를 보여주며, 빠르게 다른 지점을
 * 클릭했을 때는 이전 요청을 취소해 늦은 응답이 최신 선택을 덮어쓰지 못하게 합니다.
 */
export function useGlobeLocation() {
  // 원본 좌표, 외부 API 결과, 사용자 피드백을 각각 독립된 반응형 상태로 보관합니다.
  const selectedCoordinates = ref(null)
  const weather = ref(null)
  const place = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const warningMessages = ref([])
  let activeRequest = null

  // GlobeMap의 select-location 이벤트가 전달한 좌표를 새 조회의 기준으로 사용합니다.
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

    // 한 API의 실패가 다른 API 결과까지 버리지 않도록 allSettled로 동시에 조회합니다.
    const [weatherResult, placeResult] = await Promise.allSettled([
      fetchWeatherByCoordinates(latitude, longitude, requestController.signal),
      reverseGeocode(latitude, longitude, requestController.signal),
    ])

    // 취소됐거나 더 최신 요청이 시작됐다면 이 응답은 오래된 데이터이므로 무시합니다.
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

  // 페이지가 사라질 때 진행 중인 네트워크 요청도 함께 종료합니다.
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
