<script setup></script>

<template>
  <div class="about-wrapper">
    <h2>Weather About</h2>
    <p>이 페이지는 과제용 날씨 앱의 소개 화면입니다.</p>

    <p>다 읽으셨으면 돌아가시죠 <RouterLink to="/" class="back-link">네</RouterLink></p>
  </div>
</template>

<style scoped>
.about-wrapper {
  max-width: 480px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  background: #fff;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  color: #0984e3;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
