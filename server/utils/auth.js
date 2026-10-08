export const COOKIE = 'crm_session'

export const ADMIN = 'Руководитель'
export const MANAGER = 'Менеджер'

export function startSession(event, userId) {
  setCookie(event, COOKIE, String(userId), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function endSession(event) {
  deleteCookie(event, COOKIE, { path: '/' })
}

export function currentUser(event) {
  const raw = getCookie(event, COOKIE)
  if (!raw) return null

  const id = Number(raw)
  const user = db().users.find((u) => u.id === id)
  if (!user) return null

  const { password, ...safe } = user
  return safe
}

export function requireUser(event) {
  const user = currentUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Нужно войти в систему'
    })
  }

  return user
}

export function requireAdmin(event) {
  const user = requireUser(event)

  if (user.role !== ADMIN) {
    throw createError({
      statusCode: 403,
      message: 'Удалять записи может только руководитель'
    })
  }

  return user
}
