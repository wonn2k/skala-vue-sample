<script setup>
/**
 * 기본 날씨 대시보드를 Element Plus 컴포넌트로 개선한 부모 화면입니다.
 * 검색/선택 로직은 useWeatherSearch로 재사용하고 ElInput, ElCard, ElEmpty, ElAlert로
 * 입력·목록·빈 결과·상태 피드백을 일관된 디자인 시스템으로 표현합니다.
 * Element Plus 사용 범위를 과제 조건에 맞게 이 파일과 WeatherCard_elemplus.vue로 제한합니다.
 */
import { ref } from 'vue'
import { ElAlert, ElButton, ElCard, ElEmpty, ElInput, ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import WeatherCardElemplus from './WeatherCard_elemplus.vue'
import { useWeatherSearch } from './useWeatherSearch.js'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', color: 'royalblue' },
  { id: 'city_02', name: '수원', temp: 24, status: '비', color: 'tomato' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', color: 'mediumseagreen' },
])

// UI 라이브러리와 무관한 검색 비즈니스 로직은 기존 composable을 그대로 재사용합니다.
const { searchQuery, selectedCityInfo, filteredWeatherList } = useWeatherSearch(weatherList)

const showDetail = (cityName, status) => {
  // 브라우저 alert 대신 닫을 수 있는 비차단형 Element Plus 메시지로 상세 상태를 알립니다.
  ElMessage({
    message: `${cityName}의 현재 날씨는 [${status}] 상태입니다.`,
    type: 'info',
    showClose: true,
  })
}
</script>

<template>
  <!-- 검색, 결과 목록, 현재 선택 상태의 세 구역으로 구성된 대시보드 -->
  <section class="weather-dashboard" aria-labelledby="weather-title">
    <!-- v-model로 composable의 searchQuery와 Element Plus 입력을 양방향 연결합니다. -->
    <ElCard class="search-panel" shadow="never">
      <div class="heading-row">
        <div>
          <p class="eyebrow">WEATHER DASHBOARD</p>
          <h3 id="weather-title">지역별 날씨 현황</h3>
        </div>
        <span class="city-count">{{ filteredWeatherList.length }}개 도시</span>
      </div>

      <ElInput
        v-model="searchQuery"
        size="large"
        clearable
        aria-label="도시 검색"
        placeholder="검색할 도시 이름을 입력하세요"
      >
        <template #prefix>🔍</template>
      </ElInput>
      <p class="search-caption">
        {{ searchQuery ? `“${searchQuery}” 검색 결과` : '도시 카드를 선택해 상세 날씨를 확인하세요.' }}
      </p>
    </ElCard>

    <!-- 필터 결과 변경을 보조 기술에도 전달하는 동적 목록 영역 -->
    <div class="weather-list" aria-live="polite">
      <!-- 각 도시 데이터는 prop으로, 사용자 동작은 event로 연결합니다. -->
      <WeatherCardElemplus
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        :use-store-unit="false"
        @select-card="(message) => (selectedCityInfo = message)"
        @click-detail="showDetail"
      >
        <!-- scoped slot이 제공한 도시와 함수를 이용해 카드 버튼을 사용자화합니다. -->
        <template #pretty-button="{ city, showDetail: openDetail }">
          <ElButton
            round
            :style="{ '--el-button-hover-border-color': city.color, '--el-button-hover-text-color': city.color }"
            @click.stop="openDetail"
          >
            상세보기
          </ElButton>
        </template>
      </WeatherCardElemplus>

      <!-- 결과가 없을 때 빈 공간 대신 원인을 설명하는 명시적 empty state를 제공합니다. -->
      <ElEmpty
        v-if="filteredWeatherList.length === 0"
        :image-size="88"
        description="검색 결과와 일치하는 도시가 없습니다."
      />
    </div>

    <!-- 카드 선택 결과를 화면에 계속 유지하는 상태 피드백 -->
    <ElAlert :title="selectedCityInfo" type="success" :closable="false" show-icon />
  </section>
</template>

<style scoped>
/* Element Plus 카드들을 담는 반응형 최대 폭 컨테이너 */
.weather-dashboard {
  box-sizing: border-box;
  width: min(100%, 640px);
  margin: 0 auto;
}

/* 검색 영역은 목록 카드와 구분되는 부드러운 그라데이션을 사용합니다. */
.search-panel {
  margin-bottom: 16px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f5f7fa 100%);
}

.heading-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.eyebrow,
h3,
.search-caption {
  margin: 0;
}

.eyebrow {
  margin-bottom: 5px;
  color: #409eff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

h3 {
  color: #1f2937;
  font-size: 22px;
}

.city-count {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgb(255 255 255 / 72%);
  color: #606266;
  font-size: 12px;
  white-space: nowrap;
}

.search-caption {
  min-height: 18px;
  margin-top: 9px;
  color: #73767a;
  font-size: 12px;
}

/* 결과가 없어도 상태 전환 시 전체 화면 높이가 급격히 흔들리지 않게 합니다. */
.weather-list {
  min-height: 180px;
}

/* scoped 경계를 넘어 Element Plus 내부 엘리먼트의 모서리만 조정합니다. */
:deep(.el-input__wrapper) {
  border-radius: 12px;
}

:deep(.el-alert) {
  border-radius: 12px;
}
</style>
