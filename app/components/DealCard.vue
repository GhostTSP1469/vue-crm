<script setup>

const props = defineProps({
  deal: { type: Object, required: true },

  stages: { type: Array, required: true },
  busy: { type: Boolean, default: false }
})

const emit = defineEmits(['move'])

const { priceShort, date } = useFormat()

const position = computed(() => {
  return props.stages.findIndex((stage) => stage.id === props.deal.stage)
})

const prevStage = computed(() => props.stages[position.value - 1])
const nextStage = computed(() => props.stages[position.value + 1])

const isBig = computed(() => props.deal.amount >= 1_000_000)
</script>

<template>

  <article class="deal" :class="[`s-${deal.stage}`, { busy, big: isBig }]">
    <header class="top">
      <NuxtLink :to="`/clients/${deal.clientId}`" class="company">
        {{ deal.company }}
      </NuxtLink>

      <span v-if="isBig" class="flag" title="Крупная сделка">
        <AppIcon name="spark" :size="11" />
        <span class="sr-only">Крупная сделка</span>
      </span>
    </header>

    <h3>{{ deal.title }}</h3>

    <strong class="amount num">{{ priceShort(deal.amount) }}</strong>

    <footer class="foot">
      <span class="meta">

        {{ deal.ownerName.split(' ')[0] }}
        <span aria-hidden="true">·</span>
        <span class="num">{{ date(deal.createdAt) }}</span>
      </span>

      <span class="moves">
        <button
          class="move"
          :disabled="busy || !prevStage"
          :title="prevStage ? `Вернуть в «${prevStage.label}»` : 'Это первый этап'"
          @click="emit('move', deal, prevStage.id)"
        >
          <AppIcon name="chevron-left" :size="13" :width="2" />
          <span class="sr-only">
            Вернуть в «{{ prevStage ? prevStage.label : '' }}»
          </span>
        </button>

        <button
          class="move"
          :disabled="busy || !nextStage"
          :title="nextStage ? `Перевести в «${nextStage.label}»` : 'Это последний этап'"
          @click="emit('move', deal, nextStage.id)"
        >
          <AppIcon name="chevron-right" :size="13" :width="2" />
          <span class="sr-only">
            Перевести в «{{ nextStage ? nextStage.label : '' }}»
          </span>
        </button>
      </span>
    </footer>
  </article>
</template>

<style scoped>
.deal {
  position: relative;

  overflow: hidden;
  padding: 10px 11px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-block);
  display: flex;
  flex-direction: column;
  gap: 3px;

  --stage: var(--text-faint);

  transition: border-color var(--fast) var(--ease),
    opacity var(--fast) var(--ease);
}

.s-qualified {
  --stage: var(--accent);
}
.s-proposal {
  --stage: var(--warn);
}
.s-won {
  --stage: var(--success);
}
.s-lost {
  --stage: var(--danger);
}

.deal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--stage);

  transform: scaleX(0);
  transition: transform var(--mid) var(--ease);
}

.deal:hover::before {
  transform: scaleX(1);
}

.deal:hover {
  border-color: color-mix(in srgb, var(--stage) 40%, var(--border-strong));
}

.busy {
  opacity: 0.45;

  pointer-events: none;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.company {
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color var(--fast) var(--ease);
}

.company:hover {
  color: var(--accent);
}

.flag {
  display: inline-flex;
  flex: none;
  color: var(--accent);
}

h3 {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.35;
}

.amount {
  font-size: 15px;
  font-weight: 520;
  margin-top: 1px;
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 5px;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-faint);
  min-width: 0;
}

.moves {
  display: inline-flex;
  gap: 1px;
  flex: none;
}

.move {
  width: 22px;
  height: 20px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--text-faint);
  cursor: pointer;
  transition: background var(--fast) var(--ease), color var(--fast) var(--ease),
    border-color var(--fast) var(--ease);
}

.deal:hover .move:not(:disabled) {
  background: var(--surface-2);
  border-color: var(--border);
  color: var(--text-dim);
}

.move:hover:not(:disabled) {
  color: var(--accent);
  border-color: var(--accent-line);
}

.move:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

@media (hover: none) {
  .move:not(:disabled) {
    background: var(--surface-2);
    border-color: var(--border);
  }
}
</style>
