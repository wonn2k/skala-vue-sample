<script setup>
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import WeatherParentElemplus from './components/exercise/WeatherParent_elemplus.vue'
import UnitToggler from './components/exercise/UnitToggler.vue'
import AxiosWeather from './components/practices/library/AxiosWeather.vue'
import AxiosJson from './components/practices/library/AxiosJson.vue'
import TuningPoints from './components/exercise/TuningPoints.vue'
</script>

<template>
  <div v-if="$route.name === 'GlobeWeather'" class="globe-route-shell">
    <nav class="navigation-bar globe-navigation" aria-label="날씨 서비스 메뉴">
      <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/globe" class="nav-item">🌍 지구본에서 찾기</RouterLink>
    </nav>
    <RouterView />
  </div>
  <div v-else class="assignment-list">
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
        <nav class="navigation-bar">
          <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
          <span class="divider">|</span>
          <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
          <span class="divider">|</span>
          <RouterLink to="/globe" class="nav-item">🌍 지구본에서 찾기</RouterLink>
        </nav>
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
        <nav class="navigation-bar navigation-bar--with-unit">
          <div class="navigation-links">
            <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
            <span class="divider">|</span>
            <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
            <span class="divider">|</span>
            <RouterLink to="/globe" class="nav-item">🌍 지구본에서 찾기</RouterLink>
          </div>
          <UnitToggler />
        </nav>
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
      <h1>⛅ 과제 8: 과제 7에 라우터 적용</h1>
      <hr />
      <div class="dashboard-wrapper">
        <nav class="navigation-bar" aria-label="과제 8 날씨 서비스 메뉴">
          <RouterLink to="/" class="nav-item assignment-8-dashboard-link">🌦️ 날씨 대시보드</RouterLink>
          <span class="divider">|</span>
          <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
          <span class="divider">|</span>
          <RouterLink to="/globe" class="nav-item">🌍 지구본에서 찾기</RouterLink>
        </nav>
        <WeatherParentElemplus />
      </div>
      <TuningPoints :assignment="8" />
    </div>
  </div>
</template>

<style>
/* ⚠️ 외부 스타일 파일(예: 버튼 디자인 뭉치)을 이 방 안으로 쏙 가리켜 가져옵니다 */
@import '@/assets/exercise.css';

.globe-route-shell {
  box-sizing: border-box;
  min-height: 100vh;
  padding: 20px;
  background: #f4f8fb;
}

.globe-navigation {
  width: min(100% - 20px, 1140px);
  margin: 0 auto;
}

.assignment-8-dashboard-link {
  font-size: 15px;
}

.navigation-bar--with-unit {
  justify-content: space-between;
  gap: 14px;
  padding: 12px 14px;
}

.navigation-links {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.navigation-bar--with-unit .nav-item {
  font-size: 14px;
  white-space: nowrap;
}

.navigation-bar--with-unit .divider {
  margin: 0;
}
</style>
