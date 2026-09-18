<template>
  <div class="statistics">
    <div class="stat-row" :class="fpsClass">{{ fps }} fps · {{ dropped }} dropped</div>

    <div class="stat-row meter-row">
      <span class="meter-label">wheel</span>
      <div class="meter-track">
        <div class="meter-marker meter-marker-release" :style="{ left: releasePercent + '%' }"></div>
        <div class="meter-marker meter-marker-trigger" :style="{ left: triggerPercent + '%' }"></div>
        <div
          class="meter-fill"
          :class="{ 'meter-fill-locked': store.wheelLocked }"
          :style="{ width: wheelPercent + '%' }"
        ></div>
      </div>
      <span class="meter-value">{{ Math.round(store.wheelMomentum) }}</span>
    </div>

    <div class="stat-row meter-row">
      <span class="meter-label">touch</span>
      <div class="meter-track">
        <div class="meter-marker meter-marker-release" :style="{ left: releasePercent + '%' }"></div>
        <div class="meter-marker meter-marker-trigger" :style="{ left: triggerPercent + '%' }"></div>
        <div
          class="meter-fill"
          :class="{ 'meter-fill-locked': store.touchLocked }"
          :style="{ width: touchPercent + '%' }"
        ></div>
      </div>
      <span class="meter-value">{{ Math.round(store.touchMomentum) }}</span>
    </div>

    <div class="stat-row meter-row">
      <span class="meter-label">drag</span>
      <div class="meter-track">
        <div class="meter-marker meter-marker-trigger" :style="{ left: dragTriggerPercent + '%' }"></div>
        <div
          class="meter-fill"
          :class="{ 'meter-fill-locked': store.dragLocked }"
          :style="{ width: dragPercent + '%' }"
        ></div>
      </div>
      <span class="meter-value">{{ Math.round(store.dragDistance) }}</span>
    </div>

    <div class="stat-row state-row">{{ stateLabel }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLiquidGlassStore, MOMENTUM_TRIGGER, MOMENTUM_RELEASE, DRAG_TRIGGER } from '../stores/liquidGlass'

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

const MAX_DISPLAY = 180

function toPercent(momentum) {
  const clamped = Math.min(momentum, MAX_DISPLAY)
  return (clamped / MAX_DISPLAY) * 100
}

const triggerPercent = (MOMENTUM_TRIGGER / MAX_DISPLAY) * 100
const releasePercent = (MOMENTUM_RELEASE / MAX_DISPLAY) * 100

const wheelPercent = computed(() => toPercent(store.wheelMomentum))
const touchPercent = computed(() => toPercent(store.touchMomentum))

const MAX_DRAG_DISPLAY = 160
const dragTriggerPercent = (DRAG_TRIGGER / MAX_DRAG_DISPLAY) * 100
const dragPercent = computed(() => (Math.min(store.dragDistance, MAX_DRAG_DISPLAY) / MAX_DRAG_DISPLAY) * 100)

const stateLabel = computed(() => {
  const glass = store.isLiquidGlass ? 'transparent' : 'default'
  return `${glass} ${store.sizeMode}`
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

.meter-label {
  width: 34px;
}

.meter-track {
  position: relative;
  width: 120px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

.meter-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: #4cc9f0;
  transition: width 0.05s linear;
}

.meter-fill-locked {
  background: #6f6;
}

.meter-marker {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.5);
}

.meter-marker-trigger {
  background: #f66;
}

.meter-value {
  width: 24px;
  text-align: right;
}

.state-row {
  color: #ffd166;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
