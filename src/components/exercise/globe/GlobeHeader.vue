<!--
  지구본 서비스 전용 전역 헤더입니다.
  브랜드 링크와 주요 라우트 두 개를 RouterLink로 연결하며, 현재 경로는 Vue Router가 제공하는
  router-link-exact-active 클래스로 강조합니다. 별도 script 상태 없이 라우터 상태만으로 동작합니다.
-->
<template>
  <!-- 브랜드를 클릭하면 언제든 지구본 메인(/)으로 돌아갑니다. -->
  <header class="globe-header">
    <RouterLink to="/" class="globe-brand" aria-label="지구본 날씨 홈">
      <span class="globe-brand__icon" aria-hidden="true"></span>
      <span>
        <small>WORLD WEATHER</small>
        <strong>Weather Globe</strong>
      </span>
    </RouterLink>

    <!-- 지구본과 과제 모음 사이를 SPA 방식으로 이동하는 주 내비게이션 -->
    <nav class="globe-header__nav" aria-label="주요 페이지">
      <RouterLink to="/" class="globe-header__link">
        <span aria-hidden="true">01</span> 지구본 날씨
      </RouterLink>
      <RouterLink to="/assignments" class="globe-header__link">
        <span aria-hidden="true">02</span> 실습 과제 &amp; 튜닝
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
/* 밝은 본문 위에서 서비스 정체성을 구분하는 어두운 반응형 헤더 */
.globe-header {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(100%, 1140px);
  margin: 0 auto 22px;
  padding: 12px 14px 12px 16px;
  border: 1px solid rgb(148 210 255 / 14%);
  border-radius: 18px;
  background: linear-gradient(120deg, #07182b 0%, #0b2842 100%);
  box-shadow: 0 16px 40px rgb(2 12 27 / 18%);
  backdrop-filter: blur(14px);
}

.globe-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  color: #f8fafc;
}

.globe-brand:hover,
.globe-header__link:hover {
  background: transparent;
}

/* 별도 이미지 요청 없이 CSS 그라데이션으로 만든 지구본 브랜드 아이콘 */
.globe-brand__icon {
  position: relative;
  width: 39px;
  height: 39px;
  overflow: hidden;
  border: 1px solid rgb(186 230 253 / 45%);
  border-radius: 50%;
  background:
    radial-gradient(circle at 68% 33%, #a7f3d0 0 13%, transparent 14%),
    radial-gradient(circle at 38% 65%, #6ee7b7 0 18%, transparent 19%),
    linear-gradient(145deg, #38bdf8, #0369a1);
  box-shadow: 0 0 22px rgb(56 189 248 / 28%);
}

.globe-brand__icon::after {
  position: absolute;
  inset: 7px -4px;
  border: 1px solid rgb(255 255 255 / 35%);
  border-radius: 50%;
  content: '';
  transform: rotate(58deg);
}

.globe-brand > span:last-child {
  display: grid;
  gap: 1px;
}

.globe-brand strong {
  font-size: 15px;
  letter-spacing: -0.01em;
}

.globe-brand small {
  color: #7dd3fc;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.13em;
}

/* 현재 링크 강조 배경을 포함하는 캡슐형 내비게이션 컨테이너 */
.globe-header__nav {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid rgb(148 210 255 / 10%);
  border-radius: 12px;
  background: rgb(255 255 255 / 5%);
}

.globe-header__link {
  padding: 9px 13px;
  border-radius: 9px;
  color: #b6c9da;
  font-size: 11px;
  font-weight: 700;
}

.globe-header__link span {
  margin-right: 5px;
  color: #38bdf8;
  font-size: 8px;
  letter-spacing: 0.08em;
}

.globe-header__link.router-link-exact-active {
  background: #ffffff;
  box-shadow: 0 4px 14px rgb(2 12 27 / 22%);
  color: #0c2942;
}

/* 모바일에서는 브랜드와 메뉴를 두 줄로 배치하고 링크 폭을 균등 분배합니다. */
@media (max-width: 620px) {
  .globe-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 13px;
  }

  .globe-header__nav {
    width: 100%;
  }

  .globe-header__link {
    flex: 1;
    text-align: center;
  }
}
</style>
