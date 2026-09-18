# Project rules

- Do not add code comments unless the user asks for them.

## Component conventions

- Vue 3 single-file components using `<script setup>` (plain JavaScript, no TypeScript).
- Block order: `<template>`, then `<script setup>`, then `<style scoped>`. Omit blocks a component doesn't need (e.g. no `<script>` for a purely static component).
- One component per folder under `src/components/`, named after the component (`NavigationBar/ClockBar/ClockBar.vue`). Sub-parts nest inside the parent's folder (`StatusBar/Item/BatteryIcon.vue`).
- PascalCase file and component names. Composables live in `src/composables/` as `useXxx.js`, stores in `src/stores/` (Pinia setup stores), helpers in `src/utils/`.
- Props use the object form of `defineProps` with `type` and `default`, plus a `validator` when the value has a range.
- Keep logic in composables (`useBattery`, `useNetworkStatus`); components stay thin and just render the returned refs.
- Clean up in `onUnmounted` whatever `onMounted` sets up (listeners, intervals, timers).
- Icons are inline SVG components that use `currentColor` and `overflow: visible`. Icon artwork comes from `@tabler/icons`, imported with `?raw` (e.g. `@tabler/icons/outline/plug.svg?raw`).
- Scoped styles use kebab-case class names prefixed by the component (`.clock-bar`, `.icon-wifi`) and read shared values from CSS variables defined in `src/styles/`.
- Style: no semicolons and single quotes in `.js` files and in `<script setup>` of newer components; keep whatever the file already uses when editing an existing one.
- Use `px` for font sizes, not `rem`.
