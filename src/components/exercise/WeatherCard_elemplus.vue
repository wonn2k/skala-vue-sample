<script setup>
/**
 * Element Plus의 ElCard, ElTag, ElButton으로 구현한 도시별 날씨 카드입니다.
 * cityItem을 표시 데이터로 받고 Pinia 단위 설정을 선택적으로 적용하며, computed를 사용해
 * 온도·단위·상태 배지·날씨 아이콘을 선언적으로 파생합니다. 선택과 상세보기는 부모 이벤트로 전달합니다.
 */
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ElButton, ElCard, ElTag } from 'element-plus'
import { useConfigStore } from '../../stores/configStore.js'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  useStoreUnit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

// storeToRefs를 사용하면 구조 분해 이후에도 unitSymbol의 반응성이 유지됩니다.
const configStore = useConfigStore()
const { unitSymbol } = storeToRefs(configStore)

// 부모가 useStoreUnit을 켠 경우에만 전역 설정에 맞춰 섭씨/화씨를 변환합니다.
const displayedTemperature = computed(() => {
  const temperature = props.cityItem.temp ?? 0
  return props.useStoreUnit ? configStore.displayTemp(temperature) : temperature
})

const displayedUnit = computed(() => (props.useStoreUnit ? unitSymbol.value : '℃'))
const isHot = computed(() => (props.cityItem.temp ?? 0) >= 25)
// API 상태 문자열을 카드에서 바로 이해할 수 있는 시각 기호로 매핑합니다.
const weatherEmoji = computed(() => {
  const emojis = { 맑음: '☀️', 비: '🌧️', 구름: '☁️' }
  return emojis[props.cityItem.status] ?? '🌤️'
})

const selectCard = () => {
  // 카드 선택 결과 문구는 상태를 소유한 부모가 저장하도록 위임합니다.
  emit('select-card', `${props.cityItem.name}이 선택되었습니다.`)
}

const showDetail = () => {
  // 부모가 상세 표시 방식을 결정할 수 있도록 원본 도시명과 상태를 전달합니다.
  emit('click-detail', props.cityItem.name, props.cityItem.status)
}
</script>

<template>
  <!-- 키보드 Enter도 클릭과 같은 선택 이벤트를 발생시켜 접근성을 보완합니다. -->
  <ElCard class="weather-card" shadow="hover" tabindex="0" @click="selectCard" @keyup.enter="selectCard">
    <div class="card-content">
      <div class="weather-summary">
        <span class="weather-icon" aria-hidden="true">{{ weatherEmoji }}</span>
        <div>
          <div class="city-line">
            <h4>{{ cityItem.name }}</h4>
            <ElTag :type="isHot ? 'danger' : 'primary'" effect="light" round>
              {{ isHot ? '🔥 더움' : '❄️ 선선함' }}
            </ElTag>
          </div>
          <p class="weather-status">{{ cityItem.status }}</p>
        </div>
      </div>

      <strong class="temperature">{{ displayedTemperature }}<small>{{ displayedUnit }}</small></strong>

      <!-- 부모가 버튼을 주입하지 않은 경우 Element Plus 기본 버튼을 렌더링합니다. -->
      <slot name="pretty-button" :city="cityItem" :show-detail="showDetail">
        <ElButton type="primary" plain round @click.stop="showDetail">상세보기</ElButton>
      </slot>
    </div>
  </ElCard>
</template>

<style scoped>
/* 도시별 color 값을 왼쪽 강조선에 연결하는 반응형 카드 표면 */
.weather-card {
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
  border-left: 4px solid v-bind('cityItem.color');
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.weather-card:hover,
.weather-card:focus-visible {
  transform: translateY(-2px);
  outline: none;
}

/* 요약, 온도, 동작 버튼을 3열로 정렬하는 데스크톱 레이아웃 */
.card-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 20px;
}

.weather-summary,
.city-line {
  display: flex;
  align-items: center;
}

.weather-summary {
  min-width: 0;
  gap: 12px;
}

.weather-icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 13px;
  background: #f2f6fc;
  font-size: 25px;
}

.city-line {
  flex-wrap: wrap;
  gap: 8px;
}

h4,
.weather-status {
  margin: 0;
}

h4 {
  color: #1f2937;
  font-size: 17px;
}

.weather-status {
  margin-top: 4px;
  color: #909399;
  font-size: 13px;
}

.temperature {
  color: #303133;
  font-size: 27px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.temperature small {
  margin-left: 2px;
  color: #909399;
  font-size: 14px;
}

/* 모바일에서는 버튼을 다음 행 전체 너비로 내려 터치 영역을 확보합니다. */
@media (max-width: 540px) {
  .card-content {
    grid-template-columns: 1fr auto;
  }

  .card-content > :last-child {
    grid-column: 1 / -1;
    justify-self: stretch;
  }
}
</style>
