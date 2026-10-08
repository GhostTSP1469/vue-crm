const STAGE_IDS = ['new', 'qualified', 'proposal', 'won', 'lost']
const CLOSED = ['won', 'lost']

const MAX_AMOUNT = 1000000000

export default defineEventHandler(async (event) => {
  requireUser(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const data = db()
  const deal = data.deals.find((d) => d.id === id)

  if (!deal) {
    throw createError({ statusCode: 404, message: 'Сделка не найдена' })
  }

  if (body.stage !== undefined) {
    const stage = String(body.stage)

    if (!STAGE_IDS.includes(stage)) {
      throw createError({ statusCode: 422, message: 'Неизвестный этап' })
    }

    deal.stage = stage

    deal.closedAt = CLOSED.includes(stage) ? today() : null
  }

  if (body.amount !== undefined) {
    const amount = Number(body.amount)

    if (!Number.isFinite(amount) || amount < 0 || amount > MAX_AMOUNT) {
      throw createError({ statusCode: 422, message: 'Некорректная сумма' })
    }

    deal.amount = Math.round(amount)
  }

  save()
  return deal
})
