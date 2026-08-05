<script setup>
/**
 * 과제 번호에 맞는 개선 사항을 JSON에서 찾아 목록으로 표시하는 문서형 컴포넌트입니다.
 * assignment prop이 변경되면 computed가 다시 계산되며, 항목이 없을 때는 aside 자체를 숨깁니다.
 */
import { computed } from 'vue'
import tuningPointsByAssignment from '@/data/tuningPoints.json'

const props = defineProps({
  assignment: {
    type: [Number, String],
    required: true,
  },
})

// JSON 객체의 키가 문자열이므로 숫자 prop도 문자열로 정규화합니다.
const tuningPoints = computed(() => tuningPointsByAssignment[String(props.assignment)] ?? [])
</script>

<template>
  <!-- 설명이 존재할 때만 접근성 레이블이 있는 보조 콘텐츠로 출력합니다. -->
  <aside v-if="tuningPoints.length" class="tuning-points" aria-label="과제 튜닝 포인트">
    <h2 class="tuning-points__title">💡 튜닝 포인트</h2>
    <ul class="tuning-points__list">
      <li v-for="point in tuningPoints" :key="point">{{ point }}</li>
    </ul>
  </aside>
</template>

<style scoped>
/* 본문과 시각적으로 구분되는 학습 노트 패널 */
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
