export const STAGES = [
  { id: 'new', label: 'Новая' },
  { id: 'qualified', label: 'Квалифицирована' },
  { id: 'proposal', label: 'Предложение' },
  { id: 'won', label: 'Выиграна' },
  { id: 'lost', label: 'Проиграна' }
]

export default defineEventHandler((event) => {
  requireUser(event)

  const query = getQuery(event)
  const data = db()

  let deals = [...data.deals]

  if (query.owner) {
    deals = deals.filter((d) => d.ownerId === Number(query.owner))
  }

  deals = deals.map((deal) => {
    const client = data.clients.find((c) => c.id === deal.clientId)
    const owner = data.users.find((u) => u.id === deal.ownerId)

    return {
      ...deal,
      clientName: client ? client.name : '—',
      company: client ? client.company : '—',
      ownerName: owner ? owner.name : '—'
    }
  })

  const columns = []

  for (const stage of STAGES) {
    const items = deals.filter((d) => d.stage === stage.id)

    items.sort((a, b) => b.amount - a.amount)

    let amount = 0

    for (const deal of items) {
      amount = amount + deal.amount
    }

    columns.push({
      id: stage.id,
      label: stage.label,
      items: items,
      count: items.length,
      amount: amount
    })
  }

  return { columns: columns, total: deals.length, stages: STAGES }
})
