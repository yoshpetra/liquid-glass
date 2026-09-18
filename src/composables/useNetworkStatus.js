import { onMounted, onUnmounted, ref } from 'vue'

const EFFECTIVE_TYPE_STRENGTH = {
  'slow-2g': 1,
  '2g': 2,
  '3g': 3,
  '4g': 4,
}

const EFFECTIVE_TYPE_LABEL = {
  'slow-2g': '2G',
  '2g': '2G',
  '3g': '3G',
  '4g': '4G',
}

function estimateWifiStrength(connection) {
  if (!connection) return 2

  const { downlink, rtt } = connection
  if ((downlink != null && downlink < 0.4) || (rtt != null && rtt > 800)) return 0
  if ((downlink != null && downlink < 1.5) || (rtt != null && rtt > 300)) return 1
  return 2
}

export function useNetworkStatus() {
  const online = ref(typeof navigator === 'undefined' ? true : navigator.onLine)
  const signalStrength = ref(4)
  const wifiStrength = ref(2)
  const isCellular = ref(false)
  const networkLabel = ref('')

  const connection =
    typeof navigator !== 'undefined' &&
    (navigator.connection || navigator.mozConnection || navigator.webkitConnection)

  function sync() {
    if (!online.value) {
      signalStrength.value = 0
      wifiStrength.value = 0
      isCellular.value = false
      networkLabel.value = ''
      return
    }

    isCellular.value = connection?.type === 'cellular'
    networkLabel.value = isCellular.value
      ? EFFECTIVE_TYPE_LABEL[connection.effectiveType] ?? ''
      : ''

    if (isCellular.value) {
      signalStrength.value = EFFECTIVE_TYPE_STRENGTH[connection.effectiveType] ?? 4
      wifiStrength.value = 0
    } else {
      signalStrength.value = 4
      wifiStrength.value = estimateWifiStrength(connection)
    }
  }

  function handleOnline() {
    online.value = true
    sync()
  }

  function handleOffline() {
    online.value = false
    sync()
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    sync()

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    connection?.addEventListener('change', sync)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return

    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    connection?.removeEventListener('change', sync)
  })

  return { online, signalStrength, wifiStrength, isCellular, networkLabel }
}
