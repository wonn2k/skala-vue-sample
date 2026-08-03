import { ref, computed, watch, watchEffect } from 'vue'

export function useWeatherSearch(weatherList, initialMessage = '카드를 클릭하거나 검색해 보세요.') {
  const sourceList = computed(() => {
    if (Array.isArray(weatherList)) {
      return weatherList
    }

    return weatherList?.value ?? []
  })

  const searchQuery = ref('')
  const selectedCityInfo = ref(initialMessage)

  const filteredWeatherList = computed(() => {
    const query = searchQuery.value.trim()

    if (!query) {
      return sourceList.value
    }

    return sourceList.value.filter((item) => item.name.includes(query))
  })

  watch(selectedCityInfo, (newInfo) => {
    console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
  })

  watchEffect(() => {
    console.log(
      `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
    )
  })

  return {
    searchQuery,
    selectedCityInfo,
    filteredWeatherList,
  }
}
