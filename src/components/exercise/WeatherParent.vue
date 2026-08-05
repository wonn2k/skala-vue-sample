<script setup>
/**
 * 검색창, 공통 카드 컨테이너, 날씨 카드를 조합하는 부모 컴포넌트입니다.
 * 날씨 원본 데이터와 선택 상태는 부모가 소유하고, 자식에는 props로 데이터를 내려보내며
 * 자식이 발생시킨 select-card/click-detail 이벤트를 받아 상태 변경과 알림을 처리합니다.
 */
import { ref } from 'vue'
// 1. 컴포넌트 파일명 국룰 표기법(PascalCase) 매칭 수입
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import { useWeatherSearch } from './useWeatherSearch.js'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', color: 'royalblue' },
  { id: 'city_02', name: '수원', temp: 24, status: '비', color: 'tomato' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', color: 'mediumseagreen' },
])

// 검색이라는 공통 비즈니스 로직은 composable에 위임하고 화면에 필요한 반응형 값만 받습니다.
const { searchQuery, selectedCityInfo, filteredWeatherList } = useWeatherSearch(weatherList)

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <!-- 부모는 자식 컴포넌트의 배치와 데이터·이벤트 연결을 담당합니다. -->
  <div class="dashboard-wrapper">
    <!-- SearchBar의 update-query 이벤트를 부모의 searchQuery에 반영합니다. -->
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!-- 필터 결과마다 카드를 만들고, 카드 이벤트를 부모의 상태/함수로 연결합니다. -->
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        :use-store-unit="false"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="showDetail"
      >
        <!-- 이름 있는 슬롯으로 기본 상세 버튼을 과제 전용 디자인으로 교체합니다. -->
        <template #pretty-button="{ city, showDetail }">
          <button
            class="btn-detail custom-btn"
            @click.stop="showDetail(city.name, city.status)"
            :style="{
              border: `1px solid ${city.color}`,
              boxShadow: `0 4px 10px ${city.color}55`,
              color: '#1f2937',
              backgroundColor: '#fff',
            }"
          >
            상세보기
          </button>
        </template>
      </WeatherCard>

      <p
        v-if="filteredWeatherList.length === 0"
        style="text-align: center; color: #e74c3c; padding: 10px 0"
      >
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
/* 대시보드 전체 폭과 가운데 정렬을 담당하는 페이지 레이아웃 */
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}

/* 슬롯을 통해 주입한 상세 버튼의 위치와 상호작용 표현 */
.custom-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0;
  padding: 8px 14px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.custom-btn:hover {
  transform: translateY(calc(-50% - 1px));
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.22);
}
</style>
