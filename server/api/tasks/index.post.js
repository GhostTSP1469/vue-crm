export default defineEventHandler(async (event) => {
  const user = requireUser(event)
  const body = await readBody(event)

  const title = String(body.title || '').trim()
  const dueDate = String(body.dueDate || '')

  if (title.length < 3) {
    throw createError({ statusCode: 422, message: 'Слишком короткое название' })
  }

  const looksRight = /^\d{4}-\d{2}-\d{2}$/.test(dueDate)

  let exists = false

  if (looksRight) {
    const parts = dueDate.split('-')
    const year = Number(parts[0])
    const month = Number(parts[1])
    const day = Number(parts[2])

    const probe = new Date(year, month - 1, day)

    exists =
      probe.getFullYear() === year &&
      probe.getMonth() === month - 1 &&
      probe.getDate() === day
  }

  if (!exists) {
    throw createError({ statusCode: 422, message: 'Укажите корректный срок' })
  }

  const data = db()

  let clientId = null

  if (body.clientId) {
    const client = data.clients.find((c) => c.id === Number(body.clientId))

    if (!client) {
      throw createError({ statusCode: 422, message: 'Клиент не найден' })
    }

    clientId = client.id
  }

  const task = {
    id: nextId(data.tasks),
    title: title,
    clientId: clientId,
    dealId: null,
    dueDate: dueDate,
    done: false,

    assigneeId: user.id
  }

  data.tasks.push(task)
  save()

  setResponseStatus(event, 201)
  return task
})
