const BG = {
  light: '#f7f8fa',
  dark: '#0f1115'
}

const GROW = 620
const FADE = 260

export function resolveTheme(value) {
  if (value !== 'auto') return value

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return isDark ? 'dark' : 'light'
}

export function bubbleSwap(nextTheme, apply) {
  const screen = document.createElement('div')

  screen.style.position = 'fixed'
  screen.style.inset = '0'
  screen.style.background = BG[nextTheme]

  screen.style.zIndex = '9999'
  screen.style.pointerEvents = 'none'

  screen.style.clipPath = 'circle(0px at 50% 50%)'

  document.body.appendChild(screen)

  const half = Math.sqrt(
    window.innerWidth * window.innerWidth +
      window.innerHeight * window.innerHeight
  ) / 2

  requestAnimationFrame(() => {
    screen.style.transition = `clip-path ${GROW}ms cubic-bezier(0.4, 0, 0.2, 1)`
    screen.style.clipPath = `circle(${half}px at 50% 50%)`
  })

  setTimeout(() => {
    apply()

    screen.style.transition = `opacity ${FADE}ms ease`
    screen.style.opacity = '0'

    setTimeout(() => screen.remove(), FADE)
  }, GROW)
}
