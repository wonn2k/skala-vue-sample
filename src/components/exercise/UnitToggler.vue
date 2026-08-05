<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span>날씨단위: {{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</span>
    <button class="toggle-btn" @click="configStore.toggleUnit">단위변경</button>
  </div>
</template>

<style scoped>
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
