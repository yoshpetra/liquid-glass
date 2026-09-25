<template>
  <div
    class="liquid-glass-shell"
    ref="shellRef"
    :class="{ 'shell-visible': store.showPhone }"
    @click="store.toggleLiquidGlass()"
  >
    <div class="liquid-glass-container">
      <div class="glass-surface"></div>
      <NavigationBar />
      <IconsScreen />
      <Dock />
    </div>
  </div>
  <ResizeHandle v-if="store.canToggleSize" edge="left" />
  <ResizeHandle v-if="store.canToggleSize" edge="right" />
</template>

<script setup>
import { provide, ref } from "vue";
import { useLiquidGlassStore } from "../stores/liquidGlass";
import NavigationBar from "./NavigationBar/NavigationBar.vue";
import IconsScreen from "./IconsScreen/IconsScreen.vue";
import Dock from "./IconsScreen/Dock/Dock.vue";
import ResizeHandle from "./ResizeHandle/ResizeHandle.vue";

const store = useLiquidGlassStore();
const shellRef = ref(null);
provide("shellRef", shellRef);
</script>

<style scoped>
.liquid-glass-shell {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(0);
  width: var(--shell-width);
  height: var(--shell-height);
  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.3),
    0 10px 25px rgba(0, 0, 0, 0.2);
  border-radius: var(--phone-radius);
  opacity: 0;
  cursor: pointer;
  contain: layout paint;
  will-change: width, height;
  transition:
    opacity 0.8s ease-out,
    transform var(--liquid-transition-duration) var(--liquid-transition-easing),
    width var(--size-transition-duration) var(--size-transition-easing),
    height var(--size-transition-duration) var(--size-transition-easing);
}

.liquid-glass-shell.shell-visible {
  opacity: 1;
}

.liquid-glass-container {
  position: absolute;
  inset: 0;
  background: var(--shell-bg);
  border-radius: var(--phone-radius);
  overflow: hidden;
  clip-path: inset(0 round var(--phone-radius));
  -webkit-clip-path: inset(0 round var(--phone-radius));
  display: flex;
  flex-direction: column;
  padding: 11px var(--global-padding) var(--global-padding);
  box-sizing: border-box;
  border: 1px solid var(--shell-border-color);
  box-shadow: var(--shell-inset-shadow);
  contain: layout paint;
  transition:
    background var(--liquid-transition-duration) var(--liquid-transition-easing),
    box-shadow var(--liquid-transition-duration) var(--liquid-transition-easing),
    border-color var(--liquid-transition-duration)
      var(--liquid-transition-easing);
}

.glass-surface {
  position: absolute;
  inset: -2px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  opacity: var(--glass-surface-opacity);
  will-change: opacity;
  transform: translateZ(0);
  transition: opacity var(--liquid-transition-duration)
    var(--liquid-transition-easing);
  pointer-events: none;
}
</style>
