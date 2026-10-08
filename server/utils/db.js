import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import seed from '../data/seed.json'

const FOLDER = '.data'
const FILE = FOLDER + '/crm.json'

let cache = null

const DAY = 86400000

function shiftDate(value, days) {
  const date = new Date(value)
  date.setTime(date.getTime() + days * DAY)

  const full = date.toISOString()

  if (value.length === 10) {
    return full.slice(0, 10)
  }

  return full
}

function shiftToToday(data) {
  const happened = []

  for (const client of data.clients) {
    happened.push(client.createdAt)
  }

  for (const deal of data.deals) {
    happened.push(deal.createdAt)

    if (deal.closedAt) {
      happened.push(deal.closedAt)
    }
  }

  for (const activity of data.activities) {
    happened.push(activity.createdAt)
  }

  let latest = 0

  for (const value of happened) {
    const time = new Date(value).getTime()

    if (time > latest) {
      latest = time
    }
  }

  const days = Math.round((Date.now() - latest) / DAY)

  if (days <= 0) {
    return data
  }

  for (const client of data.clients) {
    client.createdAt = shiftDate(client.createdAt, days)
  }

  for (const deal of data.deals) {
    deal.createdAt = shiftDate(deal.createdAt, days)

    if (deal.closedAt) {
      deal.closedAt = shiftDate(deal.closedAt, days)
    }
  }

  for (const task of data.tasks) {
    task.dueDate = shiftDate(task.dueDate, days)
  }

  for (const activity of data.activities) {
    activity.createdAt = shiftDate(activity.createdAt, days)
  }

  return data
}

export function db() {
  if (cache) {
    return cache
  }

  if (existsSync(FILE)) {
    cache = JSON.parse(readFileSync(FILE, 'utf8'))
  } else {
    const copy = JSON.parse(JSON.stringify(seed))

    cache = shiftToToday(copy)
    save()
  }

  return cache
}

export function save() {
  mkdirSync(FOLDER, { recursive: true })
  writeFileSync(FILE, JSON.stringify(cache, null, 2), 'utf8')
}

export function nextId(list) {
  let max = 0

  for (const item of list) {
    if (item.id > max) {
      max = item.id
    }
  }

  return max + 1
}

export function today() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
