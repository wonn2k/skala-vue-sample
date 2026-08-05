<script setup>
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

const configStore = useConfigStore()
const { unitSymbol } = storeToRefs(configStore)

const displayedTemperature = computed(() => {
  const temperature = props.cityItem.temp ?? 0
  return props.useStoreUnit ? configStore.displayTemp(temperature) : temperature
})

const displayedUnit = computed(() => (props.useStoreUnit ? unitSymbol.value : '℃'))
const isHot = computed(() => (props.cityItem.temp ?? 0) >= 25)
const weatherEmoji = computed(() => {
  const emojis = { 맑음: '☀️', 비: '🌧️', 구름: '☁️' }
  return emojis[props.cityItem.status] ?? '🌤️'
})

const selectCard = () => {
  emit('select-card', `${props.cityItem.name}이 선택되었습니다.`)
}

const showDetail = () => {
  emit('click-detail', props.cityItem.name, props.cityItem.status)
}
</script>

<template>
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

      <slot name="pretty-button" :city="cityItem" :show-detail="showDetail">
        <ElButton type="primary" plain round @click.stop="showDetail">상세보기</ElButton>
      </slot>
    </div>
  </ElCard>
</template>

<style scoped>
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
