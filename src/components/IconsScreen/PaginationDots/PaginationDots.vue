<template>
  <div class="pagination-dots">
    <span
      v-for="n in count"
      :key="n"
      class="pagination-dot"
      :class="{ 'pagination-dot-active': n - 1 === current }"
    ></span>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1,
  },
  current: {
    type: Number,
    default: 0,
  },
})
</script>

<style scoped>
.pagination-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 12px 0;
}

.pagination-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--shell-content-color);
  opacity: 0.3;
  transition:
    opacity var(--liquid-transition-duration) var(--liquid-transition-easing),
    background var(--liquid-transition-duration) var(--liquid-transition-easing);
}

.pagination-dot-active {
  opacity: 1;
}
</style>
