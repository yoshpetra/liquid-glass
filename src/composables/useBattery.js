import { onMounted, onUnmounted, ref } from 'vue'

export function useBattery() {
  const level = ref(100)
  const charging = ref(true)
  const hasBattery = ref(true)

  let batteryManager = null

  function syncFromBattery() {
    level.value = Math.round(batteryManager.level * 100)
    charging.value = batteryManager.charging
    hasBattery.value = !(
      batteryManager.charging &&
      batteryManager.level === 1 &&
      batteryManager.chargingTime === 0 &&
      batteryManager.dischargingTime === Infinity
    )
  }

  onMounted(async () => {
    if (typeof navigator === 'undefined' || !navigator.getBattery) {
      charging.value = true
      hasBattery.value = false
      return
    }

    try {
      batteryManager = await navigator.getBattery()
      syncFromBattery()
      batteryManager.addEventListener('levelchange', syncFromBattery)
      batteryManager.addEventListener('chargingchange', syncFromBattery)
    } catch {
      charging.value = true
      hasBattery.value = false
    }
  })

  onUnmounted(() => {
    if (!batteryManager) return
    batteryManager.removeEventListener('levelchange', syncFromBattery)
    batteryManager.removeEventListener('chargingchange', syncFromBattery)
  })

  return { level, charging, hasBattery }
}
