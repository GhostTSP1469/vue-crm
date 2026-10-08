<script setup>
const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const { plural } = useFormat()

const search = ref(route.query.q || '')
const status = ref(route.query.status || '')
const sort = ref(route.query.sort || '')
const page = ref(Number(route.query.page) || 1)

const searchForQuery = ref(search.value)

let timer = null

watch(search, (value) => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    searchForQuery.value = value
  }, 300)
})

onUnmounted(() => clearTimeout(timer))

const { data, pending, error, refresh } = await useFetch('/api/clients', {
  query: {
    q: searchForQuery,
    status,
    sort,
    page
  }
})

const rows = computed(() => (data.value ? data.value.items : []))
const total = computed(() => (data.value ? data.value.total : 0))
const pages = computed(() => (data.value ? data.value.pages : 1))

const hasFilters = computed(() => Boolean(search.value || status.value))

watch([searchForQuery, status], () => {
  page.value = 1
})

watch([searchForQuery, status, sort, page], () => {
  router.replace({
    query: {
      q: searchForQuery.value || undefined,
      status: status.value || undefined,
      sort: sort.value || undefined,
      page: page.value > 1 ? page.value : undefined
    }
  })
})

function resetFilters() {
  search.value = ''
  searchForQuery.value = ''
  status.value = ''
  sort.value = ''
  page.value = 1
}

const STATUS_OPTIONS = [
  { value: '', label: 'Все статусы' },
  { value: 'lead', label: 'Лиды' },
  { value: 'active', label: 'Активные' },
  { value: 'churned', label: 'Потерянные' }
]

function onSort(field) {
  sort.value = sort.value === field ? '' : field
}

function openClient(client) {
  return navigateTo(`/clients/${client.id}`)
}

const showForm = ref(false)
const editing = ref(null)

function openCreate() {
  editing.value = null
  showForm.value = true
}

function openEdit(client) {
  editing.value = client
  showForm.value = true
}

async function onSaved() {
  showForm.value = false

  await refresh()
}

const deleting = ref(null)
const isDeleting = ref(false)

async function confirmDelete() {
  isDeleting.value = true

  try {
    await $fetch(`/api/clients/${deleting.value.id}`, { method: 'DELETE' })
    ui.success(`${deleting.value.name} удалён`)
    deleting.value = null
    await refresh()
  } catch (e) {
    ui.error((e.data && e.data.message) || 'Не удалось удалить')
  } finally {
    isDeleting.value = false
  }
}

const isExporting = ref(false)

async function exportCsv() {
  isExporting.value = true

  let all = []

  try {
    const res = await $fetch('/api/clients', {
      query: {
        q: searchForQuery.value || undefined,
        status: status.value || undefined,
        sort: sort.value || undefined,
        perPage: 100
      }
    })

    all = res.items
  } catch (e) {
    ui.error('Не удалось собрать файл')
    isExporting.value = false
    return
  }

  const header = ['Имя', 'Компания', 'Почта', 'Телефон', 'Статус', 'Выручка']

  const lines = all.map((row) => [
    row.name,
    row.company,
    row.email,
    row.phone,
    row.status,
    row.revenue
  ])

  const csv = [header, ...lines]
    .map((cells) =>
      cells

        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'clients.csv'
  link.click()

  URL.revokeObjectURL(url)

  const word = plural(all.length, 'клиент', 'клиента', 'клиентов')
  ui.success(`Выгружено: ${all.length} ${word}`)
  isExporting.value = false
}

useSeoMeta({ title: 'Клиенты' })
</script>

<template>
  <div>
    <header class="head">
      <div>
        <span class="label">
          {{ total }} {{ plural(total, 'запись', 'записи', 'записей') }}
        </span>
        <h1>Клиенты</h1>
      </div>

      <div class="head-actions">
        <button
          class="btn"
          :disabled="!rows.length || isExporting"
          @click="exportCsv"
        >
          <AppIcon name="download" :size="15" />
          CSV
        </button>

        <button class="btn btn-primary" @click="openCreate">
          <AppIcon name="plus" :size="15" />
          Добавить
        </button>
      </div>
    </header>

    <div class="filters">
      <label class="search">
        <AppIcon name="search" :size="15" class="s-ico" />
        <input
          v-model.trim="search"
          class="input"
          type="search"
          placeholder="Имя, компания или почта"
        />
      </label>

      <BaseSelect
        v-model="status"
        :options="STATUS_OPTIONS"
        class="filter-sel"
        aria-label="Фильтр по статусу"
      />

      <button v-if="hasFilters" class="btn btn-ghost" @click="resetFilters">
        <AppIcon name="close" :size="13" :width="1.9" />
        Сбросить
      </button>
    </div>

    <p v-if="error" class="error-text">
      Не удалось загрузить список: {{ error.message }}
    </p>

    <template v-else>
      <ClientsTable
        :rows="rows"
        :sort="sort"
        :loading="pending"
        @sort="onSort"
        @open="openClient"
        @edit="openEdit"
        @remove="(row) => (deleting = row)"
      >
        <template #empty>
          {{ hasFilters ? 'Под фильтры никто не подходит' : 'Клиентов пока нет' }}
        </template>
      </ClientsTable>

      <AppPagination v-model="page" :pages="pages" />
    </template>

    <BaseModal
      v-model:open="showForm"
      :title="editing ? 'Изменить клиента' : 'Новый клиент'"
      width="540px"
    >
      <ClientForm :client="editing" @saved="onSaved" @cancel="showForm = false" />
    </BaseModal>

    <BaseModal
      :open="deleting !== null"
      title="Удалить клиента?"
      width="390px"
      @update:open="deleting = null"
    >
      <p>
        Вместе с <strong>{{ deleting && deleting.name }}</strong> удалятся его
        сделки, задачи и история. Отменить это нельзя.
      </p>

      <template #footer>
        <button class="btn" @click="deleting = null">Отмена</button>

        <button class="btn btn-danger" :disabled="isDeleting" @click="confirmDelete">
          {{ isDeleting ? 'Удаляем…' : 'Удалить' }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.head h1 {
  margin: 3px 0 0;
}

.head-actions {
  display: flex;
  gap: 8px;
}

.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 250px;
}

.s-ico {
  position: absolute;
  left: 10px;
  color: var(--text-faint);

  pointer-events: none;
}

.search .input {
  padding-left: 31px;
}

.filter-sel {
  flex: 0 1 170px;
}

@media (max-width: 620px) {
  .head {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
