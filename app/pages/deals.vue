<script setup>

const ui = useUiStore()
const auth = useAuthStore()
const { priceShort, plural } = useFormat()

const owner = ref('')

const { data, pending, error, refresh } = await useFetch('/api/deals', {
  query: { owner }
})

const columns = computed(() => (data.value ? data.value.columns : []))
const stages = computed(() => (data.value ? data.value.stages : []))
const total = computed(() => (data.value ? data.value.total : 0))

const sum = computed(() => {
  let total = 0

  for (const column of columns.value) {
    total = total + column.amount
  }

  return total
})

const ownerOptions = computed(() => [
  { value: '', label: 'Все менеджеры' },
  { value: String(auth.user ? auth.user.id : ''), label: 'Только мои' }
])

const movingId = ref(null)

async function move(deal, stage) {
  if (deal.stage === stage) return

  movingId.value = deal.id

  try {
    await $fetch(`/api/deals/${deal.id}`, {
      method: 'PATCH',
      body: { stage }
    })

    const label = stages.value.find((s) => s.id === stage)
    ui.success(`«${deal.title}» → ${label ? label.label : stage}`)

    await refresh()
  } catch (e) {
    ui.error('Не удалось перенести сделку')
  } finally {
    movingId.value = null
  }
}

useSeoMeta({ title: 'Сделки' })
</script>

<template>
  <div>
    <header class="head">
      <div>
        <span class="label">
          {{ total }} {{ plural(total, 'сделка', 'сделки', 'сделок') }} на
          {{ priceShort(sum) }}
        </span>
        <h1>Сделки</h1>
      </div>

      <BaseSelect
        v-model="owner"
        :options="ownerOptions"
        class="narrow"
        aria-label="Фильтр по менеджеру"
      />
    </header>

    <p v-if="error" class="error-text">Не удалось загрузить доску</p>

    <div v-else class="board thin-scroll" :class="{ dim: pending }">
      <section
        v-for="(column, index) in columns"
        :key="column.id"
        class="col rise"
        :style="{ '--i': index }"
      >
        <header class="col-head" :class="`h-${column.id}`">
          <span class="col-name">
            {{ column.label }}
            <span class="col-count num">{{ column.count }}</span>
          </span>

          <span class="col-sum num">{{ priceShort(column.amount) }}</span>
        </header>

        <div class="col-body">
          <DealCard
            v-for="deal in column.items"
            :key="deal.id"
            :deal="deal"
            :stages="stages"
            :busy="movingId === deal.id"
            @move="move"
          />

          <p v-if="!column.items.length" class="col-empty">Пусто</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.head h1 {
  margin: 3px 0 0;
}

.narrow {
  width: 170px;
}

.board {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(225px, 1fr);
  gap: 11px;
  overflow-x: auto;

  padding: 6px 4px 12px;
  margin: -6px -4px 0;
  transition: opacity var(--mid) var(--ease);
}

.dim {
  opacity: 0.6;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.col-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 9px;
  border-radius: var(--r-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);

  border-top: 2px solid var(--text-faint);
}

.h-qualified {
  border-top-color: var(--accent);
}
.h-proposal {
  border-top-color: var(--warn);
}
.h-won {
  border-top-color: var(--success);
}
.h-lost {
  border-top-color: var(--danger);
}

.col-name {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 520;
}

.col-count {
  font-size: 10px;
  color: var(--text-dim);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xs);
  padding: 0 4px;
}

.col-sum {
  font-size: 11px;
  color: var(--text-faint);
}

.col-body {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-top: 6px;
}

.col-empty {
  margin: 0;
  font-size: 12px;
  color: var(--text-faint);
  padding: 16px 2px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: var(--r-sm);
}
</style>
