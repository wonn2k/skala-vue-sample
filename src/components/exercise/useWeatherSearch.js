import { ref, computed, watch, watchEffect } from 'vue'

/**
 * 여러 날씨 대시보드에서 검색 및 선택 상태를 공유하기 위한 composable입니다.
 * @param {Array|import('vue').Ref<Array>} weatherList 일반 배열 또는 ref 형태의 날씨 목록
 * @param {string} initialMessage 선택 상태 바의 초기 안내 문구
 * @returns 검색어, 선택 안내 문구, 검색 결과를 담은 반응형 객체
 */
export function useWeatherSearch(weatherList, initialMessage = '카드를 클릭하거나 검색해 보세요.') {
  // 호출자가 일반 배열과 ref 중 어느 형태를 넘겨도 동일하게 읽도록 computed로 정규화합니다.
  const sourceList = computed(() => {
    if (Array.isArray(weatherList)) {
      return weatherList
    }

    return weatherList?.value ?? []
  })

  const searchQuery = ref('')
  const selectedCityInfo = ref(initialMessage)

  // 검색어가 바뀔 때만 자동 재계산되는 파생 목록입니다. 원본 목록은 수정하지 않습니다.
  const filteredWeatherList = computed(() => {
    const query = searchQuery.value.trim()

    if (!query) {
      return sourceList.value
    }

    return sourceList.value.filter((item) => item.name.includes(query))
  })

  // 명시한 selectedCityInfo만 감시하는 watch 사용 예시입니다.
  watch(
    selectedCityInfo,
    (newInfo) => {
      console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
    },
    //추가 : immediate 옵션을 true로 설정하여 watch가 즉시 실행되도록 함
    { immediate: true },
  )

  // 콜백 내부에서 읽은 searchQuery를 Vue가 자동으로 의존성으로 추적합니다.
  watchEffect(() => {
    console.log(
      `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
    )
  })

  // 화면별 컴포넌트가 같은 로직을 각자의 UI에 연결할 수 있도록 반응형 값만 공개합니다.
  return {
    searchQuery,
    selectedCityInfo,
    filteredWeatherList,
  }
}
