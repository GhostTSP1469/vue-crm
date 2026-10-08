<script setup>

const props = defineProps({
  cards: { type: Object, required: true },

  funnel: { type: Array, required: true },

  months: { type: Array, required: true }
})

const { price, priceShort, plural } = useFormat()

const SPARK_W = 72
const SPARK_H = 22

const sparkPath = computed(() => {
  const months = props.months
  const count = months.length

  let max = 1

  for (const month of months) {
    if (month.amount > max) {
      max = month.amount
    }
  }

  let path = ''

  for (let i = 0; i < count; i++) {
    let ratio = 0.5

    if (count > 1) {
      ratio = i / (count - 1)
    }

    const x = ratio * SPARK_W

    const height = (months[i].amount / max) * (SPARK_H - 3)
    const y = SPARK_H - height - 1.5

    const command = i === 0 ? 'M' : 'L'

    path = path + command + x.toFixed(1) + ',' + y.toFixed(1) + ' '
  }

  return path
})

const openStages = computed(() => {
  return props.funnel.filter(
    (stage) => stage.id !== 'won' && stage.id !== 'lost'
  )
})

const openTotal = computed(() => {
  let sum = 0

  for (const stage of openStages.value) {
    sum = sum + stage.amount
  }

  if (sum === 0) return 1

  return sum
})

const clientParts = computed(() => {
  const all = props.cards.clients
  const active = props.cards.activeClients
  const leads = props.cards.leads

  const rest = all - active - leads

  return [
    { id: 'active', label: 'активные', value: active },
    { id: 'lead', label: 'лиды', value: leads },
    { id: 'rest', label: 'потерянные', value: rest }
  ]
})

const clientsTotal = computed(() => {
  if (props.cards.clients === 0) return 1
  return props.cards.clients
})

const taskProgress = computed(() => {
  const total = props.cards.tasksTotal

  if (total === 0) return 0

  return Math.round((props.cards.tasksDone / total) * 100)
})

const deltaUp = computed(() => props.cards.revenueDelta > 0)
</script>

<template>
  <div class="strip">

    <section class="cell lead">
      <span class="name">Выручка за всё время</span>

      <div class="value-row">
        <strong class="value num">{{ priceShort(cards.revenue) }}</strong>

        <svg
          class="spark"
          :viewBox="`0 0 ${SPARK_W} ${SPARK_H}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            :d="sparkPath"
            fill="none"
            stroke="var(--accent)"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div class="under">

        <span
          v-if="cards.revenueDelta !== null"
          class="delta"
          :class="deltaUp ? 'up' : 'down'"
        >
          {{ deltaUp ? '↑' : '↓' }} {{ Math.abs(cards.revenueDelta) }}%
        </span>

        <span class="under-text">
          {{ price(cards.monthRevenue) }} в этом месяце
        </span>
      </div>
    </section>

    <section class="cell">
      <span class="name">В работе</span>

      <strong class="value num">{{ priceShort(cards.pipeline) }}</strong>

      <div class="split" role="img" aria-label="Распределение по этапам">
        <span
          v-for="stage in openStages"
          :key="stage.id"
          class="seg"
          :class="`s-${stage.id}`"
          :style="{ width: (stage.amount / openTotal) * 100 + '%' }"
          :title="`${stage.label}: ${priceShort(stage.amount)}`"
        />
      </div>

      <span class="under-text">
        {{ cards.openDeals }}
        {{ plural(cards.openDeals, 'сделка', 'сделки', 'сделок') }} в трёх этапах
      </span>
    </section>

    <NuxtLink to="/clients" class="cell link">
      <span class="name">
        Клиенты
        <AppIcon name="arrow-right" :size="11" :width="2" class="go" />
      </span>

      <div class="value-row">
        <strong class="value num">{{ cards.clients }}</strong>

        <span v-if="cards.newClients" class="chip">
          +{{ cards.newClients }} за месяц
        </span>
      </div>

      <div class="split">
        <span
          v-for="part in clientParts"
          :key="part.id"
          class="seg"
          :class="`c-${part.id}`"
          :style="{ width: (part.value / clientsTotal) * 100 + '%' }"
          :title="`${part.label}: ${part.value}`"
        />
      </div>

      <span class="under-text">
        {{ cards.activeClients }} активных · {{ cards.leads }} лидов
      </span>
    </NuxtLink>

    <NuxtLink to="/tasks" class="cell link">
      <span class="name">
        Задачи
        <AppIcon name="arrow-right" :size="11" :width="2" class="go" />
      </span>

      <div class="value-row">
        <strong class="value num">{{ cards.tasksOpen }}</strong>

        <span v-if="cards.tasksOverdue" class="chip warn">
          {{ cards.tasksOverdue }} просрочено
        </span>
      </div>

      <div class="split">
        <span
          class="seg c-active"
          :style="{ width: taskProgress + '%' }"
          :title="`Выполнено ${taskProgress}%`"
        />
      </div>

      <span class="under-text">
        выполнено {{ cards.tasksDone }} из {{ cards.tasksTotal }}
      </span>
    </NuxtLink>
  </div>
</template>

<style scoped>
.strip {
  display: flex;
  flex-wrap: wrap;

  border-bottom: 1px solid var(--border);
}

.cell {
  flex: 1 1 0;
  min-width: 170px;
  padding: 2px 20px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cell + .cell {
  padding-left: 20px;
  border-left: 1px solid var(--border);
}

.lead {
  flex: 1.35 1 0;
}

.name {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: var(--text-dim);
}

.value-row {
  display: flex;
  align-items: baseline;
  gap: 9px;
  flex-wrap: wrap;
}

.value {
  font-size: 22px;
  font-weight: 520;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.lead .value {
  font-size: 30px;
  letter-spacing: -0.03em;
}

.spark {
  width: 72px;
  height: 22px;
  flex: none;
  opacity: 0.85;
}

.under {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}

.under-text {
  font-size: 11.5px;
  color: var(--text-faint);
}

.delta {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 500;
  padding: 1px 5px;
  border-radius: var(--r-xs);
}

.delta.up {
  color: var(--success);
  background: var(--success-wash);
}

.delta.down {
  color: var(--danger);
  background: var(--danger-wash);
}

.chip {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: var(--r-xs);
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-dim);
}

.chip.warn {
  background: var(--danger-wash);
  border-color: transparent;
  color: var(--danger);
}

.split {
  display: flex;
  gap: 2px;
  height: 4px;
  margin: 2px 0 1px;
}

.seg {
  height: 100%;
  border-radius: 2px;
  transform-origin: left;
  animation: grow-seg 600ms var(--ease) both;
}

@keyframes grow-seg {
  from {
    transform: scaleX(0);
  }
}

.s-new {
  background: var(--text-faint);
}
.s-qualified {
  background: var(--accent);
}
.s-proposal {
  background: var(--warn);
}

.c-active {
  background: var(--success);
}
.c-lead {
  background: var(--accent);
}
.c-rest {
  background: var(--surface-3);
}

.link {
  margin: -2px 0 -1px;
  padding-top: 4px;
  transition: background var(--fast) var(--ease);
}

.link:hover {
  background: var(--surface-2);
}

.go {
  color: var(--text-faint);
  opacity: 0;
  transition: opacity var(--fast) var(--ease), transform var(--mid) var(--ease);
}

.link:hover .go {
  opacity: 1;
  transform: translateX(2px);
}

@media (max-width: 860px) {
  .cell {
    flex: 1 1 50%;
    min-width: 0;
    padding: 14px 16px;
    border-top: 1px solid var(--border);
  }

  .cell + .cell {
    padding-left: 16px;
    border-left: none;
  }

  .cell:nth-child(odd) + .cell {
    border-left: 1px solid var(--border);
  }

  .lead .value {
    font-size: 24px;
  }

  .link {
    margin: 0;
  }
}
</style>
