<template>
  <div
    class="pulsating-bg"
    :class="{ 'pulsating-bg-active': store.isLiquidGlass, 'size-tablet': store.sizeMode === 'tablet' }"
  ></div>
  <div class="hello-text" :class="{ 'hello-text-visible': store.showHello }">Hello :)</div>
  <LiquidGlassContainer />
  <Statistics v-if="showStatistics" />
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

function handleWheel(event) {
  store.handleWheel(event.deltaX, event.deltaY)
}

function handleTouchStart(event) {
  store.handleTouchStart(event.touches[0].clientX, event.touches[0].clientY)
}

function handleTouchMove(event) {
  store.handleTouchMove(event.touches[0].clientX, event.touches[0].clientY)
}

function handleTouchEnd() {
  store.handleTouchEnd()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('wheel', handleWheel, { passive: true })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('touchend', handleTouchEnd)

  console.log("Type 'wubby' for a secret! :D")

  store.startIntro()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)

  store.stopIntro()
})
</script>
