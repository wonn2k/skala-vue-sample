<script setup>
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
  <nav
    class="navigation-bar"
    :class="{ 'navigation-bar--with-unit': compact }"
    :aria-label="`과제 ${assignment} 날씨 서비스 메뉴`"
  >
    <div class="navigation-links">
      <RouterLink to="/" class="nav-item" :class="dashboardLinkClass">
        🌦️ 날씨 대시보드
      </RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
      <template v-if="assignment >= 7">
        <span class="divider">|</span>
        <RouterLink to="/globe" class="nav-item">🌍 지구본에서 찾기</RouterLink>
      </template>
    </div>
    <slot />
  </nav>
</template>

<style scoped>
.navigation-links {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

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
