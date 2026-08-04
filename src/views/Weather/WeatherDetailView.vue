<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

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

const goBack = () => {
  router.push('/weather')
}

onMounted(setSelectedCity)

watch(() => route.params.cityID || route.params.cityId, setSelectedCity)
</script>

<template>
  <div class="detail-page">
    <div class="detail-wrapper" v-if="selectedCity">
      <div class="detail-header">
        <div>
          <p class="eyebrow">기상 상세 정보</p>
          <h2>{{ selectedCity.name }}</h2>
          <p class="subtitle">{{ selectedCity.description }}</p>
        </div>
        <button class="back-button" @click="goBack">← 목록으로</button>
      </div>

      <div class="weather-summary">
        <div class="summary-main">
          <p class="temp-value">{{ selectedCity.temp }}°C</p>
          <span class="status-badge">{{ selectedCity.status }}</span>
        </div>
        <div class="summary-details">
          <div class="detail-card">
            <span>습도</span>
            <strong>{{ selectedCity.humidity }}%</strong>
          </div>
          <div class="detail-card">
            <span>풍속</span>
            <strong>{{ selectedCity.windSpeed }}m/s</strong>
          </div>
        </div>
      </div>

      <div class="detail-note">
        <p>오늘의 한 줄 코멘트</p>
        <p>{{ selectedCity.description }}</p>
      </div>
    </div>

    <div v-else class="detail-wrapper empty-state">
      <h2>조회 결과가 없습니다.</h2>
      <p>요청한 도시 정보를 찾을 수 없습니다.</p>
      <button class="back-button" @click="goBack">목록으로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 640px;
  margin: 32px auto;
  padding: 0 16px;
}

.detail-wrapper {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  padding: 26px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: 1.9rem;
  color: #111827;
}

.subtitle {
  margin: 10px 0 0;
  color: #4b5563;
  line-height: 1.6;
}

.back-button {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.back-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.12);
  background: #f3f4f6;
}

.weather-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 22px;
}

.summary-main {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 200px;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
}

.temp-value {
  margin: 0 0 12px;
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.12);
  color: #4338ca;
  font-weight: 600;
}

.summary-details {
  display: grid;
  gap: 16px;
}

.detail-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #374151;
}

.detail-card span {
  font-size: 0.95rem;
}

.detail-card strong {
  font-size: 1.25rem;
  color: #111827;
}

.detail-note {
  background: #ffffff;
  border-radius: 16px;
  padding: 22px;
  border: 1px solid #e5e7eb;
}

.detail-note p:first-child {
  margin: 0 0 10px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
}

.detail-note p:last-child {
  margin: 0;
  color: #4b5563;
  line-height: 1.75;
}

.empty-state {
  text-align: center;
}

.empty-state h2 {
  font-size: 1.7rem;
}

.empty-state p {
  color: #6b7280;
}
</style>
