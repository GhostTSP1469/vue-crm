export default defineEventHandler((event) => {
  requireUser(event)

  const id = Number(getRouterParam(event, 'id'))

  const data = db()
  const client = data.clients.find((c) => c.id === id)

  if (!client) {
    throw createError({ statusCode: 404, message: 'Клиент не найден' })
  }

  const owner = data.users.find((u) => u.id === client.ownerId)

  const deals = data.deals
    .filter((d) => d.clientId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const tasks = data.tasks
    .filter((t) => t.clientId === id)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

  const activities = data.activities
    .filter((a) => a.clientId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  let revenue = 0
  let pipeline = 0

  for (const deal of deals) {
    if (deal.stage === 'won') {
      revenue = revenue + deal.amount
    } else if (deal.stage !== 'lost') {
      pipeline = pipeline + deal.amount
    }
  }

  return {
    client: {
      ...client,
      ownerName: owner ? owner.name : '—'
    },
    deals: deals,
    tasks: tasks,
    activities: activities,
    summary: {
      revenue: revenue,
      pipeline: pipeline,
      dealsCount: deals.length
    }
  }
})
