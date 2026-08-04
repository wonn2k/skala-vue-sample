<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const mockWeatherDetailList = [
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 55,
    windSpeed: 2.4,
    description: '오늘은 햇볕이 잘 들고 기분 좋은 날씨입니다.',
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 88,
    windSpeed: 4.1,
    description: '비가 오고 있어 우산을 챙기는 것이 좋습니다.',
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 72,
    windSpeed: 3.3,
    description: '구름이 많아 쌀쌀한 느낌이 드는 날씨입니다.',
  },
]

const selectedCity = ref(null)

const setSelectedCity = () => {
  const cityId = route.params.cityID || route.params.cityId
  selectedCity.value = mockWeatherDetailList.find((city) => city.id === cityId) ?? null
}

onMounted(() => {
  setSelectedCity()
})

watch(
  () => route.params.cityID,
  () => {
    setSelectedCity()
  },
)
</script>

<template>
  <div class="detail-wrapper" v-if="selectedCity">
    <h2>{{ selectedCity.name }} 상세 기상 관측</h2>
    <p>현재 상태: {{ selectedCity.status }}</p>
    <p>기온: {{ selectedCity.temp }}°C</p>
    <p>습도: {{ selectedCity.humidity }}%</p>
    <p>풍속: {{ selectedCity.windSpeed }}m/s</p>
    <p>{{ selectedCity.description }}</p>
  </div>

  <div v-else class="detail-wrapper">
    <h2>조회 결과가 없습니다.</h2>
    <p>요청한 도시 정보를 찾을 수 없습니다.</p>
  </div>
</template>

<style scoped>
.detail-wrapper {
  max-width: 480px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  background: #fff;
}
</style>
