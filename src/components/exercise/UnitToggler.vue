<script setup>
/**
 * Pinia configStore의 온도 단위를 읽고 전환하는 전역 설정 제어 컴포넌트입니다.
 * 여러 날씨 카드가 같은 store를 참조하므로 버튼 한 번으로 모든 표시 단위를 일관되게 바꿀 수 있습니다.
 */
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <!-- 현재 store 값은 텍스트로 안내하고, 클릭 시 store action을 호출합니다. -->
  <div class="unit-toggler">
    <span>날씨단위: {{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</span>
    <button class="toggle-btn" @click="configStore.toggleUnit">단위변경</button>
  </div>
</template>

<style scoped>
/* 내비게이션 한 줄 안에서 크기가 줄지 않는 단위 제어 묶음 */
.unit-toggler {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  font-size: 12px;
  white-space: nowrap;
}

.toggle-btn {
  padding: 6px 9px;
  background-color: #4b6584;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}
</style>
