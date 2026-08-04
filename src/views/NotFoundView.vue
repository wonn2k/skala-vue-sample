<template>
  <section class="not-found">
    <div class="container">
      <h1>404</h1>
      <p>Page Not Found</p>
      <router-link to="/">Go to Home</router-link>
    </div>
  </section>
</template>

<script setup>
// simple NotFound view
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  color: #333;
}
.container {
  text-align: center;
}
h1 {
  font-size: 6rem;
  margin: 0;
}
p {
  margin: 0.5rem 0 1.5rem;
  font-size: 1.25rem;
}
a {
  color: #42b983;
  text-decoration: none;
  font-weight: 600;
}
</style>
