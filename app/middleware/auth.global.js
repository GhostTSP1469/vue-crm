export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  if (!auth.checked) {
    await auth.fetchMe()
  }

  const GUEST_PAGES = ['/login', '/register', '/forgot']

  const isGuestPage = GUEST_PAGES.includes(to.path)

  if (!auth.isAuthed && !isGuestPage) {
    return navigateTo({
      path: '/login',
      query: { next: to.fullPath }
    })
  }

  if (auth.isAuthed && isGuestPage) {
    return navigateTo('/')
  }
})
