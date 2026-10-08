export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const name = String(body.name || '').trim()

  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  if (name.length < 2) {
    throw createError({ statusCode: 422, message: 'Укажите имя' })
  }

  if (!email.includes('@') || !email.includes('.')) {
    throw createError({ statusCode: 422, message: 'Неверная почта' })
  }

  if (password.length < 4) {
    throw createError({
      statusCode: 422,
      message: 'Пароль короче четырёх символов'
    })
  }

  const data = db()
  const taken = data.users.find((u) => u.email.toLowerCase() === email)

  if (taken) {
    throw createError({
      statusCode: 409,
      message: 'Такая почта уже занята'
    })
  }

  const role = body.role === ADMIN ? ADMIN : MANAGER

  const user = {
    id: nextId(data.users),
    name: name,
    email: email,
    password: password,
    role: role
  }

  data.users.push(user)
  save()

  startSession(event, user.id)
  setResponseStatus(event, 201)

  const { password: _, ...safe } = user
  return safe
})
