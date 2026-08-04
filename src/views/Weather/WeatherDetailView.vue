<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
)

const route = useRoute()
const router = useRouter()

const weekDays = ['월', '화', '수', '목', '금', '토', '일']

const mockWeatherDetailList = [
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 55,
    windSpeed: 2.4,
    description: '오늘은 햇볕이 잘 들고 기분 좋은 날씨입니다.',
    color: '#4f46e5',
    weeklyTemps: [24, 25, 27, 28, 26, 29, 28],
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 88,
    windSpeed: 4.1,
    description: '비가 오고 있어 우산을 챙기는 것이 좋습니다.',
    color: '#ef4444',
    weeklyTemps: [22, 23, 24, 23, 24, 25, 24],
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 72,
    windSpeed: 3.3,
    description: '구름이 많아 쌀쌀한 느낌이 드는 날씨입니다.',
    color: '#16a34a',
    weeklyTemps: [25, 26, 27, 26, 26, 27, 26],
  },
]

const selectedCity = ref(null)

const setSelectedCity = () => {
  const cityId = route.params.cityID || route.params.cityId
  selectedCity.value = mockWeatherDetailList.find((city) => city.id === cityId) ?? null
}

const weeklyTemps = computed(() => selectedCity.value?.weeklyTemps ?? [])
const minWeeklyTemp = computed(() =>
  weeklyTemps.value.length ? Math.min(...weeklyTemps.value) : 0,
)
const maxWeeklyTemp = computed(() =>
  weeklyTemps.value.length ? Math.max(...weeklyTemps.value) : 0,
)
const chartColor = computed(() => selectedCity.value?.color ?? '#6366f1')

const chartData = computed(() => ({
  labels: weekDays.slice(0, weeklyTemps.value.length),
  datasets: [
    {
      label: '기온',
      data: weeklyTemps.value,
      tension: 0.45,
      fill: true,
      backgroundColor: `${chartColor.value}33`,
      borderColor: chartColor.value,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: chartColor.value,
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 3,
      spanGaps: true,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label(context) {
          return `${context.parsed.y}°C`
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6b7280',
      },
    },
    y: {
      grid: {
        color: 'rgba(15, 23, 42, 0.08)',
        borderDash: [4, 4],
      },
      ticks: {
        color: '#6b7280',
        callback(value) {
          return `${value}°`
        },
      },
    },
  },
}

onMounted(setSelectedCity)

watch(() => route.params.cityID || route.params.cityId, setSelectedCity)

const goBackMain = () => {
  router.push('/')
}
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
        <button class="back-button" @click="goBackMain">← 목록으로</button>
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

      <div class="weekly-chart">
        <div class="chart-header">
          <div>
            <p class="eyebrow">최근 7일 기온</p>
            <h3>{{ minWeeklyTemp }}°C ~ {{ maxWeeklyTemp }}°C</h3>
          </div>
          <span class="chart-label">일별 변화를 직관적으로 확인하세요</span>
        </div>

        <div class="chart-container">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <div v-else class="detail-wrapper empty-state">
      <h2>조회 결과가 없습니다.</h2>
      <p>요청한 도시 정보를 찾을 수 없습니다.</p>
      <button class="back-button" @click="goBackMain">목록으로 돌아가기</button>
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

h2,
h3 {
  margin: 0;
  color: #111827;
}

h2 {
  font-size: 1.9rem;
}

h3 {
  font-size: 1.2rem;
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

.weekly-chart {
  background: #ffffff;
  border-radius: 16px;
  padding: 22px;
  border: 1px solid #e5e7eb;
  margin-bottom: 22px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 18px;
}

.chart-label {
  color: #6b7280;
  font-size: 0.95rem;
}

.chart-container {
  width: 100%;
  min-height: 260px;
}

.chart-container canvas {
  width: 100% !important;
  height: 260px !important;
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
