<script setup>
import { computed } from 'vue'
import tuningPointsByAssignment from '@/data/tuningPoints.json'

const props = defineProps({
  assignment: {
    type: [Number, String],
    required: true,
  },
})

const tuningPoints = computed(() => tuningPointsByAssignment[String(props.assignment)] ?? [])
</script>

<template>
  <aside v-if="tuningPoints.length" class="tuning-points" aria-label="과제 튜닝 포인트">
    <h2 class="tuning-points__title">💡 튜닝 포인트</h2>
    <ul class="tuning-points__list">
      <li v-for="point in tuningPoints" :key="point">{{ point }}</li>
    </ul>
  </aside>
</template>

<style scoped>
.tuning-points {
  margin-top: 28px;
  padding: 18px 20px;
  border: 1px solid #dbeafe;
  border-left: 4px solid #3b82f6;
  border-radius: 10px;
  background: #f8fbff;
}

.tuning-points__title {
  margin: 0 0 10px;
  color: #1e3a5f;
  font-size: 1rem;
  font-weight: 700;
}

.tuning-points__list {
  display: grid;
  gap: 7px;
  margin: 0;
  padding-left: 20px;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.55;
}

.tuning-points__list li::marker {
  color: #3b82f6;
}
</style>
