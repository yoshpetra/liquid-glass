<template>
  <div
    class="liquid-glass-shell"
    :class="{ 'shell-visible': store.showPhone, 'shell-tablet': store.sizeMode === 'tablet' }"
    @click="store.toggleLiquidGlass()"
  >
    <div class="liquid-glass-container" :class="{ 'liquid-glass-active': store.isLiquidGlass }">
      <div class="glass-surface" :class="{ 'glass-surface-active': store.isLiquidGlass }"></div>
      <div v-if="false" class="top-notch"></div>
    </div>
  </div>
</template>

<script setup>
import { useLiquidGlassStore } from '../stores/liquidGlass'

const store = useLiquidGlassStore()
</script>

<style scoped>
.liquid-glass-shell {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(0);
  width: min(var(--phone-max-width), 85vw);
  height: min(var(--phone-max-height), 80vh);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3), 0 10px 25px rgba(0, 0, 0, 0.2);
  border-radius: var(--phone-radius);
  opacity: 0;
  cursor: pointer;
  contain: layout paint;
  will-change: width, height;
  transition: opacity 0.8s ease-out,
    transform var(--liquid-transition-duration) var(--liquid-transition-easing),
    width var(--size-transition-duration) var(--size-transition-easing),
    height var(--size-transition-duration) var(--size-transition-easing);
}

.liquid-glass-shell.shell-visible {
  opacity: 1;
}

.liquid-glass-shell.shell-tablet {
  width: min(var(--tablet-max-width), 90vw);
  height: min(var(--tablet-max-height), 85vh);
}

.liquid-glass-container {
  position: absolute;
  inset: 0;
  background: #fff;
  border-radius: var(--phone-radius);
  overflow: hidden;
  clip-path: inset(0 round var(--phone-radius));
  -webkit-clip-path: inset(0 round var(--phone-radius));
  display: flex;
  flex-direction: column;
  padding: var(--global-padding);
  box-sizing: border-box;
  border: 1px solid transparent;
  contain: layout paint;
  transition: background var(--liquid-transition-duration) var(--liquid-transition-easing),
    box-shadow var(--liquid-transition-duration) var(--liquid-transition-easing),
    border-color var(--liquid-transition-duration) var(--liquid-transition-easing);
}

.liquid-glass-container.liquid-glass-active {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.6);
}

.glass-surface {
  position: absolute;
  inset: -2px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  opacity: 0;
  will-change: opacity;
  transform: translateZ(0);
  transition: opacity var(--liquid-transition-duration) var(--liquid-transition-easing);
  pointer-events: none;
}

.glass-surface.glass-surface-active {
  opacity: 1;
}

.top-notch {
  position: relative;
  height: 120px;
  border-radius: 24px;
  background: lightskyblue;
  box-shadow:
    inset 2px 2px 4px rgba(0, 0, 0, 0.15),
    inset -2px -2px 4px rgba(0, 0, 0, 0.08);
}
</style>
