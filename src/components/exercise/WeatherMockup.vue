<script setup>
import { computed, ref, watch } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해주세요')
const renderCount = ref(0)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value

  return weatherList.value.filter((item) => item.name.includes(query))
})

// 콘솔에서도 결과를 출력하여 리렌더링 횟수를 확인할 수 있도록 watch를 활용
watch(searchQuery, () => {
  renderCount.value += 1
  console.log(`[WeatherMockup] 카드 목록 리렌더 #${renderCount.value}`, {
    query: searchQuery.value,
  })
})

//추가 : 날씨 상태에 따른 이모지 반환 함수
const getWeatherEmoji = (status) => {
  const emojiMap = {
    맑음: '☀️',
    비: '🌧️',
    구름: '☁️',
  }
  return emojiMap[status] || '🌡️'
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <!-- 추가 : v-model.trim.lazy를 활용 - 엔터 입력 시에만 반영-->
      <input type="text" v-model.trim.lazy="searchQuery" placeholder="검색할 도시 이름 입력" />
      <!--input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      /!-->
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box" v-memo="[searchQuery]">
      <h3>🏙️ 지역별 날씨 현황</h3>
      <!-- 추가 : v-memo를 활용하여 searchQuery가 변경될 때만 리렌더링, 결과를 출력 -->
      <p>리렌더 추적: 콘솔에서 확인하세요 ({{ renderCount }}회)</p>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }} {{ getWeatherEmoji(item.status) }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <span v-if="item.temp >= 40" class="badge hot">🔥 더움 (30도 이상)</span>
        <span v-else-if="item.temp >= 25" class="badge hot">🔥 보통 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
