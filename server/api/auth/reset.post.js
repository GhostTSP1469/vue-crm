export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const email = String(body.email || '').trim().toLowerCase()
  const code = String(body.code || '').trim()
  const password = String(body.password || '')

  if (password.length < 4) {
    throw createError({
      statusCode: 422,
      message: 'Пароль короче четырёх символов'
    })
  }

  const data = db()
  const user = data.users.find((u) => u.email.toLowerCase() === email)
  const list = data.resets || []

  const reset = list.find((r) => r.userId === (user ? user.id : 0))

  if (!user || !reset || reset.code !== code) {
    throw createError({
      statusCode: 422,
      message: 'Код неверный или устарел'
    })
  }

  if (Date.now() > reset.expires) {
    data.resets = list.filter((r) => r.userId !== user.id)
    save()

    throw createError({
      statusCode: 422,
      message: 'Код неверный или устарел'
    })
  }

  user.password = password
  data.resets = list.filter((r) => r.userId !== user.id)
  save()

  return { ok: true }
})
