import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { requestTravelRecommendations } from './travelRecommendationApi.js'

export function useTravelRecommendations({ coordinates, weather, place }) {
  const recommendation = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const errorCode = ref('')
  const cooldownSeconds = ref(0)
  const willAutoRetry = ref(false)
  let activeRequest = null
  let cooldownTimer = null
  let autoRetryCount = 0

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

  const clearCooldown = () => {
    if (cooldownTimer) clearInterval(cooldownTimer)
    cooldownTimer = null
    cooldownSeconds.value = 0
    willAutoRetry.value = false
  }

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

  watch(
    () => `${coordinates.value?.latitude ?? ''}:${coordinates.value?.longitude ?? ''}`,
    resetRecommendation,
  )
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
