<script setup>

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const auth = useAuthStore()

const filter = ref(route.query.filter || 'open')
const onlyMine = ref(route.query.mine === 'true')

const ownerParam = computed(() => {
  if (!onlyMine.value) return undefined
  return auth.user ? String(auth.user.id) : undefined
})

const { data, pending, error, refresh } = await useFetch('/api/tasks', {
  query: {
    filter,
    owner: ownerParam
  }
})

const tasks = computed(() => (data.value ? data.value.items : []))
const counts = computed(() => (data.value ? data.value.counts : {}))

watch([filter, onlyMine], () => {
  router.replace({
    query: {
      filter: filter.value !== 'open' ? filter.value : undefined,
      mine: onlyMine.value ? 'true' : undefined
    }
  })
})

const TABS = [
  { id: 'open', label: 'Открытые', countKey: 'open' },
  { id: 'today', label: 'На сегодня', countKey: 'today' },
  { id: 'overdue', label: 'Просроченные', countKey: 'overdue' },
  { id: 'done', label: 'Выполненные', countKey: 'done' },
  { id: '', label: 'Все', countKey: null }
]

const showForm = ref(false)

async function onCreated() {
  showForm.value = false

  await refresh()
}

const togglingId = ref(null)

async function toggle(task) {
  togglingId.value = task.id

  try {
    await $fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: { done: !task.done }
    })

    await refresh()
  } catch (e) {
    ui.error('Не удалось обновить задачу')
  } finally {
    togglingId.value = null
  }
}

useSeoMeta({ title: 'Задачи' })
</script>

<template>
  <div>
    <header class="head">
      <div>
        <span class="label">
          {{ counts.open }} открытых<template v-if="counts.overdue">
            · {{ counts.overdue }} просрочено</template
          >
        </span>
        <h1>Задачи</h1>
      </div>

      <div class="head-actions">
        <BaseCheckbox v-model="onlyMine" label="Только мои" />

        <button class="btn btn-primary" @click="showForm = true">
          <AppIcon name="plus" :size="15" />
          Задача
        </button>
      </div>
    </header>

    <div class="tabs" role="tablist">
      <button
        v-for="tab in TABS"
        :key="tab.id"
        class="tab"
        :class="{ on: filter === tab.id }"
        role="tab"
        :aria-selected="filter === tab.id"
        @click="filter = tab.id"
      >
        {{ tab.label }}

        <span v-if="tab.countKey && counts[tab.countKey]" class="cnt num">
          {{ counts[tab.countKey] }}
        </span>
      </button>
    </div>

    <p v-if="error" class="error-text">Не удалось загрузить задачи</p>

    <EmptyState v-else-if="!tasks.length && !pending" icon="tasks">
      <template #title>Задач нет</template>
      В этом фильтре пусто. Попробуйте другой.
    </EmptyState>

    <ul v-else class="list" :class="{ dim: pending }">
      <li
        v-for="(task, index) in tasks"
        :key="task.id"
        class="card item rise"
        :class="{ done: task.done }"
        :style="{ '--i': index }"
      >
        <TaskRow :task="task" :busy="togglingId === task.id" @toggle="toggle" />
      </li>
    </ul>

    <BaseModal v-model:open="showForm" title="Новая задача" width="420px">
      <TaskForm @saved="onCreated" @cancel="showForm = false" />
    </BaseModal>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.head h1 {
  margin: 3px 0 0;
}

.head-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tabs {
  display: inline-flex;
  gap: 2px;
  margin-bottom: 14px;
  padding: 3px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  flex-wrap: wrap;
}

.tab {
  font: inherit;
  font-size: 12.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: var(--r-xs);
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  transition: background var(--fast) var(--ease), color var(--fast) var(--ease),
    transform var(--fast) var(--ease);
}

.tab:hover:not(.on) {
  color: var(--text);
}

.tab:active {
  transform: scale(0.97);
}

.tab.on {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text);
  font-weight: 500;
}

.cnt {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: var(--r-xs);
  background: var(--surface-3);
  color: var(--text-dim);
}

.tab.on .cnt {
  background: var(--accent-wash);
  color: var(--accent);
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 7px;
  transition: opacity var(--mid) var(--ease);
}

.dim {
  opacity: 0.6;
}

.item {
  padding: 10px 13px;
  transition: border-color var(--fast) var(--ease),
    background var(--fast) var(--ease);
}

.item:hover {
  border-color: var(--border-strong);
}

.item.done {
  background: var(--surface-2);
  border-color: transparent;
}
</style>
