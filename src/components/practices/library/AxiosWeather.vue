<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'

const weatherData = ref(null)
const isLoading = ref(false)
const weatherInput = ref('')
const searchInProgress = ref(false)

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const lat = ref(35.158582)
const lon = ref(126.804975)

const locationLabel = computed(() => weatherData.value?.name || 'Unknown')
const isDataValid = computed(
  () =>
    weatherData.value?.main != null &&
    Array.isArray(weatherData.value?.weather) &&
    weatherData.value.weather.length > 0,
)
const changeCity = async (countryName, cityName) => {
  if (!cityName) return
  if (searchInProgress.value) {
    console.log('검색 요청이 이미 진행 중입니다. 중복 호출을 건너뜁니다.')
    return
  }

  searchInProgress.value = true
  console.log(`선택된 국가: ${countryName}, 도시: ${cityName}`)

  const SEARCH_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)},,410&limit=1&appid=${API_KEY}`
  try {
    const response = await axios.get(SEARCH_URL)
    if (response.data && response.data.length > 0) {
      lat.value = response.data[0].lat
      lon.value = response.data[0].lon
      await handleFetchWeather()
    } else {
      console.error('도시를 찾을 수 없습니다.')
      alert('도시를 찾을 수 없습니다. 다른 이름으로 시도해 주세요.')
    }
  } catch (error) {
    console.error('도시 검색 중 에러 발생:', error)
    alert('도시 검색 중 오류가 발생했습니다. 네트워크를 확인하세요.')
  } finally {
    searchInProgress.value = false
  }
}

const handleFetchWeather = async () => {
  isLoading.value = true
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.value}&lon=${lon.value}&appid=${API_KEY}&units=metric&lang=kr`

  try {
    const response = await axios.get(URL)
    console.log('Axios 통신 응답 전체 객체:', response)
    console.log('백엔드가 준 핵심 날씨 데이터(JSON):', response.data)
    weatherData.value = response.data
  } catch (error) {
    console.error('통신 중 에러가 발생했습니다:', error)
    alert('데이터를 가져오지 못했습니다. API 키 활성화 여부나 주소를 확인하세요.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>⚡ Axios 통신 검증</h2>

    <p>날씨 데이터 검색</p>
    <input
      type="text"
      v-model="weatherInput"
      placeholder="한국의 도시 이름 입력"
      @keydown.enter.prevent="changeCity('Korea', weatherInput)"
    />
    <p>※ 도시 이름을 입력하고 엔터를 누르면 해당 도시의 날씨 데이터를 가져옵니다.(ex : 서울)</p>
    <br />
    <!--<button @click="handleFetchWeather" :disabled="isLoading">
      {{ isLoading ? '데이터 로딩 중...' : '실시간 날씨 데이터 당겨오기' }}
    </button>-->
    <div v-if="isDataValid" class="result-card">
      <p>
        📍 위치: <strong>{{ weatherData.name || locationLabel }}</strong>
      </p>
      <p>
        🌡️ 현재 기온: <strong>{{ weatherData.main?.temp ?? 'N/A' }}°C</strong> (정상 섭씨 변환 완료)
      </p>
      <p>
        ☁️ 날씨 상태: <strong>{{ weatherData.weather[0]?.description ?? '정보 없음' }}</strong>
      </p>
      <p>
        💧 습도: <strong>{{ weatherData.main?.humidity ?? 'N/A' }}%</strong>
      </p>
    </div>
    <div v-else>
      <p>아직 가져온 데이터가 없습니다. 버튼을 눌러 통신을 가동하세요.</p>
    </div>
  </div>
</template>

<style scoped>
.practice-section {
  padding: 24px;
  margin: 20px 0;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
}

.result-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  line-height: 1.8;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
}

.result-card strong {
  color: #1e3a8a;
}
</style>
