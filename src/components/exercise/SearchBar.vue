<script setup>
/**
 * 검색어 입력만 담당하는 제어 컴포넌트입니다.
 * currentQuery를 직접 수정하지 않고 update-query 이벤트를 발생시켜 단방향 데이터 흐름을 지킵니다.
 * 따라서 실제 검색 상태와 필터링 책임은 이 컴포넌트를 사용하는 부모에게 있습니다.
 */
// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록 (매크로)
defineEmits(['update-query'])

// 2. 상위로부터 현재 검색 상태 값을 수신 (한글 동기화 상태 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <!-- input의 현재 값은 prop에서 받고, 입력 값은 이벤트 payload로 부모에 올립니다. -->
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <input type="text" :value="currentQuery" @input="$emit('update-query', $event.target.value)" placeholder="검색할 도시 이름 입력" />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>
