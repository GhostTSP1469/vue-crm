export function useFormat() {
  function price(value) {
    const number = value || 0

    const formatted = new Intl.NumberFormat('ru-RU').format(number)

    return formatted + ' ₽'
  }

  function priceShort(value) {
    const number = value || 0

    if (number >= 1000000) {
      const millions = number / 1000000

      return millions.toFixed(1).replace('.', ',') + ' млн ₽'
    }

    if (number >= 10000) {
      const thousands = Math.round(number / 1000)
      return thousands + ' тыс ₽'
    }

    return price(number)
  }

  function date(value) {
    if (!value) return '—'

    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short'
    }).format(new Date(value))
  }

  function dateLong(value) {
    if (!value) return '—'

    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(value))
  }

  function ago(value) {
    if (!value) return '—'

    const diff = Date.now() - new Date(value).getTime()
    const hours = Math.round(diff / 3600000)
    const days = Math.round(diff / 86400000)

    const rtf = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto' })

    if (days < 1) {
      return rtf.format(-hours, 'hour')
    }

    if (days < 30) {
      return rtf.format(-days, 'day')
    }

    return dateLong(value)
  }

  function plural(n, one, few, many) {
    const lastDigit = n % 10
    const lastTwo = n % 100

    if (lastTwo >= 11 && lastTwo <= 14) {
      return many
    }

    if (lastDigit === 1) {
      return one
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return few
    }

    return many
  }

  return { price, priceShort, date, dateLong, ago, plural }
}
