<script setup>
import { ref } from 'vue'
const comment = ref('')
const isAgreed = ref(false)
const favoriteFruits = ref([])
/*const gender = ref('')
const selectedCar = ref('')*/
</script>

<template>
  <div class="practice-section">
    <h2>모든 HTML Form 요소와 v-model 매핑</h2>
    <div>
      <h3>1) Textarea (장문 텍스트)</h3>
      <textarea v-model="comment" placeholder="의견을 남겨주세요"></textarea>
      <p>
        데이터 상태 : <span>{{ comment }}</span>
      </p>
    </div>
    <div>
      <h3>2) 단일 Checkbox(동의 여부)</h3>
      <label>
        <input type="checkbox" v-model="isAgreed" />
        이용 약관에 동의합니다.
      </label>
      <p>
        데이터 상태 : <span>{{ isAgreed }}</span>
      </p>
    </div>
    <div>
      <h3>3) 다중 Checkbox(선택 항목)</h3>
      <label>
        <input type="checkbox" value="사과" v-model="favoriteFruits" />
        사과
      </label>
      &nbsp;
      <label>
        <input type="checkbox" value="바나나" v-model="favoriteFruits" />
        바나나
      </label>
      &nbsp;
      <label>
        <input type="checkbox" value="포도" v-model="favoriteFruits" />
        포도
      </label>
      &nbsp;
      <p>
        데이터 상태 : <span>{{ favoriteFruits }}</span>
      </p>
    </div>
  </div>
</template>
