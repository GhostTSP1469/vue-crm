const STATUSES = ['lead', 'active', 'churned']
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)

  const name = String(body.name || '').trim()
  const company = String(body.company || '').trim()
  const email = String(body.email || '').trim()
  const phone = String(body.phone || '').trim()
  const status = String(body.status || 'lead')
  const note = String(body.note || '').trim()

  if (name.length < 2) {
    throw createError({ statusCode: 422, message: 'Укажите имя клиента' })
  }

  if (company.length < 2) {
    throw createError({ statusCode: 422, message: 'Укажите компанию' })
  }

  if (!EMAIL.test(email)) {
    throw createError({ statusCode: 422, message: 'Некорректная почта' })
  }

  if (!STATUSES.includes(status)) {
    throw createError({ statusCode: 422, message: 'Неизвестный статус' })
  }

  const data = db()

  const duplicate = data.clients.find(
    (c) => c.email.toLowerCase() === email.toLowerCase()
  )

  if (duplicate) {
    throw createError({
      statusCode: 409,
      message: 'Клиент с такой почтой уже есть'
    })
  }

  const client = {
    id: nextId(data.clients),
    name,
    company,
    email,
    phone,
    status,

    ownerId: user.id,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    note,
    createdAt: today()
  }

  data.clients.push(client)
  save()

  setResponseStatus(event, 201)
  return client
})
