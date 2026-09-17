export function shouldShowFpsMeter() {
  const value = import.meta.env.VITE_SHOW_FPS
  if (value === undefined) return true
  return value === 'true'
}
