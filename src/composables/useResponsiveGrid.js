import { onMounted, onUnmounted, ref } from 'vue'

export function computeGridDimensions(width, height, iconSize, gap) {
  return {
    columns: Math.max(1, Math.floor((width + gap) / (iconSize + gap))),
    rows: Math.max(1, Math.floor((height + gap) / (iconSize + gap))),
  }
}

export function useResponsiveGrid(containerRef) {
  const columns = ref(1)
  const rows = ref(1)
  let resizeObserver = null

  function calculateGrid() {
    const el = containerRef.value
    if (!el) return

    const styles = getComputedStyle(el)
    const iconSize = parseFloat(styles.getPropertyValue('--icon-size'))
    const gap = parseFloat(styles.getPropertyValue('--icon-grid-gap'))
    const dimensions = computeGridDimensions(el.clientWidth, el.clientHeight, iconSize, gap)

    columns.value = dimensions.columns
    rows.value = dimensions.rows
  }

  onMounted(() => {
    calculateGrid()

    if (typeof ResizeObserver === 'undefined') return
    resizeObserver = new ResizeObserver(calculateGrid)
    resizeObserver.observe(containerRef.value)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  return { columns, rows }
}
