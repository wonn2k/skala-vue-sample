<script setup>
import SlotScopedChild from './SlotScopedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Scoped Slot 주입 실습</h2>
    <SlotScopedChild v-slot="slotBag">
      <div class="display-panel">
        <h3>{{ slotBag.text }}</h3>
        <p>현재 사용자 수: {{ slotBag.count }}</p>
      </div>
    </SlotScopedChild>
    <SlotScopedChild> </SlotScopedChild>
  </div>
</template>

<style scoped>
.display-panel {
  background-color: #fdf2e9;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
}
</style>
