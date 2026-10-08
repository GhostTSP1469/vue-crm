export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const checked = ref(false)

  const isAuthed = computed(() => Boolean(user.value))

  const isAdmin = computed(() => {
    return Boolean(user.value) && user.value.role === 'Руководитель'
  })

  async function fetchMe() {
    const headers = useRequestHeaders(['cookie'])

    try {
      const res = await $fetch('/api/auth/me', { headers })
      user.value = res.user
    } catch (e) {
      user.value = null
    } finally {
      checked.value = true
    }
  }

  async function login(email, password) {
    user.value = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })

    checked.value = true
  }

  async function register(name, email, password, role) {
    user.value = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name, email, password, role }
    })

    checked.value = true
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null

    await navigateTo('/login')
  }

  return { user, checked, isAuthed, isAdmin, fetchMe, login, register, logout }
})
