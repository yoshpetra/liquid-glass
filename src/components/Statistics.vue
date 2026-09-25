<template>
  <div class="statistics">
    <div class="stat-row" :class="fpsClass">{{ fps }} fps · {{ dropped }} dropped</div>
    <div class="stat-row state-row">{{ stateLabel }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLiquidGlassStore } from '../stores/liquidGlass'

const store = useLiquidGlassStore()

const fps = ref(0)
const dropped = ref(0)

const fpsClass = computed(() => {
  if (fps.value >= 55) return 'fps-good'
  if (fps.value >= 30) return 'fps-warn'
  return 'fps-bad'
})

let rafId = null
let lastFrameTime = performance.now()
let lastSampleTime = performance.now()
let frameCount = 0

function tick(now) {
  const delta = now - lastFrameTime
  lastFrameTime = now
  frameCount += 1

  if (delta > 20) {
    dropped.value += 1
  }

  if (now - lastSampleTime >= 500) {
    fps.value = Math.round((frameCount * 1000) / (now - lastSampleTime))
    frameCount = 0
    lastSampleTime = now
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})

const stateLabel = computed(() => {
  const glass = store.isLiquidGlass ? 'transparent' : 'default'
  const size =
    store.sizeMode === store.appliedSizeMode
      ? store.appliedSizeMode
      : `${store.appliedSizeMode} → ${store.sizeMode}`
  return `${glass} ${size}`
})
</script>

<style scoped>
.statistics {
  position: fixed;
  top: 8px;
  right: 8px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-family: monospace;
  font-size: 11px;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fps-good {
  color: #6f6;
}

.fps-warn {
  color: #fd6;
}

.fps-bad {
  color: #f66;
}

.state-row {
  color: #ffd166;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
