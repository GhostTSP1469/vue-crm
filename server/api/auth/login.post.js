export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  const user = db().users.find((u) => u.email.toLowerCase() === email)

  if (!user || user.password !== password) {
    throw createError({
      statusCode: 401,
      message: 'Неверная почта или пароль'
    })
  }

  startSession(event, user.id)

  const { password: _, ...safe } = user
  return safe
})
