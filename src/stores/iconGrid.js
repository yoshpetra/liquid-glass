import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { packGrid } from '../utils/gridLayout'

const PALETTE = ['#ff9f0a', '#ff375f', '#bf5af2', '#0a84ff', '#30d158', '#64d2ff']

function createFixtureIcons(count) {
  const icons = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    label: `App ${index + 1}`,
    color: PALETTE[index % PALETTE.length],
    sizes: [{ cols: 1, rows: 1 }],
  }))

  icons.splice(3, 0, {
    id: 'widget-stats',
    label: 'Stats',
    color: '#1c1c1e',
    sizes: [
      { cols: 3, rows: 2 },
      { cols: 2, rows: 2 },
      { cols: 1, rows: 1 },
    ],
  })

  return icons
}

export const useIconGridStore = defineStore('iconGrid', () => {
  const icons = ref(createFixtureIcons(18))
  const currentPage = ref(0)
  const columns = ref(4)
  const rows = ref(4)

  const pages = computed(() => packGrid(icons.value, columns.value, rows.value))
  const pageCount = computed(() => pages.value.length)
  const currentPageItems = computed(() => pages.value[currentPage.value] ?? [])

  function setGridDimensions(nextColumns, nextRows) {
    columns.value = nextColumns
    rows.value = nextRows
    if (currentPage.value > pageCount.value - 1) {
      currentPage.value = pageCount.value - 1
    }
  }

  function goToPage(index) {
    currentPage.value = Math.min(Math.max(index, 0), pageCount.value - 1)
  }

  return {
    icons,
    currentPage,
    columns,
    rows,
    pages,
    pageCount,
    currentPageItems,
    setGridDimensions,
    goToPage,
  }
})
