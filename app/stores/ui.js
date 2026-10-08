export const useUiStore = defineStore('ui', () => {
  const toasts = ref([])

  let lastId = 0

  function notify(message, type = 'info') {
    lastId = lastId + 1
    const id = lastId

    toasts.value.push({ id, message, type })

    if (import.meta.client) {
      const delay = type === 'error' ? 5000 : 3000
      setTimeout(() => dismiss(id), delay)
    }
  }

  function dismiss(id) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function success(message) {
    notify(message, 'success')
  }

  function error(message) {
    notify(message, 'error')
  }

  const theme = ref('auto')

  function applyTheme(value) {
    const root = document.documentElement

    if (value === 'auto') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', value)
    }
  }

  function rememberTheme(value) {
    try {
      localStorage.setItem('crm-theme', value)
    } catch (e) {
    }
  }

  function setTheme(value) {
    const old = theme.value

    theme.value = value
    rememberTheme(value)

    if (!import.meta.client) {
      return
    }

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const sameLook = resolveTheme(old) === resolveTheme(value)

    if (calm || sameLook) {
      applyTheme(value)
      return
    }

    bubbleSwap(resolveTheme(value), () => applyTheme(value))
  }

  function loadTheme() {
    let saved = 'auto'

    try {
      saved = localStorage.getItem('crm-theme') || 'auto'
    } catch (e) {
      saved = 'auto'
    }

    theme.value = saved
    applyTheme(saved)
  }

  return {
    toasts,
    notify,
    dismiss,
    success,
    error,
    theme,
    setTheme,
    loadTheme
  }
})
