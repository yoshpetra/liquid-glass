<template>
  <div class="icons-dock">
    <div class="icons-dock-item"></div>
    <div class="icons-dock-item"></div>
    <div class="icons-dock-item"></div>
    <div class="icons-dock-item"></div>
  </div>
</template>

<style scoped>
.icons-dock {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: calc(var(--icon-size) + 24px);
  padding: 0 12px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.icons-dock-item {
  width: var(--icon-size);
  height: var(--icon-size);
  border-radius: 22%;
  background: rgba(255, 255, 255, 0.35);
}
</style>
