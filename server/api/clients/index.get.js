const PER_PAGE = 8

export default defineEventHandler((event) => {
  requireUser(event)

  const query = getQuery(event)
  const data = db()

  let list = [...data.clients]

  const search = String(query.q || '').trim().toLowerCase()

  if (search) {
    list = list.filter((client) => {
      const name = client.name.toLowerCase()
      const company = client.company.toLowerCase()
      const email = client.email.toLowerCase()

      return (
        name.includes(search) ||
        company.includes(search) ||
        email.includes(search)
      )
    })
  }

  if (query.status) {
    list = list.filter((client) => client.status === query.status)
  }

  const enriched = []

  for (const client of list) {
    const clientDeals = data.deals.filter((d) => d.clientId === client.id)
    const owner = data.users.find((u) => u.id === client.ownerId)

    let revenue = 0

    for (const deal of clientDeals) {
      if (deal.stage === 'won') {
        revenue = revenue + deal.amount
      }
    }

    enriched.push({
      ...client,
      ownerName: owner ? owner.name : '—',
      dealsCount: clientDeals.length,
      revenue: revenue
    })
  }

  if (query.sort === 'name') {
    enriched.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  } else if (query.sort === 'revenue') {
    enriched.sort((a, b) => b.revenue - a.revenue)
  } else {
    enriched.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  let perPage = Number(query.perPage) || PER_PAGE

  if (perPage > 100) {
    perPage = 100
  }

  if (perPage < 1) {
    perPage = PER_PAGE
  }

  let page = Number(query.page) || 1

  if (page < 1) {
    page = 1
  }

  const start = (page - 1) * perPage
  const items = enriched.slice(start, start + perPage)

  let pages = Math.ceil(enriched.length / perPage)
  if (pages < 1) pages = 1

  return {
    items: items,
    total: enriched.length,
    page: page,
    pages: pages
  }
})
