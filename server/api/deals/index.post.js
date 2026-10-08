const MAX_AMOUNT = 1000000000

export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)

  const title = String(body.title || '').trim()
  const amount = Number(body.amount)
  const clientId = Number(body.clientId)

  if (title.length < 3) {
    throw createError({ statusCode: 422, message: 'Название слишком короткое' })
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({ statusCode: 422, message: 'Укажите сумму' })
  }

  if (amount > MAX_AMOUNT) {
    throw createError({ statusCode: 422, message: 'Сумма слишком большая' })
  }

  const data = db()
  const client = data.clients.find((c) => c.id === clientId)

  if (!client) {
    throw createError({ statusCode: 422, message: 'Клиент не найден' })
  }

  const deal = {
    id: nextId(data.deals),
    clientId,
    title,
    amount: Math.round(amount),
    stage: 'new',
    ownerId: user.id,
    createdAt: today(),
    closedAt: null
  }

  data.deals.push(deal)
  save()

  setResponseStatus(event, 201)
  return deal
})
