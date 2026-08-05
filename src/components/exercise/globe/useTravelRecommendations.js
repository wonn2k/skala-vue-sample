import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { requestTravelRecommendations } from './travelRecommendationApi.js'

/**
 * 선택 위치와 날씨를 Gemini 여행 추천 요청에 필요한 형태로 가공하고 요청 생명주기를 관리합니다.
 * UI와 분리된 이 composable이 로딩·오류·쿨다운·자동 재시도·요청 취소를 책임지므로,
 * 화면 컴포넌트는 반환된 상태를 표시하고 requestRecommendations만 호출하면 됩니다.
 */
export function useTravelRecommendations({ coordinates, weather, place }) {
  // 서버 응답과 화면 상태: 성공 결과를 보존한 채 재요청 상태를 별도로 표현할 수 있습니다.
  const recommendation = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const errorCode = ref('')
  const cooldownSeconds = ref(0)
  const willAutoRetry = ref(false)
  // Vue 반응성이 필요 없는 AbortController, timer, 재시도 횟수는 일반 변수로 관리합니다.
  let activeRequest = null
  let cooldownTimer = null
  let autoRetryCount = 0

  // 역지오코딩과 날씨 API 결과를 조합해 Gemini에 전달할 대표 국가/도시명을 결정합니다.
  const address = computed(() => place.value?.address ?? {})
  const country = computed(() => address.value.country || weather.value?.sys?.country || '')
  const location = computed(
    () =>
      address.value.city ||
      address.value.town ||
      address.value.village ||
      address.value.county ||
      weather.value?.name ||
      country.value,
  )
  const locationLabel = computed(() =>
    [location.value, country.value].filter(Boolean).join(', '),
  )
  // 필수 데이터가 있고 로딩/대기 중이 아닐 때만 추천 버튼을 활성화합니다.
  const canRequest = computed(
    () =>
      Boolean(
        coordinates.value &&
          country.value &&
          weather.value &&
          !isLoading.value &&
          cooldownSeconds.value === 0,
      ),
  )

  // 타이머를 정리하면서 재시도 관련 상태도 함께 초기화합니다.
  const clearCooldown = () => {
    if (cooldownTimer) clearInterval(cooldownTimer)
    cooldownTimer = null
    cooldownSeconds.value = 0
    willAutoRetry.value = false
  }

  // 서버의 Retry-After 값을 초 단위 카운트다운으로 바꾸고 필요하면 종료 후 한 번 재요청합니다.
  const startCooldown = (seconds, autoRetry = false) => {
    clearCooldown()
    cooldownSeconds.value = Math.max(1, Number(seconds) || 30)
    willAutoRetry.value = autoRetry

    cooldownTimer = setInterval(() => {
      cooldownSeconds.value -= 1

      if (cooldownSeconds.value > 0) return

      const shouldRetry = willAutoRetry.value
      clearCooldown()
      if (shouldRetry) requestRecommendations({ isAutoRetry: true })
    }, 1000)
  }

  // 사용자가 지구본에서 새 위치를 고르면 이전 지역의 요청과 결과가 섞이지 않도록 초기화합니다.
  const resetRecommendation = () => {
    activeRequest?.abort()
    activeRequest = null
    recommendation.value = null
    errorMessage.value = ''
    errorCode.value = ''
    isLoading.value = false
    autoRetryCount = 0
    clearCooldown()
  }

  // 현재 위치/날씨의 스냅샷을 서버 API에 전달하고 응답 상태를 UI용 ref에 반영합니다.
  const requestRecommendations = async ({ isAutoRetry = false } = {}) => {
    if (!canRequest.value) return

    if (!isAutoRetry) autoRetryCount = 0
    activeRequest?.abort()
    const requestController = new AbortController()
    activeRequest = requestController
    errorMessage.value = ''
    errorCode.value = ''
    isLoading.value = true

    try {
      recommendation.value = await requestTravelRecommendations(
        {
          country: country.value,
          location: location.value,
          weather: weather.value?.weather?.[0]?.description,
          temperature: weather.value?.main?.temp,
          feelsLike: weather.value?.main?.feels_like,
          humidity: weather.value?.main?.humidity,
          windSpeed: weather.value?.wind?.speed,
        },
        requestController.signal,
      )
      autoRetryCount = 0
    } catch (error) {
      if (error.code === 'ERR_CANCELED') return

      const responseData = error.response?.data
      errorCode.value = responseData?.code || (error.response ? 'REQUEST_FAILED' : 'NETWORK_ERROR')
      errorMessage.value =
        responseData?.message ||
        (error.response
          ? 'AI 여행 추천을 불러오지 못했습니다.'
          : '서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.')

      // 일시적인 Gemini 과부하만 자동 재시도하며, 무한 반복을 막기 위해 최대 1회로 제한합니다.
      const shouldAutoRetry =
        errorCode.value === 'GEMINI_OVERLOADED' && autoRetryCount < 1

      if (shouldAutoRetry) autoRetryCount += 1
      if (responseData?.retryAfter) {
        startCooldown(responseData.retryAfter, shouldAutoRetry)
      }
    } finally {
      if (activeRequest === requestController) {
        activeRequest = null
        isLoading.value = false
      }
    }
  }

  // 위도 또는 경도가 바뀌는 즉시 이전 추천을 폐기합니다.
  watch(
    () => `${coordinates.value?.latitude ?? ''}:${coordinates.value?.longitude ?? ''}`,
    resetRecommendation,
  )
  // 화면 이탈 후 비동기 콜백이 상태를 갱신하거나 타이머가 남지 않도록 정리합니다.
  onBeforeUnmount(() => {
    activeRequest?.abort()
    clearCooldown()
  })

  return {
    recommendation,
    isLoading,
    errorMessage,
    errorCode,
    cooldownSeconds,
    willAutoRetry,
    canRequest,
    locationLabel,
    requestRecommendations,
  }
}
