const STATUSES = ['lead', 'active', 'churned']
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const ALLOWED = ['name', 'company', 'email', 'phone', 'status', 'note', 'tags']

export default defineEventHandler(async (event) => {
  requireUser(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const data = db()
  const client = data.clients.find((c) => c.id === id)

  if (!client) {
    throw createError({ statusCode: 404, message: 'Клиент не найден' })
  }

  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    throw createError({ statusCode: 422, message: 'Неизвестный статус' })
  }

  if (body.email !== undefined && !EMAIL.test(String(body.email))) {
    throw createError({ statusCode: 422, message: 'Некорректная почта' })
  }

  if (body.name !== undefined && String(body.name).trim().length < 2) {
    throw createError({ statusCode: 422, message: 'Укажите имя клиента' })
  }

  if (body.company !== undefined && String(body.company).trim().length < 2) {
    throw createError({ statusCode: 422, message: 'Укажите компанию' })
  }

  for (const field of ALLOWED) {
    if (body[field] === undefined) continue

    if (field === 'tags') {
      client.tags = Array.isArray(body.tags) ? body.tags.map(String) : []
    } else {
      client[field] = String(body[field]).trim()
    }
  }

  save()
  return client
})
