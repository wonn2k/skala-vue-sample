import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { requestTravelRecommendations } from './travelRecommendationApi.js'

export function useTravelRecommendations({ coordinates, weather, place }) {
  const recommendation = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  let activeRequest = null

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
    () => Boolean(coordinates.value && country.value && weather.value && !isLoading.value),
  )

  const resetRecommendation = () => {
    activeRequest?.abort()
    activeRequest = null
    recommendation.value = null
    errorMessage.value = ''
    isLoading.value = false
  }

  const requestRecommendations = async () => {
    if (!canRequest.value) return

    activeRequest?.abort()
    const requestController = new AbortController()
    activeRequest = requestController
    recommendation.value = null
    errorMessage.value = ''
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
    } catch (error) {
      if (error.code === 'ERR_CANCELED') return
      errorMessage.value =
        error.response?.data?.message || 'AI 여행 추천을 불러오지 못했습니다.'
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
  onBeforeUnmount(() => activeRequest?.abort())

  return {
    recommendation,
    isLoading,
    errorMessage,
    canRequest,
    locationLabel,
    requestRecommendations,
  }
}
