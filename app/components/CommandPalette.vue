<script setup>
const ui = useUiStore()
const { priceShort } = useFormat()

const open = ref(false)
const query = ref('')
const results = ref({ clients: [], deals: [], tasks: [] })
const isLoading = ref(false)

const active = ref(0)

const inputEl = ref(null)

const LINKS = [
  { label: 'Дашборд', to: '/', icon: 'dashboard' },
  { label: 'Клиенты', to: '/clients', icon: 'clients' },
  { label: 'Сделки', to: '/deals', icon: 'deals' },
  { label: 'Задачи', to: '/tasks', icon: 'tasks' }
]

const items = computed(() => {
  const list = []

  if (!query.value.trim()) {
    for (const link of LINKS) {
      list.push({
        icon: link.icon,
        title: link.label,
        subtitle: 'Перейти',
        to: link.to
      })
    }

    return list
  }

  for (const client of results.value.clients) {
    list.push({
      icon: 'clients',
      title: client.title,
      subtitle: client.subtitle,
      to: '/clients/' + client.id
    })
  }

  for (const deal of results.value.deals) {
    list.push({
      icon: 'deals',
      title: deal.title,
      subtitle: deal.subtitle + ' · ' + priceShort(deal.amount),
      to: '/clients/' + deal.clientId
    })
  }

  for (const task of results.value.tasks) {
    let link = '/tasks'

    if (task.clientId) {
      link = '/clients/' + task.clientId
    }

    list.push({
      icon: 'tasks',
      title: task.title,
      subtitle: task.subtitle,
      to: link
    })
  }

  return list
})

let timer = null

watch(query, (value) => {
  clearTimeout(timer)
  active.value = 0

  if (!value.trim()) {
    results.value = { clients: [], deals: [], tasks: [] }
    return
  }

  isLoading.value = true

  timer = setTimeout(async () => {
    try {
      results.value = await $fetch('/api/search', { query: { q: value } })
    } catch (e) {
      ui.error('Поиск не ответил')
    } finally {
      isLoading.value = false
    }
  }, 250)
})

function show() {
  open.value = true
  query.value = ''
  active.value = 0

  nextTick(() => {
    if (inputEl.value) inputEl.value.focus()
  })
}

function hide() {
  open.value = false
  clearTimeout(timer)
}

async function go(item) {
  hide()
  await navigateTo(item.to)
}

function onKeydown(event) {
  const isCombo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'

  if (isCombo) {
    event.preventDefault()
    open.value ? hide() : show()
    return
  }

  if (!open.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    hide()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    move(1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    move(-1)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const item = items.value[active.value]
    if (item) go(item)
  }
}

function move(step) {
  const total = items.value.length
  if (total === 0) return

  let next = active.value + step

  if (next < 0) {
    next = total - 1
  }

  if (next >= total) {
    next = 0
  }

  active.value = next
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  clearTimeout(timer)
})

defineExpose({ show })
</script>

<template>
  <div v-if="open" class="backdrop" @click.self="hide">
    <div class="palette" role="dialog" aria-modal="true" aria-label="Поиск по CRM">
      <div class="field">
        <AppIcon name="search" :size="16" class="ico" />

        <input
          ref="inputEl"
          v-model="query"
          class="query"
          type="text"
          placeholder="Клиент, сделка, задача…"
          aria-label="Поисковый запрос"
        />

        <kbd>esc</kbd>
      </div>

      <div class="results thin-scroll">
        <p v-if="isLoading" class="status">Ищем…</p>

        <p v-else-if="!items.length" class="status">
          Ничего не нашлось по запросу «{{ query }}»
        </p>

        <ul v-else>
          <li v-for="(item, index) in items" :key="item.to + item.title">

            <button
              type="button"
              class="row"
              :class="{ on: index === active }"
              @click="go(item)"
              @mousemove="active = index"
            >
              <span class="badge">
                <AppIcon :name="item.icon" :size="14" />
              </span>

              <span class="texts">
                <span class="title">{{ item.title }}</span>
                <span class="subtitle">{{ item.subtitle }}</span>
              </span>

              <AppIcon
                v-if="index === active"
                name="arrow-right"
                :size="13"
                class="go"
              />
            </button>
          </li>
        </ul>
      </div>

      <footer class="hints">
        <span><kbd>↑</kbd><kbd>↓</kbd> выбрать</span>
        <span><kbd>enter</kbd> открыть</span>
        <span><kbd>ctrl</kbd><kbd>K</kbd> вызвать</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  justify-content: center;

  padding: 12vh 20px 20px;
  background: rgb(13 16 22 / 0.5);
  backdrop-filter: blur(3px);
  animation: fade var(--fast) var(--ease);
}

.palette {
  width: 100%;
  max-width: 560px;
  max-height: 70dvh;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: pop 220ms var(--ease);
}

.field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  border-bottom: 1px solid var(--border);
}

.ico {
  color: var(--text-faint);
}

.query {
  flex: 1;
  font: inherit;
  font-size: 15px;
  border: none;
  background: transparent;
  color: var(--text);

  outline: none;
  min-width: 0;
}

.query::placeholder {
  color: var(--text-faint);
}

.results {
  flex: 1;
  overflow-y: auto;
  padding: 6px;
}

.results ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.status {
  margin: 0;
  padding: 26px 14px;
  text-align: center;
  font-size: 13px;
  color: var(--text-dim);
}

.row {
  font: inherit;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 8px 9px;
  border: none;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  text-align: left;
}

.row.on {
  background: var(--accent-wash);
}

.badge {
  flex: none;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: var(--r-xs);
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-dim);
}

.row.on .badge {
  color: var(--accent);
  border-color: var(--accent-line);
}

.texts {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.35;
}

.title {
  font-size: 13.5px;
  font-weight: 480;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
  font-size: 11.5px;
  color: var(--text-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.go {
  margin-left: auto;
  color: var(--accent);
}

.hints {
  display: flex;
  gap: 14px;
  padding: 9px 14px;
  border-top: 1px solid var(--border);
  background: var(--surface-2);
  font-size: 11px;
  color: var(--text-faint);
}

.hints span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

kbd {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 10px;
  line-height: 1;
  padding: 3px 5px;
  color: var(--text-dim);
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: 4px;
}

@media (max-width: 560px) {
  .hints span:last-child {
    display: none;
  }
}
</style>
