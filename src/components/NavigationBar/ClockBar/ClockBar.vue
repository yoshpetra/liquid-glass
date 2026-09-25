<template>
  <span class="clock-bar">{{ time }}</span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')
let intervalId = null

function updateTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  time.value = `${hours}:${minutes}`
}

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped>
.clock-bar {
  min-width: 42px;
}
</style>
