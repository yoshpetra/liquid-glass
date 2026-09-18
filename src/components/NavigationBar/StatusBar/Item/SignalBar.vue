<template>
  <span class="signal-bar">
    <svg
      class="icon-signal"
      viewBox="0 0 17 12"
      width="17"
      height="12"
      fill="none"
    >
      <rect
        v-for="(bar, index) in bars"
        :key="index"
        :x="bar.x"
        :y="bar.y"
        width="3.5"
        :height="bar.height"
        rx="1"
        fill="currentColor"
        :opacity="index < strength ? 1 : inactiveOpacity"
      />
    </svg>
    <span v-if="label" class="signal-label">{{ label }}</span>
  </span>
</template>

<script setup>
const { strength, inactiveOpacity, label } = defineProps({
  strength: {
    type: Number,
    default: 4,
    validator: (value) => value >= 0 && value <= 4,
  },
  inactiveOpacity: {
    type: Number,
    default: 0.3,
  },
  label: {
    type: String,
    default: "",
  },
});

const bars = [
  { x: 0, y: 8, height: 4 },
  { x: 4.5, y: 6, height: 6 },
  { x: 9, y: 3, height: 9 },
  { x: 13.5, y: 0, height: 12 },
];
</script>

<style scoped>
.signal-bar {
  display: flex;
  align-items: center;
  gap: 2px;
}

.signal-label {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.icon-signal {
  color: inherit;
  overflow: visible;
}
</style>
