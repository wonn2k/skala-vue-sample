<script setup>
/**
 * 실습 과제 화면들이 공유하는 내비게이션 컴포넌트입니다.
 * assignment는 접근성 문구에, compact는 단위 조절기가 함께 있을 때의 압축 배치에 사용됩니다.
 * 기본 링크 뒤의 default slot에는 UnitToggler 같은 과제별 제어 요소를 삽입할 수 있습니다.
 */
defineProps({
  assignment: {
    type: Number,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  dashboardLinkClass: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <!-- RouterLink를 사용해 새로고침 없이 과제와 소개 화면 사이를 이동합니다. -->
  <nav
    class="navigation-bar"
    :class="{ 'navigation-bar--with-unit': compact }"
    :aria-label="`과제 ${assignment} 날씨 서비스 메뉴`"
  >
    <div class="navigation-links">
      <RouterLink to="/assignments" class="nav-item" :class="dashboardLinkClass">
        🌦️ 날씨 대시보드
      </RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
    </div>
    <!-- 과제별 추가 제어 UI가 들어오는 확장 지점 -->
    <slot />
  </nav>
</template>

<style scoped>
/* 링크 묶음은 좁은 화면에서도 항목 간 간격을 일정하게 유지합니다. */
.navigation-links {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

/* compact 모드에서는 링크와 슬롯 콘텐츠를 양 끝에 배치합니다. */
.navigation-bar--with-unit {
  justify-content: space-between;
  gap: 14px;
  padding: 12px 14px;
}

.navigation-bar--with-unit .nav-item {
  font-size: 14px;
  white-space: nowrap;
}

.navigation-bar--with-unit .divider {
  margin: 0;
}
</style>
