import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const MOMENTUM_WINDOW_MS = 150
export const MOMENTUM_TRIGGER = 130
export const MOMENTUM_RELEASE = 15
export const DRAG_TRIGGER = 80

function createMomentumGate(momentumRef, lockedRef) {
  let samples = []
  let idleTimer = null

  function scheduleIdleRelease() {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      samples = []
      momentumRef.value = 0
      lockedRef.value = false
    }, MOMENTUM_WINDOW_MS)
  }

  return function feed(dx, dy, now) {
    samples.push({ time: now, dx, dy })
    while (samples.length && now - samples[0].time > MOMENTUM_WINDOW_MS) {
      samples.shift()
    }

    let sumX = 0
    let sumY = 0
    for (const sample of samples) {
      sumX += sample.dx
      sumY += sample.dy
    }
    const momentum = Math.hypot(sumX, sumY)
    momentumRef.value = momentum
    scheduleIdleRelease()

    if (lockedRef.value) {
      if (momentum < MOMENTUM_RELEASE) {
        lockedRef.value = false
        samples = []
      }
      return false
    }

    if (momentum >= MOMENTUM_TRIGGER) {
      lockedRef.value = true
      samples = []
      return true
    }

    return false
  }
}

const TABLET_BREAKPOINT_QUERY = '(min-width: 700px)'

export const useLiquidGlassStore = defineStore('liquidGlass', () => {
  const isLiquidGlass = ref(false)
  const sizeMode = ref('phone')
  const showHello = ref(false)
  const showPhone = ref(false)
  const supportsTabletSize = ref(true)

  const canToggleLiquid = computed(() => showPhone.value)
  const canToggleSize = computed(
    () => showPhone.value && !isLiquidGlass.value && supportsTabletSize.value
  )

  const wheelMomentum = ref(0)
  const wheelLocked = ref(false)
  const touchMomentum = ref(0)
  const touchLocked = ref(false)
  const dragDistance = ref(0)
  const dragLocked = ref(false)

  const wheelGate = createMomentumGate(wheelMomentum, wheelLocked)
  const touchGate = createMomentumGate(touchMomentum, touchLocked)
  let touchLastX = null
  let touchLastY = null
  let dragStartX = null
  let introTimers = []
  let tabletMediaQuery = null

  function handleTabletBreakpointChange(event) {
    supportsTabletSize.value = event.matches
    if (!event.matches && sizeMode.value === 'tablet') {
      sizeMode.value = 'phone'
    }
  }

  function toggleLiquidGlass() {
    if (!canToggleLiquid.value) return
    isLiquidGlass.value = !isLiquidGlass.value
  }

  function toggleSizeMode() {
    if (!canToggleSize.value) return
    sizeMode.value = sizeMode.value === 'phone' ? 'tablet' : 'phone'
  }

  function handleWheel(deltaX, deltaY) {
    if (!canToggleSize.value) return
    if (wheelGate(deltaX, deltaY, performance.now())) {
      toggleSizeMode()
    }
  }

  function handleTouchStart(clientX, clientY) {
    touchLastX = clientX
    touchLastY = clientY
  }

  function handleTouchMove(clientX, clientY) {
    if (touchLastX === null) return
    const dx = touchLastX - clientX
    const dy = touchLastY - clientY
    touchLastX = clientX
    touchLastY = clientY

    if (!canToggleSize.value) return
    if (touchGate(dx, dy, performance.now())) {
      toggleSizeMode()
    }
  }

  function handleTouchEnd() {
    touchLastX = null
    touchLastY = null
  }

  function handleDragStart(clientX) {
    dragStartX = clientX
    dragLocked.value = false
    dragDistance.value = 0
  }

  function handleDragMove(clientX) {
    if (dragStartX === null) return
    dragDistance.value = Math.abs(clientX - dragStartX)

    if (dragLocked.value) return
    if (!canToggleSize.value) return
    if (dragDistance.value >= DRAG_TRIGGER) {
      dragLocked.value = true
      toggleSizeMode()
    }
  }

  function handleDragEnd() {
    dragStartX = null
    dragLocked.value = false
    dragDistance.value = 0
  }

  function startIntro() {
    tabletMediaQuery = window.matchMedia(TABLET_BREAKPOINT_QUERY)
    supportsTabletSize.value = tabletMediaQuery.matches
    tabletMediaQuery.addEventListener('change', handleTabletBreakpointChange)

    introTimers.push(setTimeout(() => (showHello.value = true), 100))
    introTimers.push(setTimeout(() => (showHello.value = false), 1700))
    introTimers.push(setTimeout(() => (showPhone.value = true), 2300))
  }

  function stopIntro() {
    introTimers.forEach(clearTimeout)
    introTimers = []

    tabletMediaQuery?.removeEventListener('change', handleTabletBreakpointChange)
    tabletMediaQuery = null
  }

  return {
    isLiquidGlass,
    showHello,
    showPhone,
    sizeMode,
    wheelMomentum,
    wheelLocked,
    touchMomentum,
    touchLocked,
    dragDistance,
    dragLocked,
    toggleLiquidGlass,
    toggleSizeMode,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    startIntro,
    stopIntro,
  }
})
