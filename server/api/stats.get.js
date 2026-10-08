const MONTH_NAMES = [
  'янв', 'фев', 'мар', 'апр', 'май', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
]

function lastMonths(count) {
  const result = []
  const now = new Date()

  for (let back = count - 1; back >= 0; back--) {
    const date = new Date(now.getFullYear(), now.getMonth() - back, 1)

    const year = date.getFullYear()
    let month = date.getMonth() + 1

    if (month < 10) {
      month = '0' + month
    }

    result.push({
      key: year + '-' + month,
      label: MONTH_NAMES[date.getMonth()]
    })
  }

  return result
}

function sumAmount(deals) {
  let total = 0

  for (const deal of deals) {
    total = total + deal.amount
  }

  return total
}

export default defineEventHandler((event) => {
  requireUser(event)

  const data = db()
  const now = today()

  const months = lastMonths(6)
  const thisMonth = months[months.length - 1].key
  const prevMonth = months[months.length - 2].key

  const won = []
  const lost = []
  const open = []

  for (const deal of data.deals) {
    if (deal.stage === 'won') {
      won.push(deal)
    } else if (deal.stage === 'lost') {
      lost.push(deal)
    } else {
      open.push(deal)
    }
  }

  const revenue = sumAmount(won)
  const pipeline = sumAmount(open)
  const closedCount = won.length + lost.length

  function revenueOfMonth(monthKey) {
    const dealsOfMonth = []

    for (const deal of won) {
      if (deal.closedAt && deal.closedAt.slice(0, 7) === monthKey) {
        dealsOfMonth.push(deal)
      }
    }

    return sumAmount(dealsOfMonth)
  }

  const monthRevenue = revenueOfMonth(thisMonth)
  const prevRevenue = revenueOfMonth(prevMonth)

  let revenueDelta = null

  if (prevRevenue > 0) {
    const change = (monthRevenue - prevRevenue) / prevRevenue
    revenueDelta = Math.round(change * 100)
  }

  let activeClients = 0
  let leads = 0
  let newClients = 0

  for (const client of data.clients) {
    if (client.status === 'active') activeClients++
    if (client.status === 'lead') leads++
    if (client.createdAt.slice(0, 7) === thisMonth) newClients++
  }

  let tasksOpen = 0
  let tasksDone = 0
  let tasksOverdue = 0

  for (const task of data.tasks) {
    if (task.done) {
      tasksDone++
    } else {
      tasksOpen++

      if (task.dueDate < now) tasksOverdue++
    }
  }

  const stages = [
    { id: 'new', label: 'Новые' },
    { id: 'qualified', label: 'Квалифицированы' },
    { id: 'proposal', label: 'Предложение' },
    { id: 'won', label: 'Выиграны' },
    { id: 'lost', label: 'Проиграны' }
  ]

  const funnel = []

  for (const stage of stages) {
    const dealsOfStage = data.deals.filter((d) => d.stage === stage.id)

    funnel.push({
      id: stage.id,
      label: stage.label,
      count: dealsOfStage.length,
      amount: sumAmount(dealsOfStage)
    })
  }

  const revenueByMonth = []

  for (const month of months) {
    revenueByMonth.push({
      key: month.key,
      label: month.label,
      amount: revenueOfMonth(month.key)
    })
  }

  const byOwner = []

  for (const user of data.users) {
    const ownerWon = won.filter((d) => d.ownerId === user.id)
    const ownerOpen = open.filter((d) => d.ownerId === user.id)
    const ownerClients = data.clients.filter((c) => c.ownerId === user.id)

    byOwner.push({
      id: user.id,
      name: user.name,
      clients: ownerClients.length,
      openDeals: ownerOpen.length,
      revenue: sumAmount(ownerWon)
    })
  }

  const sortedOpen = [...open]
  sortedOpen.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const recentDeals = []

  for (const deal of sortedOpen.slice(0, 5)) {
    const client = data.clients.find((c) => c.id === deal.clientId)

    recentDeals.push({
      id: deal.id,
      clientId: deal.clientId,
      title: deal.title,
      amount: deal.amount,
      stage: deal.stage,
      clientName: client ? client.name : '—'
    })
  }

  const sortedActivity = [...data.activities]
  sortedActivity.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const recentActivity = []

  for (const item of sortedActivity.slice(0, 6)) {
    const client = data.clients.find((c) => c.id === item.clientId)

    recentActivity.push({
      id: item.id,
      clientId: item.clientId,
      type: item.type,
      text: item.text,
      createdAt: item.createdAt,
      clientName: client ? client.name : '—'
    })
  }

  return {
    cards: {
      revenue,
      pipeline,
      openDeals: open.length,
      clients: data.clients.length,
      activeClients,
      leads,
      newClients,

      conversion: closedCount > 0
        ? Math.round((won.length / closedCount) * 100)
        : 0,
      avgDeal: won.length > 0 ? Math.round(revenue / won.length) : 0,
      tasksOpen,
      tasksDone,
      tasksTotal: data.tasks.length,
      tasksOverdue,
      monthRevenue,
      revenueDelta
    },
    funnel,
    revenueByMonth,
    byOwner,
    recentDeals,
    recentActivity
  }
})
