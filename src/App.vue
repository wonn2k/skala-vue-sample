<script setup>
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import WeatherParentElemplus from './components/exercise/WeatherParent_elemplus.vue'
import UnitToggler from './components/exercise/UnitToggler.vue'
import AxiosWeather from './components/practices/library/AxiosWeather.vue'
import AxiosJson from './components/practices/library/AxiosJson.vue'
import TuningPoints from './components/exercise/TuningPoints.vue'
import ExerciseNav from './components/exercise/ExerciseNav.vue'
import GlobeHeader from './components/exercise/globe/GlobeHeader.vue'
</script>

<template>
  <div v-if="$route.name === 'GlobeWeather'" class="globe-route-shell">
    <GlobeHeader />
    <RouterView />
  </div>
  <div v-else class="assignment-list">
    <GlobeHeader class="assignment-header" />
    <div class="app-container">
      <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
      <hr />
      <WeatherMockup />
      <TuningPoints :assignment="1" />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 2: 날씨 (컴포지션)</h1>
      <hr />
      <WeatherComposition />
      <TuningPoints :assignment="2" />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
      <hr />
      <WeatherParent />
      <TuningPoints :assignment="3" />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 4: 라우터적용</h1>
      <hr />
      <div class="dashboard-wrapper">
        <ExerciseNav :assignment="4" />
        <main>
          <RouterView :use-store-unit="false" />
          <!-- RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView-->
        </main>
      </div>
      <TuningPoints :assignment="4" />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 5: 스토어적용</h1>
      <hr />
      <div class="dashboard-wrapper">
        <ExerciseNav :assignment="5" compact>
          <UnitToggler />
        </ExerciseNav>
        <main>
          <RouterView :use-store-unit="true" />
        </main>
      </div>
      <TuningPoints :assignment="5" />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 6: Axios 적용</h1>
      <hr />
      <AxiosWeather />
      <AxiosJson />
      <TuningPoints :assignment="6" />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 7: 과제 3에 Element Plus 적용</h1>
      <hr />
      <WeatherParentElemplus />
      <TuningPoints :assignment="7" />
    </div>
    <div class="app-container">
      <h1>⛅ 과제 8: API를 사용한 기능</h1>
      <hr />
      <RouterLink to="/" class="globe-feature-link">
        <span aria-hidden="true">🌍</span>
        지구본 메인페이지에서 API 기능 체험하기
      </RouterLink>
      <TuningPoints :assignment="8" />
    </div>
  </div>
</template>

<style>
/* ⚠️ 외부 스타일 파일(예: 버튼 디자인 뭉치)을 이 방 안으로 쏙 가리켜 가져옵니다 */
@import '@/assets/exercise.css';

#app {
  display: block;
  max-width: 1720px;
}

.assignment-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 24px;
  padding: 24px 0 40px;
}

.assignment-list .app-container {
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  min-width: 0;
  margin: 0;
}

.globe-route-shell {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 20px;
  background: #f4f8fb;
}

.assignment-header {
  grid-column: 1 / -1;
  width: min(100%, 1140px);
  margin: 0;
  justify-self: center;
}

.globe-feature-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 16px;
  border: 1px solid #bae6fd;
  border-radius: 10px;
  background: #f0f9ff;
  color: #0369a1;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.globe-feature-link:hover {
  border-color: #38bdf8;
  background: #e0f2fe;
}

@media (max-width: 1399px) {
  .assignment-list {
    grid-template-columns: minmax(0, 900px);
    justify-content: center;
  }

  .assignment-header {
    grid-column: auto;
  }
}

</style>
