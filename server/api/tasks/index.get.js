export default defineEventHandler((event) => {
  requireUser(event)

  const query = getQuery(event)
  const data = db()
  const now = today()

  let tasks = [...data.tasks]

  if (query.owner) {
    tasks = tasks.filter((t) => t.assigneeId === Number(query.owner))
  }

  if (query.filter === 'open') {
    tasks = tasks.filter((t) => !t.done)
  } else if (query.filter === 'done') {
    tasks = tasks.filter((t) => t.done)
  } else if (query.filter === 'today') {
    tasks = tasks.filter((t) => !t.done && t.dueDate === now)
  } else if (query.filter === 'overdue') {
    tasks = tasks.filter((t) => !t.done && t.dueDate < now)
  }

  tasks = tasks.map((task) => {
    const client = data.clients.find((c) => c.id === task.clientId)
    const assignee = data.users.find((u) => u.id === task.assigneeId)

    return {
      ...task,
      clientName: client ? client.name : null,
      assigneeName: assignee ? assignee.name : '—',
      isOverdue: !task.done && task.dueDate < now
    }
  })

  tasks.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1
    return a.dueDate.localeCompare(b.dueDate)
  })

  const all = data.tasks

  return {
    items: tasks,
    counts: {
      open: all.filter((t) => !t.done).length,
      today: all.filter((t) => !t.done && t.dueDate === now).length,
      overdue: all.filter((t) => !t.done && t.dueDate < now).length,
      done: all.filter((t) => t.done).length
    }
  }
})
