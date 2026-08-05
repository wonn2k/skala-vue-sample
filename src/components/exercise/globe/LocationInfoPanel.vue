<script setup>
/**
 * 선택한 좌표, 역지오코딩 장소, OpenWeatherMap 날씨를 읽기 쉬운 정보 카드로 표현합니다.
 * 이 컴포넌트는 API를 직접 호출하지 않는 순수 표시 계층이며, props 조합을 computed로 정규화해
 * 초기·로딩·부분 성공·전체 실패 상태를 한 패널 안에서 안정적으로 전환합니다.
 */
import { computed } from 'vue'

const props = defineProps({
  coordinates: {
    type: Object,
    default: null,
  },
  weather: {
    type: Object,
    default: null,
  },
  place: {
    type: Object,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  warningMessages: {
    type: Array,
    default: () => [],
  },
})

// 장소 API가 제공하는 여러 행정구역 필드 중 가장 구체적인 이름을 우선 선택합니다.
const address = computed(() => props.place?.address ?? {})
const locationName = computed(
  () =>
    address.value.city ||
    address.value.town ||
    address.value.village ||
    address.value.county ||
    props.weather?.name ||
    '이름 없는 지역',
)
const regionName = computed(() =>
  [address.value.state, address.value.country].filter(Boolean).join(', '),
)
const weatherDescription = computed(() => props.weather?.weather?.[0]?.description ?? '정보 없음')
// OpenWeatherMap 아이콘 코드가 있을 때만 공식 아이콘 URL을 만듭니다.
const weatherIconUrl = computed(() => {
  const icon = props.weather?.weather?.[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
})
// API의 UTC 타임스탬프에 선택 지역의 timezone 초 오프셋을 더해 현지 시각을 표시합니다.
const localTime = computed(() => {
  if (!props.weather?.dt) return '정보 없음'

  const localTimestamp = (props.weather.dt + (props.weather.timezone ?? 0)) * 1000
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(localTimestamp))
})

// 좌표 자릿수를 통일하고 유효하지 않은 값은 안전한 대체 문자로 표시합니다.
const formatCoordinate = (value) => (Number.isFinite(value) ? value.toFixed(5) : '—')
</script>

<template>
  <!-- aria-live로 비동기 조회 결과 변경을 보조 기술 사용자에게 전달합니다. -->
  <aside class="info-panel" aria-live="polite">
    <header class="panel-header">
      <p class="eyebrow">SELECTED LOCATION</p>
      <h2>선택한 위치 정보</h2>
      <p>위치와 현재 날씨를 한눈에 확인하세요.</p>
    </header>

    <!-- 아직 지구본을 클릭하지 않은 최초 진입 상태 -->
    <div v-if="!coordinates" class="empty-state">
      <div class="empty-state__icon">◎</div>
      <strong>아직 선택한 위치가 없습니다</strong>
      <p>왼쪽 지구본에서 궁금한 곳을 클릭하면 이곳에 정보가 표시됩니다.</p>
    </div>

    <template v-else>
      <!-- API 성공 여부와 무관하게 사용자가 실제 클릭한 좌표는 즉시 유지합니다. -->
      <section class="coordinate-card">
        <p>클릭 좌표</p>
        <div class="coordinate-grid">
          <div>
            <span>LATITUDE</span>
            <strong>{{ formatCoordinate(coordinates.latitude) }}°</strong>
          </div>
          <div>
            <span>LONGITUDE</span>
            <strong>{{ formatCoordinate(coordinates.longitude) }}°</strong>
          </div>
        </div>
      </section>

      <!-- 고정 높이 패널 내부에서 조회 상태만 교체되어 지구본 크기가 흔들리지 않습니다. -->
      <div v-if="isLoading" class="loading-state">
        <span class="spinner"></span>
        위치 정보를 불러오는 중입니다
      </div>

      <p v-if="errorMessage" class="message message--error">{{ errorMessage }}</p>

      <!-- 장소 또는 날씨 중 하나만 성공해도 확보된 정보는 부분 렌더링합니다. -->
      <template v-if="!isLoading && (place || weather)">
        <section class="place-summary">
          <div>
            <p class="place-summary__label">현재 선택 지역</p>
            <h3>{{ locationName }}</h3>
            <p>{{ regionName || '지역 정보 없음' }}</p>
          </div>
          <img v-if="weatherIconUrl" :src="weatherIconUrl" :alt="weatherDescription" />
        </section>

        <dl v-if="weather" class="weather-grid">
          <div>
            <dt>현재 기온</dt>
            <dd>{{ Math.round(weather.main?.temp) }}℃</dd>
          </div>
          <div>
            <dt>체감 온도</dt>
            <dd>{{ Math.round(weather.main?.feels_like) }}℃</dd>
          </div>
          <div>
            <dt>습도</dt>
            <dd>{{ weather.main?.humidity }}%</dd>
          </div>
          <div>
            <dt>풍속</dt>
            <dd>{{ weather.wind?.speed }} m/s</dd>
          </div>
        </dl>

        <dl class="detail-list">
          <div v-if="weather">
            <dt>날씨</dt>
            <dd>{{ weatherDescription }}</dd>
          </div>
          <div v-if="weather">
            <dt>현지 시각</dt>
            <dd>{{ localTime }}</dd>
          </div>
          <div v-if="place?.display_name">
            <dt>주소</dt>
            <dd>{{ place.display_name }}</dd>
          </div>
        </dl>
      </template>

      <!-- 부분 실패는 전체 오류와 구분해 경고 목록으로 안내합니다. -->
      <ul v-if="warningMessages.length && !isLoading" class="warning-list">
        <li v-for="message in warningMessages" :key="message">{{ message }}</li>
      </ul>

      <p v-if="place" class="location-attribution">위치 정보 © OpenStreetMap contributors</p>
    </template>
  </aside>
</template>

<style scoped>
/* 지구본과 같은 높이를 유지하고 내용이 길면 패널 내부만 스크롤합니다. */
.info-panel {
  box-sizing: border-box;
  height: 610px;
  min-height: 610px;
  overflow-y: auto;
  padding: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgb(15 23 42 / 10%);
  color: #162033;
}

.panel-header {
  padding-bottom: 22px;
  border-bottom: 1px solid #e8edf3;
}

.panel-header .eyebrow,
.panel-header h2,
.panel-header p,
.empty-state p,
.coordinate-card p,
.place-summary p {
  margin: 0;
}

.panel-header .eyebrow {
  margin-bottom: 8px;
  color: #0284c7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.panel-header h2 {
  font-size: 24px;
}

.panel-header > p:last-child {
  margin-top: 7px;
  color: #64748b;
  font-size: 13px;
}

/* 선택 전 상태를 패널 중앙에서 명확하게 안내하는 빈 화면 */
.empty-state {
  display: grid;
  min-height: 400px;
  place-content: center;
  justify-items: center;
  color: #64748b;
  text-align: center;
}

.empty-state__icon {
  display: grid;
  width: 72px;
  height: 72px;
  margin-bottom: 20px;
  place-items: center;
  border: 1px solid #bae6fd;
  border-radius: 50%;
  background: #f0f9ff;
  color: #0284c7;
  font-size: 36px;
}

.empty-state strong {
  color: #334155;
  font-size: 16px;
}

.empty-state p {
  max-width: 280px;
  margin-top: 9px;
  font-size: 13px;
  line-height: 1.7;
}

.coordinate-card {
  margin-top: 22px;
  padding: 18px;
  border-radius: 16px;
  background: #f1f7fb;
}

.coordinate-card > p,
.place-summary__label {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

/* 좌표와 핵심 날씨 수치를 비교하기 쉬운 카드형 그리드 */
.coordinate-grid,
.weather-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.coordinate-grid {
  margin-top: 12px;
}

.coordinate-grid div {
  display: grid;
  gap: 5px;
}

.coordinate-grid span {
  color: #0284c7;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.coordinate-grid strong {
  font-size: 17px;
  font-variant-numeric: tabular-nums;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 42px 0;
  color: #64748b;
  font-size: 13px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #bae6fd;
  border-top-color: #0284c7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.place-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 92px;
  margin-top: 18px;
}

.place-summary h3 {
  margin: 4px 0;
  font-size: 26px;
}

.place-summary p:last-child {
  color: #64748b;
  font-size: 13px;
}

.place-summary img {
  width: 74px;
  height: 74px;
}

.weather-grid {
  margin: 8px 0 20px;
}

.weather-grid div {
  padding: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.weather-grid dt,
.detail-list dt {
  color: #64748b;
  font-size: 11px;
}

.weather-grid dd {
  margin: 7px 0 0;
  color: #0f172a;
  font-size: 19px;
  font-weight: 800;
}

.detail-list {
  margin: 0;
}

.detail-list div {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 10px;
  padding: 11px 0;
  border-top: 1px solid #edf2f7;
}

.detail-list dd {
  margin: 0;
  color: #334155;
  font-size: 12px;
  line-height: 1.5;
  text-align: right;
}

.message,
.warning-list {
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 12px;
}

.location-attribution {
  margin: 16px 0 0;
  color: #94a3b8;
  font-size: 10px;
  text-align: right;
}

.message--error {
  background: #fff1f2;
  color: #be123c;
}

.warning-list {
  margin: 14px 0 0;
  padding-left: 30px;
  background: #fffbeb;
  color: #a16207;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .info-panel {
    height: 480px;
    min-height: 480px;
  }
}
</style>
