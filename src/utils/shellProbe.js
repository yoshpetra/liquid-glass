export function measureShellSize(shellEl, mode) {
  const probe = shellEl.cloneNode(false)
  probe.setAttribute('data-size', mode)
  probe.style.position = 'fixed'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  probe.style.left = '-9999px'
  probe.style.top = '0'
  probe.style.transition = 'none'
  document.body.appendChild(probe)
  const rect = probe.getBoundingClientRect()
  document.body.removeChild(probe)
  return { width: rect.width, height: rect.height }
}
