export default defineEventHandler((event) => {
  requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  const data = db()

  const index = data.deals.findIndex((d) => d.id === id)

  if (index === -1) {
    throw createError({ statusCode: 404, message: 'Сделка не найдена' })
  }

  data.deals.splice(index, 1)

  for (const task of data.tasks) {
    if (task.dealId === id) {
      task.dealId = null
    }
  }

  save()

  setResponseStatus(event, 204)
  return null
})
