<script setup>
/**
 * 지구본 날씨 기능의 페이지 조합(root) 컴포넌트입니다.
 * useGlobeLocation이 좌표·날씨·장소 조회를, useTravelRecommendations가 Gemini 추천을 담당하고,
 * 이 컴포넌트는 두 composable의 상태를 지도·정보 패널·추천 UI에 연결하는 오케스트레이션 역할을 합니다.
 */
import GlobeMap from './GlobeMap.vue'
import LocationInfoPanel from './LocationInfoPanel.vue'
import TravelRecommendations from './TravelRecommendations.vue'
import { useGlobeLocation } from './useGlobeLocation.js'
import { useTravelRecommendations } from './useTravelRecommendations.js'

// 지구본 선택에서 시작되는 위치/날씨 조회 상태와 액션입니다.
const {
  selectedCoordinates,
  weather,
  place,
  isLoading,
  errorMessage,
  warningMessages,
  selectLocation,
} = useGlobeLocation()

// 위치 조회 결과를 입력으로 사용하는 AI 여행 추천 상태와 액션입니다.
const {
  recommendation,
  isLoading: isRecommendationLoading,
  errorMessage: recommendationErrorMessage,
  errorCode: recommendationErrorCode,
  cooldownSeconds,
  willAutoRetry,
  canRequest,
  locationLabel,
  requestRecommendations,
} = useTravelRecommendations({
  coordinates: selectedCoordinates,
  weather,
  place,
})
</script>

<template>
  <!-- 소개 히어로 → 지도/정보 2열 → AI 추천 순서로 사용자 여정을 구성합니다. -->
  <main class="globe-page">
    <!-- 서비스 목적과 지구본 조작 방법을 처음 방문한 사용자에게 안내합니다. -->
    <header class="weather-hero">
      <div class="weather-hero__copy">
        <p><span></span> WEATHER AROUND THE WORLD</p>
        <h1>Explore the <em>Weather.</em></h1>
        <div class="weather-hero__description">
          <span></span>
          <p>지구 위 원하는 곳을 선택하고, 실시간 날씨와 AI 여행 가이드를 만나보세요.</p>
        </div>
        <ul class="feature-list" aria-label="주요 기능">
          <li>3D GLOBE</li>
          <li>LIVE WEATHER</li>
          <li>GEMINI GUIDE</li>
        </ul>
      </div>
      <div class="weather-hero__guide">
        <span>01</span>
        <div>
          <strong>지구 어디든 클릭해 보세요</strong>
          <p>드래그로 회전하고 스크롤로 확대할 수 있습니다.</p>
        </div>
      </div>
    </header>

    <!-- 지도 이벤트는 페이지에서 받고, 조회 결과는 우측 패널 props로 전달합니다. -->
    <div class="globe-layout">
      <GlobeMap @select-location="selectLocation" />
      <LocationInfoPanel
        :coordinates="selectedCoordinates"
        :weather="weather"
        :place="place"
        :is-loading="isLoading"
        :error-message="errorMessage"
        :warning-messages="warningMessages"
      />
    </div>

    <!-- 날씨 조회가 완료된 뒤 활성화되는 별도의 Gemini 추천 단계 -->
    <TravelRecommendations
      :recommendation="recommendation"
      :location-label="locationLabel"
      :can-request="canRequest"
      :is-loading="isRecommendationLoading"
      :error-message="recommendationErrorMessage"
      :error-code="recommendationErrorCode"
      :cooldown-seconds="cooldownSeconds"
      :will-auto-retry="willAutoRetry"
      @request="requestRecommendations"
    />
  </main>
</template>

<style scoped>
/* 페이지 최대 폭, 기본 글꼴, 상하 여백을 정의하는 최상위 레이아웃 */
.globe-page {
  width: min(1180px, calc(100vw - 40px));
  margin: 0 auto;
  padding: 34px 0 56px;
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    sans-serif;
}

/* 서비스 소개와 조작 가이드를 양쪽에 배치한 히어로 카드 */
.weather-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  overflow: hidden;
  margin-bottom: 22px;
  padding: 34px 36px;
  border: 1px solid #dbeaf4;
  border-radius: 22px;
  background:
    radial-gradient(circle at 82% 15%, rgb(56 189 248 / 16%), transparent 26%),
    linear-gradient(120deg, #ffffff 0%, #f1f9ff 100%);
}

.weather-hero::after {
  position: absolute;
  top: -80px;
  right: -45px;
  width: 190px;
  height: 190px;
  border: 1px solid rgb(14 165 233 / 12%);
  border-radius: 50%;
  content: '';
  box-shadow: 0 0 0 28px rgb(14 165 233 / 4%);
}

.weather-hero p,
.weather-hero h1,
.feature-list {
  margin: 0;
}

.weather-hero__copy > p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
  color: #0284c7;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.17em;
}

.weather-hero__copy > p span {
  width: 19px;
  height: 1px;
  background: #38bdf8;
}

.weather-hero h1 {
  color: #0f172a;
  font-size: clamp(34px, 4.5vw, 54px);
  letter-spacing: -0.055em;
  line-height: 1.05;
}

.weather-hero h1 em {
  color: #0284c7;
  font-style: normal;
}

.weather-hero__description {
  display: flex;
  align-items: stretch;
  gap: 12px;
  max-width: 520px;
  margin-top: 17px;
}

.weather-hero__description > span {
  width: 2px;
  border-radius: 2px;
  background: #bae6fd;
}

.weather-hero__description p {
  color: #64748b;
  font-size: 12px;
  line-height: 1.7;
}

.feature-list {
  display: flex;
  gap: 18px;
  margin-top: 18px;
  padding: 0;
  color: #64748b;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.1em;
  list-style: none;
}

.feature-list li::before {
  margin-right: 6px;
  color: #38bdf8;
  content: '•';
}

.weather-hero__guide {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 0 0 290px;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid rgb(14 116 144 / 12%);
  border-radius: 15px;
  background: rgb(255 255 255 / 72%);
  box-shadow: 0 12px 30px rgb(14 116 144 / 8%);
}

.weather-hero__guide > span {
  display: grid;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 11px;
  background: #08243c;
  color: #7dd3fc;
  font-size: 10px;
  font-weight: 800;
}

.weather-hero__guide strong {
  color: #1e293b;
  font-size: 12px;
}

.weather-hero__guide p {
  margin-top: 4px;
  color: #94a3b8;
  font-size: 9px;
  line-height: 1.5;
}

/* 지구본과 정보 패널의 핵심 2열 작업 공간 */
.globe-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(330px, 0.75fr);
  gap: 22px;
}

@media (max-width: 900px) {
  .globe-page {
    width: min(100% - 24px, 680px);
  }

  .globe-layout {
    grid-template-columns: 1fr;
  }

  .weather-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .weather-hero__guide {
    box-sizing: border-box;
    flex-basis: auto;
    width: 100%;
  }
}

@media (max-width: 560px) {
  .weather-hero {
    padding: 26px 22px;
  }

  .feature-list {
    flex-wrap: wrap;
    gap: 10px 14px;
  }
}
</style>
