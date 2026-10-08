export default defineEventHandler(async (event) => {
  requireUser(event)

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const data = db()
  const task = data.tasks.find((t) => t.id === id)

  if (!task) {
    throw createError({ statusCode: 404, message: 'Задача не найдена' })
  }

  if (body.done !== undefined) {
    task.done = Boolean(body.done)
  }

  save()
  return task
})
