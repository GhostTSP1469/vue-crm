<script setup>
const route = useRoute()
const ui = useUiStore()
const auth = useAuthStore()
const { price, priceShort, date, dateLong, ago } = useFormat()

const { data, error, refresh } = await useFetch(`/api/clients/${route.params.id}`)

if (error.value) {
  throw createError({
    statusCode: 404,
    message: 'Клиент не найден',
    fatal: true
  })
}

const client = computed(() => data.value.client)
const deals = computed(() => data.value.deals)
const tasks = computed(() => data.value.tasks)
const activities = computed(() => data.value.activities)
const summary = computed(() => data.value.summary)

const openTasks = computed(() => tasks.value.filter((task) => !task.done))

const metrics = computed(() => [
  {
    label: 'Выручка',
    value: priceShort(summary.value.revenue),
    tone: 'success'
  },
  {
    label: 'В работе',
    value: priceShort(summary.value.pipeline),
    tone: 'accent'
  },
  {
    label: 'Сделок',
    value: summary.value.dealsCount,
    hint: `${openTasks.value.length} открытых задач`
  }
])

const STAGE_OPTIONS = [
  { value: 'new', label: 'Новая' },
  { value: 'qualified', label: 'Квалифицирована' },
  { value: 'proposal', label: 'Предложение' },
  { value: 'won', label: 'Выиграна' },
  { value: 'lost', label: 'Проиграна' }
]

const ACTIVITY_ICONS = {
  call: 'call',
  email: 'mail',
  meeting: 'meeting',
  note: 'note'
}

const showForm = ref(false)

async function onSaved() {
  showForm.value = false
  await refresh()
}

const showActivity = ref(false)

async function onActivitySaved() {
  showActivity.value = false
  await refresh()
}

const showTask = ref(false)

async function onTaskSaved() {
  showTask.value = false
  await refresh()
}

const editingDeal = ref(null)
const deletingDeal = ref(null)
const dealEdit = ref({ title: '', amount: 0 })
const isBusyDeal = ref(false)

function openDealEdit(deal) {
  editingDeal.value = deal

  dealEdit.value = { title: deal.title, amount: deal.amount }
}

async function saveDeal() {
  isBusyDeal.value = true

  try {
    await $fetch('/api/deals/' + editingDeal.value.id, {
      method: 'PATCH',
      body: {
        title: dealEdit.value.title,
        amount: Number(dealEdit.value.amount)
      }
    })

    ui.success('Сделка изменена')
    editingDeal.value = null
    await refresh()
  } catch (e) {
    ui.error((e.data && e.data.message) || 'Не удалось сохранить')
  } finally {
    isBusyDeal.value = false
  }
}

async function removeDeal() {
  isBusyDeal.value = true

  try {
    await $fetch('/api/deals/' + deletingDeal.value.id, { method: 'DELETE' })

    ui.success('Сделка удалена')
    deletingDeal.value = null
    await refresh()
  } catch (e) {
    ui.error('Не удалось удалить')
  } finally {
    isBusyDeal.value = false
  }
}

const showDeal = ref(false)

async function onDealCreated() {
  showDeal.value = false
  await refresh()
}

const movingId = ref(null)

async function moveDeal(deal, stage) {
  movingId.value = deal.id

  try {
    await $fetch(`/api/deals/${deal.id}`, {
      method: 'PATCH',
      body: { stage }
    })
    await refresh()
  } catch (e) {
    ui.error('Не удалось изменить этап')
  } finally {
    movingId.value = null
  }
}

const togglingId = ref(null)

async function toggleTask(task) {
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

useSeoMeta({ title: () => client.value.name })
</script>

<template>
  <div>
    <NuxtLink to="/clients" class="back">
      <AppIcon name="chevron-left" :size="13" :width="1.9" />
      Все клиенты
    </NuxtLink>

    <header class="head">
      <div class="who">
        <span class="mono" aria-hidden="true">{{ client.name[0] }}</span>

        <div>
          <span class="label">{{ client.company }}</span>
          <h1>{{ client.name }}</h1>

          <div class="tags">
            <StatusBadge :status="client.status" />

            <span v-for="tag in client.tags" :key="tag" class="tag">{{ tag }}</span>

            <span class="since">с {{ dateLong(client.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn" @click="showForm = true">
          <AppIcon name="edit" :size="14" />
          Изменить
        </button>

        <button class="btn btn-primary" @click="showDeal = true">
          <AppIcon name="plus" :size="15" />
          Сделка
        </button>
      </div>
    </header>

    <MetricRow :items="metrics" class="metrics" />

    <div class="cols">
      <div class="left">
        <section class="card panel">
          <h2 class="panel-title">Сделки</h2>

          <p v-if="!deals.length" class="empty-note">Сделок пока нет.</p>

          <ul v-else class="deals">
            <li
              v-for="deal in deals"
              :key="deal.id"
              :class="{ busy: movingId === deal.id }"
            >
              <div class="d-main">
                <strong>{{ deal.title }}</strong>
                <span class="d-meta">
                  создана {{ date(deal.createdAt) }}
                  <template v-if="deal.closedAt">
                    · закрыта {{ date(deal.closedAt) }}
                  </template>
                </span>
              </div>

              <strong class="num d-sum">{{ price(deal.amount) }}</strong>

              <BaseSelect
                :model-value="deal.stage"
                :options="STAGE_OPTIONS"
                size="sm"
                :disabled="movingId === deal.id"
                :aria-label="`Этап сделки «${deal.title}»`"
                class="stage"
                @update:model-value="moveDeal(deal, $event)"
              />

              <div class="d-actions">
                <button
                  class="btn btn-ghost mini"
                  :aria-label="`Изменить «${deal.title}»`"
                  @click="openDealEdit(deal)"
                >
                  <AppIcon name="edit" :size="13" :width="1.7" />
                </button>

                <button
                  v-if="auth.isAdmin"
                  class="btn btn-ghost mini danger"
                  :aria-label="`Удалить «${deal.title}»`"
                  @click="deletingDeal = deal"
                >
                  <AppIcon name="trash" :size="13" :width="1.7" />
                </button>
              </div>
            </li>
          </ul>
        </section>

        <section class="card panel">
          <header class="panel-head">
            <h2 class="panel-title">Задачи</h2>

            <button class="btn btn-ghost small" @click="showTask = true">
              <AppIcon name="plus" :size="13" />
              Добавить
            </button>
          </header>

          <p v-if="!tasks.length" class="empty-note">Задач нет.</p>

          <ul v-else class="tasks">
            <li v-for="task in tasks" :key="task.id">

              <TaskRow
                :task="task"
                :busy="togglingId === task.id"
                :show-client="false"
                @toggle="toggleTask"
              />
            </li>
          </ul>
        </section>
      </div>

      <div class="right">
        <section class="card panel">
          <h2 class="panel-title">Контакты</h2>

          <dl class="contacts">
            <dt>Почта</dt>
            <dd>
              <a :href="`mailto:${client.email}`">{{ client.email }}</a>
            </dd>

            <dt>Телефон</dt>
            <dd>{{ client.phone || '—' }}</dd>

            <dt>Ответственный</dt>
            <dd>{{ client.ownerName }}</dd>
          </dl>
        </section>

        <section v-if="client.note" class="card panel">
          <h2 class="panel-title">Заметка</h2>
          <p class="note">{{ client.note }}</p>
        </section>

        <section class="card panel">
          <header class="panel-head">
            <h2 class="panel-title">История</h2>

            <button class="btn btn-ghost small" @click="showActivity = true">
              <AppIcon name="plus" :size="13" />
              Записать
            </button>
          </header>

          <p v-if="!activities.length" class="empty-note">
            Событий нет. Запишите звонок или встречу — потом пригодится.
          </p>

          <ul v-else class="feed">
            <li v-for="item in activities" :key="item.id">
              <span class="type">
                <AppIcon :name="ACTIVITY_ICONS[item.type] || 'note'" :size="13" />
              </span>

              <span class="f-body">
                <span class="f-text">{{ item.text }}</span>
                <span class="f-meta">{{ ago(item.createdAt) }}</span>
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <BaseModal v-model:open="showForm" title="Изменить клиента" width="540px">
      <ClientForm :client="client" @saved="onSaved" @cancel="showForm = false" />
    </BaseModal>

    <BaseModal v-model:open="showActivity" title="Записать событие" width="420px">
      <ActivityForm
        :client-id="client.id"
        @saved="onActivitySaved"
        @cancel="showActivity = false"
      />
    </BaseModal>

    <BaseModal v-model:open="showTask" title="Новая задача" width="420px">
      <TaskForm
        :client-id="client.id"
        @saved="onTaskSaved"
        @cancel="showTask = false"
      />
    </BaseModal>

    <BaseModal
      :open="editingDeal !== null"
      title="Изменить сделку"
      width="400px"
      @update:open="editingDeal = null"
    >
      <form @submit.prevent="saveDeal">
        <div class="field">
          <label for="e-title">Название</label>
          <input id="e-title" v-model="dealEdit.title" class="input" />
        </div>

        <div class="field">
          <label for="e-amount">Сумма, ₽</label>
          <input
            id="e-amount"
            v-model.number="dealEdit.amount"
            class="input"
            type="number"
            min="1"
          />
        </div>

        <div class="form-actions">
          <button type="button" class="btn" @click="editingDeal = null">
            Отмена
          </button>

          <button type="submit" class="btn btn-primary" :disabled="isBusyDeal">
            {{ isBusyDeal ? 'Сохраняем…' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </BaseModal>

    <BaseModal
      :open="deletingDeal !== null"
      title="Удалить сделку?"
      width="380px"
      @update:open="deletingDeal = null"
    >
      <p>
        Сделка <strong>{{ deletingDeal && deletingDeal.title }}</strong> пропадёт
        из воронки и из статистики. Отменить это нельзя.
      </p>

      <template #footer>
        <button class="btn" @click="deletingDeal = null">Отмена</button>

        <button class="btn btn-danger" :disabled="isBusyDeal" @click="removeDeal">
          {{ isBusyDeal ? 'Удаляем…' : 'Удалить' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal v-model:open="showDeal" title="Новая сделка" width="420px">
      <DealForm
        :client-id="client.id"
        @saved="onDealCreated"
        @cancel="showDeal = false"
      />
    </BaseModal>
  </div>
</template>

<style scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 13px;
  color: var(--text-dim);
  margin-bottom: 14px;
  transition: color var(--fast) var(--ease);
}

.back:hover {
  color: var(--accent);
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.who {
  display: flex;
  gap: 13px;
  align-items: flex-start;
  min-width: 0;
}

.mono {
  flex: none;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  font-size: 19px;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-wash);
  border: 1px solid var(--accent-line);
  border-radius: 12px;
  margin-top: 3px;
}

.head h1 {
  margin: 2px 0 8px;
}

.tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
}

.tag {
  font-size: 11px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-xs);
  padding: 2px 7px;
  color: var(--text-dim);
}

.since {
  font-size: 11px;
  color: var(--text-faint);
}

.actions {
  display: flex;
  gap: 8px;
}

.metrics {
  margin-bottom: 11px;
}

.cols {
  display: grid;
  grid-template-columns: 1fr 290px;
  gap: 11px;
  align-items: start;
}

.left,
.right {
  display: grid;
  gap: 11px;
}

.panel {
  padding: 15px 16px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.empty-note {
  margin: 0;
  font-size: 13px;
  color: var(--text-faint);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.panel-head .panel-title {
  margin: 0;
}

.small {
  font-size: 12px;
  padding: 3px 7px;
}

.deals li {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 10px;
  align-items: center;
  padding: 9px 16px;
  margin: 0 -16px;
  border-bottom: 1px solid var(--border);
  transition: background var(--fast) var(--ease), opacity var(--fast) var(--ease);
}

.deals li:hover {
  background: var(--surface-2);
}

.deals li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.deals li.busy {
  opacity: 0.45;
  pointer-events: none;
}

.d-actions {
  display: flex;
  gap: 1px;
  opacity: 0;
  transition: opacity var(--fast) var(--ease);
}

.deals li:hover .d-actions,
.deals li:focus-within .d-actions {
  opacity: 1;
}

@media (hover: none) {
  .d-actions {
    opacity: 1;
  }
}

.mini {
  padding: 4px 6px;
}

.danger:hover {
  color: var(--danger);
}

.d-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.35;
}

.d-main strong {
  font-size: 13px;
  font-weight: 500;
}

.d-meta {
  font-size: 11px;
  color: var(--text-faint);
}

.d-sum {
  font-size: 13px;
}

.stage {
  width: 125px;
}

.tasks li {
  padding: 6px 16px;
  margin: 0 -16px;
  transition: background var(--fast) var(--ease);
}

.tasks li:hover {
  background: var(--surface-2);
}

.contacts {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 6px 14px;
  margin: 0;
  font-size: 12.5px;
}

.contacts dt {
  color: var(--text-faint);
}

.contacts dd {
  margin: 0;
  min-width: 0;

  overflow-wrap: anywhere;
}

.contacts a {
  color: var(--accent);
}

.note {
  margin: 0;
  font-size: 12.5px;
  color: var(--text-dim);
  line-height: 1.55;
}

.feed {
  display: grid;
  gap: 11px;
}

.feed li {
  display: flex;
  gap: 9px;
}

.type {
  flex: none;
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-dim);
}

.f-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.45;
}

.f-text {
  font-size: 12.5px;
}

.f-meta {
  font-size: 11px;
  color: var(--text-faint);
}

@media (max-width: 880px) {
  .cols {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .deals li {
    grid-template-columns: 1fr auto;
  }

  .stage {
    grid-column: 1 / -1;
    width: 100%;
  }
}
</style>
