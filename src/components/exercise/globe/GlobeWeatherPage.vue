<script setup>
import GlobeMap from './GlobeMap.vue'
import LocationInfoPanel from './LocationInfoPanel.vue'
import TravelRecommendations from './TravelRecommendations.vue'
import { useGlobeLocation } from './useGlobeLocation.js'
import { useTravelRecommendations } from './useTravelRecommendations.js'

const {
  selectedCoordinates,
  weather,
  place,
  isLoading,
  errorMessage,
  warningMessages,
  selectLocation,
} = useGlobeLocation()

const {
  recommendation,
  isLoading: isRecommendationLoading,
  errorMessage: recommendationErrorMessage,
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
  <main class="globe-page">
    <header class="page-heading">
      <div>
        <p>EXPLORE THE WEATHER</p>
        <h1>지구본에서 날씨 찾기</h1>
      </div>
      <span>지구 어디든 클릭해 보세요</span>
    </header>

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

    <TravelRecommendations
      :recommendation="recommendation"
      :location-label="locationLabel"
      :can-request="canRequest"
      :is-loading="isRecommendationLoading"
      :error-message="recommendationErrorMessage"
      @request="requestRecommendations"
    />
  </main>
</template>

<style scoped>
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

.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.page-heading p,
.page-heading h1 {
  margin: 0;
}

.page-heading p {
  margin-bottom: 7px;
  color: #0284c7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.page-heading h1 {
  color: #0f172a;
  font-size: clamp(28px, 4vw, 40px);
  line-height: 1.2;
}

.page-heading > span {
  color: #64748b;
  font-size: 13px;
}

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
}

@media (max-width: 560px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
