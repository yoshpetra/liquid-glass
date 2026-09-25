import { onMounted, onUnmounted, ref } from 'vue'
import { measureShellSize } from '../utils/shellProbe'
import { useLiquidGlassStore } from '../stores/liquidGlass'

const RESIZE_THRESHOLD_RATIO = 0.5
const RESIZE_CURSOR = 'ew-resize'

export function useEdgeResize({ shellRef, edge }) {
  const liquidGlassStore = useLiquidGlassStore()
  const isDragging = ref(false)

  let startClientX = null
  let startWidth = null
  let startMode = null
  let phoneWidth = null
  let tabletWidth = null
  let capturedEl = null

  function cleanupDragListeners() {
    if (!capturedEl) return
    capturedEl.removeEventListener('pointermove', onPointerMove)
    capturedEl.removeEventListener('pointerup', onPointerUp)
    capturedEl.removeEventListener('pointercancel', onPointerUp)
    capturedEl = null
  }

  function onPointerMove(event) {
    const shellEl = shellRef.value
    if (!shellEl) return

    const rawDelta = event.clientX - startClientX
    const signedDelta = edge === 'right' ? rawDelta : -rawDelta
    const appliedDelta = signedDelta * 2

    const min = Math.min(phoneWidth, tabletWidth)
    const max = Math.max(phoneWidth, tabletWidth)
    const nextWidth = Math.min(max, Math.max(min, startWidth + appliedDelta))

    shellEl.style.width = `${nextWidth}px`
  }

  function onPointerUp() {
    const shellEl = shellRef.value
    if (!shellEl) return

    const currentWidth = parseFloat(shellEl.style.width) || startWidth
    const threshold =
      Math.min(phoneWidth, tabletWidth) +
      Math.abs(tabletWidth - phoneWidth) * RESIZE_THRESHOLD_RATIO
    const finalMode = currentWidth >= threshold ? 'tablet' : 'phone'

    if (finalMode !== startMode) {
      liquidGlassStore.setSizeMode(finalMode)
      liquidGlassStore.commitSizeMode()
    }

    shellEl.style.transition = ''
    shellEl.style.width = ''

    document.body.style.cursor = ''
    cleanupDragListeners()
    isDragging.value = false
  }

  function handlePointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return

    const shellEl = shellRef.value
    if (!shellEl) return

    startClientX = event.clientX
    startWidth = shellEl.getBoundingClientRect().width
    startMode = liquidGlassStore.sizeMode
    phoneWidth = measureShellSize(shellEl, 'phone').width
    tabletWidth = measureShellSize(shellEl, 'tablet').width

    shellEl.style.transition = 'none'
    document.body.style.cursor = RESIZE_CURSOR

    capturedEl = event.currentTarget
    capturedEl.setPointerCapture(event.pointerId)
    capturedEl.addEventListener('pointermove', onPointerMove)
    capturedEl.addEventListener('pointerup', onPointerUp)
    capturedEl.addEventListener('pointercancel', onPointerUp)

    isDragging.value = true
  }

  function handleWindowBlur() {
    if (isDragging.value) onPointerUp()
  }

  function handleVisibilityChange() {
    if (document.hidden) handleWindowBlur()
  }

  onMounted(() => {
    window.addEventListener('blur', handleWindowBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    window.removeEventListener('blur', handleWindowBlur)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    cleanupDragListeners()
  })

  return { isDragging, handlePointerDown }
}
