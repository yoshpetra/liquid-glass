<template>
  <div
    class="resize-handle"
    :class="`resize-handle-${edge}`"
    @pointerdown.stop="handlePointerDown"
  ></div>
</template>

<script setup>
import { inject } from 'vue'
import { useEdgeResize } from '../../composables/useEdgeResize'

const props = defineProps({
  edge: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value),
  },
})

const shellRef = inject('shellRef')
const { handlePointerDown } = useEdgeResize({ shellRef, edge: props.edge })
</script>

<style scoped>
.resize-handle {
  position: fixed;
  top: 50%;
  height: var(--shell-height);
  transform: translateY(-50%);
  width: 28px;
  cursor: ew-resize;
  touch-action: none;
  transition: left var(--size-transition-duration) var(--size-transition-easing);
}

.resize-handle-left {
  left: calc(50% - (var(--shell-width) / 2) - 16px - 28px);
}

.resize-handle-right {
  left: calc(50% + (var(--shell-width) / 2) + 16px);
}
</style>
