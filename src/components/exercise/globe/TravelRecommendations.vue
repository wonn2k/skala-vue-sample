<script setup>
defineProps({
  recommendation: { type: Object, default: null },
  locationLabel: { type: String, default: '' },
  canRequest: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },
})

defineEmits(['request'])
</script>

<template>
  <section class="recommendation-section" aria-labelledby="recommendation-title">
    <header class="recommendation-header">
      <div>
        <p class="eyebrow">GEMINI TRAVEL GUIDE</p>
        <h2 id="recommendation-title">현재 날씨에 맞춘 여행 가이드</h2>
        <p>선택한 지역의 날씨를 고려해 관광지와 여행 복장을 추천합니다.</p>
        <p v-if="locationLabel" class="selected-place">선택 지역 · {{ locationLabel }}</p>
      </div>
      <button
        type="button"
        class="request-button"
        :disabled="!canRequest || isLoading"
        @click="$emit('request')"
      >
        <span v-if="isLoading" class="button-spinner" aria-hidden="true"></span>
        {{ isLoading ? '추천을 준비하는 중...' : recommendation ? '다시 추천받기' : 'AI 추천받기' }}
      </button>
    </header>

    <p v-if="!locationLabel" class="helper-message">
      지구본에서 위치를 선택하고 날씨 조회가 끝나면 추천받을 수 있습니다.
    </p>
    <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

    <div v-if="isLoading" class="loading-state">
      <span class="large-spinner" aria-hidden="true"></span>
      <strong>날씨와 여행지를 함께 살펴보고 있습니다</strong>
      <p>잠시만 기다려 주세요.</p>
    </div>

    <template v-else-if="recommendation">
      <p class="recommendation-summary">{{ recommendation.summary }}</p>

      <div class="recommendation-grid">
        <div class="destination-area">
          <h3>추천 관광지</h3>
          <ol class="destination-list">
            <li
              v-for="(destination, index) in recommendation.destinations"
              :key="destination.name"
            >
              <div class="destination-card__top">
                <span class="destination-number">0{{ index + 1 }}</span>
                <div class="destination-title">
                  <strong>{{ destination.name }}</strong>
                  <span>{{ destination.type }}</span>
                </div>
              </div>
              <p>{{ destination.reason }}</p>
              <div class="weather-tip">
                <span aria-hidden="true">☂</span>
                <small><strong>날씨 팁</strong>{{ destination.weatherTip }}</small>
              </div>
            </li>
          </ol>
        </div>

        <aside class="outfit-card">
          <div class="outfit-icon" aria-hidden="true">✦</div>
          <p class="outfit-label">WEATHER OUTFIT</p>
          <h3>추천 복장</h3>
          <p>{{ recommendation.outfit.overview }}</p>
          <ul>
            <li v-for="item in recommendation.outfit.items" :key="item">{{ item }}</li>
          </ul>
          <p class="outfit-caution">{{ recommendation.outfit.caution }}</p>
        </aside>
      </div>
    </template>

    <div v-else class="empty-recommendation">
      <span>✦</span>
      <strong>Gemini 여행 가이드</strong>
      <p>AI 추천받기 버튼을 누르면 관광지와 복장 추천이 이곳에 표시됩니다.</p>
    </div>
  </section>
</template>

<style scoped>
.recommendation-section {
  margin-top: 24px;
  padding: 34px;
  border: 1px solid #dce8f1;
  border-radius: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #eef8ff 100%);
  box-shadow: 0 20px 50px rgb(15 23 42 / 8%);
}

.recommendation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.recommendation-header p,
.recommendation-header h2 {
  margin: 0;
}

.recommendation-header .eyebrow {
  margin-bottom: 9px;
  color: #0284c7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.recommendation-header h2 {
  color: #0f172a;
  font-size: clamp(22px, 3vw, 30px);
}

.recommendation-header h2 + p {
  margin-top: 8px;
  color: #64748b;
  font-size: 13px;
}

.selected-place {
  margin-top: 8px !important;
  color: #0369a1 !important;
  font-weight: 700;
}

.request-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-width: 154px;
  padding: 13px 18px;
  border: 0;
  border-radius: 12px;
  background: #0369a1;
  box-shadow: 0 10px 24px rgb(3 105 161 / 20%);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
}

.request-button:disabled {
  background: #94a3b8;
  box-shadow: none;
  cursor: not-allowed;
}

.button-spinner,
.large-spinner {
  border: 2px solid rgb(255 255 255 / 40%);
  border-top-color: currentcolor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.button-spinner {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}

.helper-message,
.error-message {
  margin: 18px 0 0;
  font-size: 12px;
}

.helper-message {
  color: #64748b;
}

.error-message {
  color: #be123c;
}

.loading-state,
.empty-recommendation {
  display: grid;
  min-height: 260px;
  margin-top: 24px;
  place-content: center;
  justify-items: center;
  border: 1px dashed #bae6fd;
  border-radius: 18px;
  background: rgb(240 249 255 / 65%);
  color: #64748b;
  text-align: center;
}

.large-spinner {
  width: 28px;
  height: 28px;
  margin-bottom: 16px;
  border-color: #bae6fd;
  border-top-color: #0284c7;
}

.loading-state p,
.empty-recommendation p {
  margin: 7px 0 0;
  font-size: 12px;
}

.empty-recommendation span {
  margin-bottom: 12px;
  color: #0284c7;
  font-size: 34px;
}

.recommendation-summary {
  margin: 24px 0 0;
  padding: 17px 20px;
  border: 1px solid #bae6fd;
  border-left: 4px solid #0ea5e9;
  border-radius: 4px 14px 14px 4px;
  background: #f0f9ff;
  color: #1e3a5f;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.75;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 22px;
  margin-top: 22px;
}

.destination-area > h3,
.outfit-card h3 {
  margin: 0;
  color: #0f172a;
  font-size: 17px;
  font-weight: 800;
}

.destination-list {
  display: grid;
  gap: 12px;
  margin: 13px 0 0;
  padding: 0;
  list-style: none;
}

.destination-list li {
  padding: 18px;
  border: 1px solid #d8e5ee;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 22px rgb(15 23 42 / 5%);
  color: #334155;
}

.destination-card__top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.destination-number {
  display: grid;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 10px;
  background: #08243c;
  color: #7dd3fc;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.destination-title {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.destination-title strong {
  color: #0f172a;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.35;
}

.destination-title span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 10px;
  font-weight: 800;
}

.destination-list p {
  margin: 13px 0;
  color: #40516a;
  font-size: 12px;
  line-height: 1.7;
}

.weather-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f0f9ff;
  color: #0369a1;
}

.weather-tip > span {
  line-height: 1.4;
}

.weather-tip small {
  color: #245878;
  font-size: 10px;
  line-height: 1.55;
}

.weather-tip small strong {
  margin-right: 7px;
  color: #0369a1;
  font-weight: 800;
}

.outfit-card {
  align-self: stretch;
  padding: 24px;
  border: 1px solid rgb(125 211 252 / 13%);
  border-radius: 18px;
  background:
    radial-gradient(circle at 100% 0%, rgb(14 165 233 / 17%), transparent 34%),
    #071a2d;
  box-shadow: 0 14px 30px rgb(2 12 27 / 14%);
  color: #d9e8f5;
}

.outfit-icon {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgb(125 211 252 / 30%);
  border-radius: 12px;
  background: rgb(14 165 233 / 10%);
  color: #7dd3fc;
  font-size: 18px;
}

.outfit-label {
  margin: 8px 0 6px;
  color: #38bdf8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.outfit-card h3 {
  color: #ffffff;
}

.outfit-card > p:not(.outfit-label) {
  color: #c7d7e6;
  font-size: 12px;
  line-height: 1.65;
}

.outfit-card ul {
  display: grid;
  gap: 8px;
  margin: 16px 0;
  padding: 14px 0;
  border-top: 1px solid rgb(148 163 184 / 18%);
  border-bottom: 1px solid rgb(148 163 184 / 18%);
  font-size: 12px;
  list-style: none;
}

.outfit-card li {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  color: #f1f5f9;
  line-height: 1.55;
}

.outfit-card li::before {
  color: #38bdf8;
  content: '✓';
  font-weight: 800;
}

.outfit-caution {
  margin-bottom: 0;
  padding: 11px 12px;
  border-radius: 10px;
  background: rgb(56 189 248 / 9%);
  color: #bae6fd !important;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 800px) {
  .recommendation-section {
    padding: 24px;
  }

  .recommendation-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .recommendation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
