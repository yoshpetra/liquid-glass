<template>
  <div class="icons-screen" ref="gridRef">
    <TransitionGroup name="icon" tag="div" class="icons-screen-grid">
      <AppIcon
        v-for="item in store.currentPageItems"
        :key="item.id"
        :label="item.label"
        :color="item.color"
        :style="{ gridColumn: `span ${item.cols}`, gridRow: `span ${item.rows}` }"
      />
    </TransitionGroup>
    <PaginationDots :count="store.pageCount" :current="store.currentPage" />
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import { useIconGridStore } from '../../stores/iconGrid'
import { useResponsiveGrid } from '../../composables/useResponsiveGrid'
import { useSizeModeSync } from '../../composables/useSizeModeSync'
import AppIcon from './AppIcon/AppIcon.vue'
import PaginationDots from './PaginationDots/PaginationDots.vue'

const store = useIconGridStore()
const gridRef = ref(null)
const shellRef = inject('shellRef')
const { columns, rows } = useResponsiveGrid(gridRef)

useSizeModeSync({ shellRef, gridRef, columns, rows })
</script>

<style scoped>
.icons-screen {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin-top: var(--global-padding);
}

.icons-screen-grid {
  flex: 1;
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(v-bind('store.columns'), var(--icon-size));
  grid-auto-rows: var(--icon-size);
  gap: var(--icon-grid-gap);
  justify-content: center;
  align-content: start;
}

.icon-move {
  transition: transform var(--icon-move-duration) var(--liquid-transition-easing);
}

.icon-leave-active {
  position: absolute;
}
</style>
