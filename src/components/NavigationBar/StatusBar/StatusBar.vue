<template>
  <div class="status-bar">
    <SignalBar :strength="signalStrength" label="4G" />
    <WifiBar v-if="!isCellular" :strength="wifiStrength" />
    <BatteryIcon
      :level="batteryLevel"
      :charging="batteryCharging"
      :plug="!hasBattery"
    />
  </div>
</template>

<script setup>
import SignalBar from "./Item/SignalBar.vue";
import WifiBar from "./Item/WifiBar.vue";
import BatteryIcon from "./Item/BatteryIcon.vue";
import { useBattery } from "../../../composables/useBattery";
import { useNetworkStatus } from "../../../composables/useNetworkStatus";

const {
  level: batteryLevel,
  charging: batteryCharging,
  hasBattery,
} = useBattery();
const { signalStrength, wifiStrength, isCellular, networkLabel } =
  useNetworkStatus();
</script>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
