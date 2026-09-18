<template>
  <svg
    class="icon-battery"
    viewBox="0 0 25 14"
    width="25"
    height="14"
    fill="none"
  >
    <rect
      x="0.5"
      y="0.5"
      width="21"
      height="13"
      rx="4.5"
      stroke="currentColor"
      stroke-width="0.6"
      opacity="0.5"
    />
    <rect x="2" y="2.5" :width="fillWidth" height="9" rx="2.75" :fill="fillColor" />
    <rect
      x="22.5"
      y="4.5"
      width="1.5"
      height="5"
      rx="0.75"
      fill="currentColor"
      opacity="0.5"
    />

    <svg
      v-if="plug"
      x="6.5"
      y="2.5"
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <g class="plug-glyph" stroke-width="2.4" transform="rotate(-45 12 12)" v-html="plugIcon" />
    </svg>
    <svg
      v-else-if="charging"
      x="6.5"
      y="2.5"
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="#ffd60a"
      stroke="#000"
      stroke-width="1.5"
      stroke-opacity="0.35"
      stroke-linejoin="round"
      v-html="boltIcon"
    />
  </svg>
</template>

<script setup>
import { computed } from "vue";
import plugSvg from "@tabler/icons/outline/plug.svg?raw";
import boltSvg from "@tabler/icons/filled/bolt.svg?raw";

const innerSvg = (svg) =>
  svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .replace(/<path stroke="none"[^>]*\/>/, "");

const plugIcon = innerSvg(plugSvg);
const boltIcon = innerSvg(boltSvg);

const props = defineProps({
  level: {
    type: Number,
    default: 100,
    validator: (value) => value >= 0 && value <= 100,
  },
  charging: {
    type: Boolean,
    default: false,
  },
  plug: {
    type: Boolean,
    default: false,
  },
  lowColor: {
    type: String,
    default: "#ff3b30",
  },
  lowThreshold: {
    type: Number,
    default: 20,
  },
});

const fillWidth = computed(() => Math.max((props.level / 100) * 18, 1.5));
const fillColor = computed(() =>
  !props.charging && props.level <= props.lowThreshold
    ? props.lowColor
    : "currentColor",
);
</script>

<style scoped>
.icon-battery {
  color: inherit;
  overflow: visible;
}

.plug-glyph {
  stroke: var(--shell-content-inverse);
}
</style>
