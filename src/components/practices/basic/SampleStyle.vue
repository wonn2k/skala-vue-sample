<script setup>
//자바스크립트 비우기
</script>

<template>
  <div class="practice-section">
    <h2>CSS 스타일링 기초</h2>
    <p class="title">이 글자는 컴포넌트 내부에서만 빨간색이 됩니다.</p>
    <button class="btn-external">외부 CSS에서 불러온 버튼 스타일</button>
  </div>
</template>

<style scoped>
.title {
  color: #ff7675;
  font-weight: bold;
  font-size: 18px;
}
</style>
