<template>
  <div
    class="app-root"
    :data-size="store.appliedSizeMode"
    :data-glass="store.isLiquidGlass ? 'on' : 'off'"
  >
    <div class="pulsating-bg"></div>
    <div class="hello-text" :class="{ 'hello-text-visible': store.showHello }">Hello :)</div>
    <LiquidGlassContainer />
    <Statistics v-if="showStatistics" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LiquidGlassContainer from './components/LiquidGlassContainer.vue'
import Statistics from './components/Statistics.vue'
import { useLiquidGlassStore } from './stores/liquidGlass'
import { shouldShowFpsMeter } from './utils/env'

const store = useLiquidGlassStore()

const SECRET_CODE = 'wubby'
let secretBuffer = ''
const showStatistics = ref(shouldShowFpsMeter())

function handleKeydown(event) {
  if (event.code === 'Space') {
    event.preventDefault()
    store.toggleLiquidGlass()
  }

  if (event.key.length === 1) {
    secretBuffer = (secretBuffer + event.key.toLowerCase()).slice(-SECRET_CODE.length)
    if (secretBuffer === SECRET_CODE) {
      showStatistics.value = !showStatistics.value
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  console.log("Type 'wubby' for a secret! :D")

  store.startIntro()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)

  store.stopIntro()
})
</script>
