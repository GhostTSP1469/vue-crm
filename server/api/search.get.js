const LIMIT = 5

export default defineEventHandler((event) => {
  requireUser(event)

  const query = getQuery(event)
  const search = String(query.q || '').trim().toLowerCase()

  if (!search) {
    return { clients: [], deals: [], tasks: [] }
  }

  const data = db()

  const clients = []

  for (const client of data.clients) {
    if (clients.length >= LIMIT) break

    const name = client.name.toLowerCase()
    const company = client.company.toLowerCase()
    const email = client.email.toLowerCase()

    const found =
      name.includes(search) ||
      company.includes(search) ||
      email.includes(search)

    if (found) {
      clients.push({
        id: client.id,
        title: client.name,
        subtitle: client.company
      })
    }
  }

  const deals = []

  for (const deal of data.deals) {
    if (deals.length >= LIMIT) break

    if (deal.title.toLowerCase().includes(search)) {
      const client = data.clients.find((c) => c.id === deal.clientId)

      deals.push({
        id: deal.id,
        clientId: deal.clientId,
        title: deal.title,
        subtitle: client ? client.name : '—',
        amount: deal.amount
      })
    }
  }

  const tasks = []

  for (const task of data.tasks) {
    if (tasks.length >= LIMIT) break

    if (task.title.toLowerCase().includes(search)) {
      let subtitle = 'до ' + task.dueDate

      if (task.done) {
        subtitle = 'выполнена'
      }

      tasks.push({
        id: task.id,
        clientId: task.clientId,
        title: task.title,
        subtitle: subtitle
      })
    }
  }

  return { clients: clients, deals: deals, tasks: tasks }
})
