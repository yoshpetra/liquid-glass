<template>
  <svg class="icon-wifi" viewBox="0 0 16 12" width="16" height="12" fill="none">
    <circle cx="8" cy="10.4" r="1.8" fill="currentColor" />
    <path
      d="M4.2 6.9a5.4 5.4 0 0 1 7.6 0"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
      fill="none"
      :opacity="strength >= 1 ? 1 : inactiveOpacity"
    />
    <path
      d="M1.4 4.1a9.4 9.4 0 0 1 13.2 0"
      stroke="currentColor"
      stroke-width="2.6"
      stroke-linecap="round"
      fill="none"
      :opacity="strength >= 2 ? 1 : inactiveOpacity"
    />
  </svg>
</template>

<script setup>
defineProps({
  strength: {
    type: Number,
    default: 2,
    validator: (value) => value >= 0 && value <= 2,
  },
  inactiveOpacity: {
    type: Number,
    default: 0.3,
  },
})
</script>

<style scoped>
.icon-wifi {
  color: inherit;
  overflow: visible;
}
</style>
