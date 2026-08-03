<script setup>
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

const { searchQuery, selectedCityInfo, filteredWeatherList } = useWeatherSearch(weatherList)

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="showDetail"
      >
        <template #pretty-button="{ city, showDetail }">
          <button
            class="btn-detail custom-btn"
            @click.stop="showDetail(city.name, city.status)"
            :style="{ backgroundColor: city.color, color: '#fff' }"
          >
            도시 상징색은 - {{ city.color }} (정보 더보기)
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
.dashboard-wrapper {
  width: 600px;
  margin: 0 auto;
}

.custom-btn {
  position: static;
  margin-top: 8px;
  background: #0984e3;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
