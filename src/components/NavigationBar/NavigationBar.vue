<template>
  <div class="navigation-bar">
    <ClockBar />
    <CameraNotch />
    <StatusBar />
  </div>
</template>

<script setup>
import ClockBar from "./ClockBar/ClockBar.vue";
import StatusBar from "./StatusBar/StatusBar.vue";
import CameraNotch from "./CameraNotch/CameraNotch.vue";
</script>

<style scoped>
.navigation-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 28px;
  padding: 0 6px 0 38px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  user-select: none;
  -webkit-user-select: none;
  transition: color var(--liquid-transition-duration)
    var(--liquid-transition-easing);
}
</style>
