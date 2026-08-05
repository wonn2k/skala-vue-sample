<script setup>
/**
 * 도시 한 곳의 날씨를 표현하는 재사용 카드입니다.
 * cityItem/useStoreUnit을 props로 받고, 카드 선택과 상세 요청을 커스텀 이벤트로 부모에 전달합니다.
 * pretty-button 슬롯을 열어 부모가 버튼 UI를 교체해도 카드의 상세 동작은 재사용할 수 있습니다.
 */
import { storeToRefs } from 'pinia'
import { useConfigStore } from '../../stores/configStore.js'
// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
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

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail'])

const handleDetail = (cityName, status) => {
  emit('click-detail', cityName, status)
}

const configStore = useConfigStore()
const { unitSymbol } = storeToRefs(configStore)

// 과제 단계에 따라 원본 섭씨를 유지하거나 Pinia에 저장된 단위로 변환합니다.
const displayTemp = (temp) => {
  if (props.useStoreUnit) {
    return configStore.displayTemp(temp)
  }

  return temp
}
</script>

<template>
  <!-- 카드 자체 클릭과 상세 버튼 클릭을 서로 다른 이벤트로 구분합니다. -->
  <div class="weather-card" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>
      현재 기온: {{ displayTemp(cityItem.temp ?? 0) }}{{ props.useStoreUnit ? unitSymbol : '°C' }}
    </p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움</span>
    <span v-else class="badge cool">❄️ 선선함</span>

    <!-- 부모가 슬롯을 제공하지 않으면 아래 기본 버튼을 fallback으로 사용합니다. -->
    <slot name="pretty-button" :city="cityItem" :show-detail="handleDetail">
      <button class="btn-detail" @click.stop="handleDetail(cityItem.name, cityItem.status)">
        상세보기
      </button>
    </slot>
  </div>
</template>

<style scoped>
/* 카드 컨테이너는 상세 버튼의 absolute 위치 기준점 역할도 합니다. */
.weather-card {
  background: #fff;
  border: 1px solid #dee2e6;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
/* 온도 조건에 따라 hot/cool 색상을 조합하는 상태 배지 */
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
}
.hot {
  background-color: #ff7675;
}
.cool {
  background-color: #74b9ff;
}
.btn-detail {
  position: absolute;
  right: 12px;
  top: 15px;
  padding: 6px 10px;
  cursor: pointer;
}
</style>
