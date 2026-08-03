<script setup>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue'

const count = ref(0)
let timerId = null

console.log('1. LifeCycleComponent setup')

onMounted(() => {
  console.log('2. LifeCycleComponent onMounted')
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

onUpdated(() => {
  console.log('3. LifeCycleComponent onUpdated. 현재 count : ${count.value}')
})

onUnmounted(() => {
  console.log('4. LifeCycleComponent onUnmounted')
  clearInterval(timerId)
})
</script>
