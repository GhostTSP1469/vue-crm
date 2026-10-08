<script setup>

const auth = useAuthStore()
const { priceShort, plural, ago } = useFormat()

const { data, pending, error, refresh } = await useFetch('/api/stats')

const cards = computed(() => (data.value ? data.value.cards : null))
const funnel = computed(() => (data.value ? data.value.funnel : []))

const funnelMax = computed(() => {
  const counts = funnel.value.map((stage) => stage.count)
  return Math.max(...counts, 1)
})

const firstName = computed(() => {
  if (!auth.user) return ''
  return auth.user.name.split(' ')[0]
})

const greeting = computed(() => {
  const hour = new Date().getHours()

  if (hour < 5) return 'Доброй ночи'
  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'
  return 'Добрый вечер'
})

const ACTIVITY_ICONS = {
  call: 'call',
  email: 'mail',
  meeting: 'meeting',
  note: 'note'
}

useSeoMeta({ title: 'Дашборд' })
</script>

<template>
  <div>
    <header class="head">
      <div>
        <span class="label">{{ greeting }}, {{ firstName }}</span>
        <h1>Сводка по воронке</h1>
      </div>

      <button class="btn" :disabled="pending" @click="refresh">
        <AppIcon name="refresh" :size="15" :class="{ spin: pending }" />
        {{ pending ? 'Обновляем' : 'Обновить' }}
      </button>
    </header>

    <p v-if="error" class="error-text">
      Не удалось загрузить статистику: {{ error.message }}
    </p>

    <template v-else-if="cards">

      <DashboardKpi
        :cards="cards"
        :funnel="funnel"
        :months="data.revenueByMonth"
        class="metrics"
      />

      <section class="charts">
        <RevenueChart :data="data.revenueByMonth" />

        <DonutStat
          :value="cards.conversion"
          label="Конверсия"
          hint="доля выигранных среди закрытых сделок"
        />
      </section>

      <div class="panels">
        <section class="card panel">
          <h2 class="panel-title">Воронка</h2>

          <ul class="funnel">
            <li v-for="(stage, index) in funnel" :key="stage.id">
              <div class="f-head">
                <span class="f-name">{{ stage.label }}</span>
                <span class="f-meta num">
                  {{ stage.count }} · {{ priceShort(stage.amount) }}
                </span>
              </div>

              <div class="track">
                <span
                  class="fill"
                  :class="`fill-${stage.id}`"
                  :style="{
                    '--p': stage.count / funnelMax,
                    '--d': `${index * 70}ms`
                  }"
                />
              </div>
            </li>
          </ul>
        </section>

        <section class="card panel">
          <h2 class="panel-title">Менеджеры</h2>

          <ul class="owners">
            <li v-for="owner in data.byOwner" :key="owner.id">
              <span class="ava" aria-hidden="true">{{ owner.name[0] }}</span>

              <span class="o-body">
                <strong>{{ owner.name }}</strong>
                <span class="o-meta">
                  {{ owner.clients }}
                  {{ plural(owner.clients, 'клиент', 'клиента', 'клиентов') }} ·
                  {{ owner.openDeals }} в работе
                </span>
              </span>

              <strong class="num">{{ priceShort(owner.revenue) }}</strong>
            </li>
          </ul>
        </section>

        <section class="card panel">
          <h2 class="panel-title">Свежие сделки</h2>

          <ul class="deals">
            <li v-for="deal in data.recentDeals" :key="deal.id">
              <NuxtLink :to="`/clients/${deal.clientId}`" class="d-title">
                {{ deal.title }}
              </NuxtLink>

              <strong class="num d-sum">{{ priceShort(deal.amount) }}</strong>

              <span class="d-client">{{ deal.clientName }}</span>

              <StatusBadge :status="deal.stage" />
            </li>
          </ul>

          <NuxtLink to="/deals" class="more">
            Все сделки
            <AppIcon name="arrow-right" :size="13" :width="1.9" />
          </NuxtLink>
        </section>

        <section class="card panel">
          <h2 class="panel-title">Что происходило</h2>

          <ul class="feed">
            <li v-for="item in data.recentActivity" :key="item.id">
              <span class="type">
                <AppIcon :name="ACTIVITY_ICONS[item.type] || 'note'" :size="14" />
              </span>

              <span class="f-body">
                <span class="f-text">{{ item.text }}</span>
                <span class="f-meta2">
                  {{ item.clientName }} · {{ ago(item.createdAt) }}
                </span>
              </span>
            </li>
          </ul>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.head h1 {
  margin: 3px 0 0;
}

.spin {
  animation: spin 900ms linear infinite;
}

.metrics {
  margin-bottom: 14px;
}

.charts {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 11px;
  margin-bottom: 11px;
  align-items: start;
}

.panels {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 11px;
  align-items: start;
}

.panel {
  padding: 15px 16px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.funnel {
  display: grid;
  gap: 12px;
}

.f-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}

.f-name {
  font-size: 12.5px;
  font-weight: 480;
}

.f-meta {
  font-size: 11.5px;
  color: var(--text-dim);
}

.track {
  height: 6px;
  background: var(--surface-2);
  border-radius: 20px;
  overflow: hidden;
}

.fill {
  display: block;
  height: 100%;
  border-radius: 20px;
  background: var(--accent);

  transform-origin: left;
  transform: scaleX(var(--p));
  animation: grow 700ms var(--ease) both;
  animation-delay: var(--d);
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
}

.fill-won {
  background: var(--success);
}
.fill-lost {
  background: var(--danger);
}
.fill-new {
  background: var(--text-faint);
}
.fill-proposal {
  background: var(--warn);
}

.owners {
  display: grid;
  gap: 12px;
}

.owners li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ava {
  width: 30px;
  height: 30px;
  flex: none;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-wash);
  border: 1px solid var(--accent-line);
  border-radius: 9px;
}

.o-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  line-height: 1.3;
}

.o-body strong {
  font-size: 13px;
  font-weight: 500;
}

.o-meta {
  font-size: 11px;
  color: var(--text-faint);
}

.deals {
  display: grid;
  gap: 11px;
}

.deals li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2px 10px;
  align-items: center;
}

.d-title {
  font-size: 13px;
  font-weight: 480;
  transition: color var(--fast) var(--ease);
}

.d-title:hover {
  color: var(--accent);
}

.d-sum {
  font-size: 12.5px;
}

.d-client {
  font-size: 11px;
  color: var(--text-faint);
}

.deals li :deep(.badge) {
  justify-self: end;
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 14px;
  font-size: 12.5px;
  color: var(--accent);
}

.more :deep(.icon) {
  transition: transform var(--mid) var(--ease);
}

.more:hover :deep(.icon) {
  transform: translateX(3px);
}

.feed {
  display: grid;
  gap: 12px;
}

.feed li {
  display: flex;
  gap: 10px;
}

.type {
  flex: none;
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 7px;
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

.f-meta2 {
  font-size: 11px;
  color: var(--text-faint);
}

@media (max-width: 1040px) {
  .charts,
  .panels {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .head {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
