import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const TABLET_BREAKPOINT_QUERY = '(min-width: 700px)'

export const useLiquidGlassStore = defineStore('liquidGlass', () => {
  const isLiquidGlass = ref(false)
  const sizeMode = ref('phone')
  const appliedSizeMode = ref(sizeMode.value)
  const showHello = ref(false)
  const showPhone = ref(false)
  const supportsTabletSize = ref(true)

  const canToggleLiquid = computed(() => showPhone.value)
  const canToggleSize = computed(
    () => showPhone.value && !isLiquidGlass.value && supportsTabletSize.value
  )

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

  function setSizeMode(mode) {
    if (!canToggleSize.value) return
    if (mode !== 'phone' && mode !== 'tablet') return
    sizeMode.value = mode
  }

  function commitSizeMode() {
    appliedSizeMode.value = sizeMode.value
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
    appliedSizeMode,
    canToggleSize,
    toggleLiquidGlass,
    setSizeMode,
    commitSizeMode,
    startIntro,
    stopIntro,
  }
})
