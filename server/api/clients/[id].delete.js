export default defineEventHandler((event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const data = db()

  const index = data.clients.findIndex((c) => c.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Клиент не найден' })
  }

  data.clients.splice(index, 1)

  data.deals = data.deals.filter((d) => d.clientId !== id)
  data.tasks = data.tasks.filter((t) => t.clientId !== id)
  data.activities = data.activities.filter((a) => a.clientId !== id)

  save()

  setResponseStatus(event, 204)
  return null
})
