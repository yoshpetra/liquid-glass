<template>
  <span class="clock-bar">{{ time }}</span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')
let intervalId = null

function updateTime() {
  time.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

onMounted(() => {
  updateTime()
  intervalId = setInterval(updateTime, 15000)
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
