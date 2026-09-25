import { watch } from 'vue'
import { computeGridDimensions } from './useResponsiveGrid'
import { measureShellSize } from '../utils/shellProbe'
import { useIconGridStore } from '../stores/iconGrid'
import { useLiquidGlassStore } from '../stores/liquidGlass'

const SIZE_ORDER = { phone: 0, tablet: 1 }
const SETTLED_WAIT_FALLBACK_MS = 100

function readDurationMs(el, varName) {
  return parseFloat(getComputedStyle(el).getPropertyValue(varName)) * 1000
}

function readIconMetrics(el) {
  const styles = getComputedStyle(el)
  return {
    iconSize: parseFloat(styles.getPropertyValue('--icon-size')),
    gap: parseFloat(styles.getPropertyValue('--icon-grid-gap')),
  }
}

function waitForShellResize(shellEl) {
  return new Promise((resolve) => {
    function handleEnd(event) {
      if (event.target !== shellEl || event.propertyName !== 'width') return
      shellEl.removeEventListener('transitionend', handleEnd)
      resolve()
    }
    shellEl.addEventListener('transitionend', handleEnd)
  })
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function waitForShellResizeSettled(shellEl) {
  return Promise.race([waitForShellResize(shellEl), wait(SETTLED_WAIT_FALLBACK_MS)])
}

export function useSizeModeSync({ shellRef, gridRef, columns, rows }) {
  const liquidGlassStore = useLiquidGlassStore()
  const iconGridStore = useIconGridStore()

  let suspended = false

  watch(
    [columns, rows],
    () => {
      if (suspended) return
      iconGridStore.setGridDimensions(columns.value, rows.value)
    },
    { immediate: true }
  )

  watch(
    () => liquidGlassStore.sizeMode,
    async (nextMode, previousMode) => {
      const shellEl = shellRef.value
      const gridEl = gridRef.value
      if (!shellEl || !gridEl || nextMode === previousMode) return

      const shellRect = shellEl.getBoundingClientRect()
      const targetShell = measureShellSize(shellEl, nextMode)
      const alreadySettled = Math.abs(shellRect.width - targetShell.width) < 1

      if (alreadySettled) {
        iconGridStore.setGridDimensions(columns.value, rows.value)
        return
      }

      const expanding = SIZE_ORDER[nextMode] > SIZE_ORDER[previousMode]
      suspended = true

      if (expanding) {
        liquidGlassStore.commitSizeMode()
        await waitForShellResizeSettled(shellEl)
      } else {
        const gridRect = gridEl.getBoundingClientRect()
        const chromeWidth = shellRect.width - gridRect.width
        const chromeHeight = shellRect.height - gridRect.height

        const { iconSize, gap } = readIconMetrics(gridEl)
        const target = computeGridDimensions(
          targetShell.width - chromeWidth,
          targetShell.height - chromeHeight,
          iconSize,
          gap
        )
        iconGridStore.setGridDimensions(target.columns, target.rows)

        await wait(readDurationMs(gridEl, '--icon-move-duration'))
        liquidGlassStore.commitSizeMode()
        await waitForShellResizeSettled(shellEl)
      }

      iconGridStore.setGridDimensions(columns.value, rows.value)
      suspended = false
    }
  )
}
