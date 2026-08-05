<!--
  검색 영역과 목록 영역이 같은 외형을 공유하도록 만든 프레젠테이션 컴포넌트입니다.
  상태나 비즈니스 로직 없이 default slot의 콘텐츠를 공통 카드 표면 안에 감싸는 역할만 합니다.
-->
<template>
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
/* 슬롯 콘텐츠 종류와 관계없이 동일한 배경, 여백, 테두리를 제공합니다. */
.base-dashboard-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}
</style>
