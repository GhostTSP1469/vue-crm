const TYPES = ['call', 'email', 'meeting', 'note']

export default defineEventHandler(async (event) => {
  requireUser(event)

  const body = await readBody(event)

  const clientId = Number(body.clientId)
  const type = String(body.type || '')
  const text = String(body.text || '').trim()

  if (!TYPES.includes(type)) {
    throw createError({ statusCode: 422, message: 'Неизвестный тип события' })
  }

  if (text.length < 3) {
    throw createError({ statusCode: 422, message: 'Слишком короткое описание' })
  }

  const data = db()
  const client = data.clients.find((c) => c.id === clientId)

  if (!client) {
    throw createError({ statusCode: 422, message: 'Клиент не найден' })
  }

  const activity = {
    id: nextId(data.activities),
    clientId: clientId,
    type: type,
    text: text,

    createdAt: new Date().toISOString()
  }

  data.activities.push(activity)
  save()

  setResponseStatus(event, 201)
  return activity
})
