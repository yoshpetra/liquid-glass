<template>
  <div class="app-icon" :style="{ background: color }">
    <span class="app-icon-label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#8e8e93',
  },
})
</script>

<style scoped>
.app-icon {
  width: 100%;
  height: 100%;
  border-radius: 22%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.app-icon-label {
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  user-select: none;
  -webkit-user-select: none;
}
</style>
