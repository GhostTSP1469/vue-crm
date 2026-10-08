export default defineEventHandler((event) => {
  return { user: currentUser(event) }
})
