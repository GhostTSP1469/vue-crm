const LIFETIME = 15 * 60 * 1000

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = String(body.email || '').trim().toLowerCase()

  const data = db()
  const user = data.users.find((u) => u.email.toLowerCase() === email)

  if (!data.resets) {
    data.resets = []
  }

  if (!user) {
    return { sent: true }
  }

  data.resets = data.resets.filter((r) => r.userId !== user.id)

  const code = String(Math.floor(100000 + Math.random() * 900000))

  data.resets.push({
    userId: user.id,
    code: code,

    expires: Date.now() + LIFETIME
  })

  save()

  return { sent: true, code: code }
})
