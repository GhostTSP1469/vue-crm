<script setup>

const props = defineProps({
  data: { type: Array, required: true }
})

const { priceShort } = useFormat()

const WIDTH = 560
const HEIGHT = 150
const PADDING = 8

const hovered = ref(null)

const max = computed(() => {
  let result = 1

  for (const item of props.data) {
    if (item.amount > result) {
      result = item.amount
    }
  }

  return result
})

const points = computed(() => {
  const result = []
  const count = props.data.length

  for (let i = 0; i < count; i++) {
    const item = props.data[i]

    let ratio = 0.5

    if (count > 1) {
      ratio = i / (count - 1)
    }

    const x = PADDING + ratio * (WIDTH - PADDING * 2)
    const height = (item.amount / max.value) * (HEIGHT - PADDING * 2)
    const y = HEIGHT - PADDING - height

    result.push({ x: x, y: y, item: item })
  }

  return result
})

const linePath = computed(() => {
  let result = ''

  for (let i = 0; i < points.value.length; i++) {
    const point = points.value[i]
    const command = i === 0 ? 'M' : 'L'

    result = result + command + point.x.toFixed(1) + ',' + point.y.toFixed(1) + ' '
  }

  return result
})

const areaPath = computed(() => {
  if (points.value.length === 0) return ''

  const first = points.value[0]
  const last = points.value[points.value.length - 1]
  const bottom = HEIGHT - PADDING

  return (
    linePath.value +
    'L' + last.x.toFixed(1) + ',' + bottom + ' ' +
    'L' + first.x.toFixed(1) + ',' + bottom + ' Z'
  )
})

const total = computed(() => {
  let sum = 0

  for (const item of props.data) {
    sum = sum + item.amount
  }

  return sum
})
</script>

<template>
  <section class="card chart">
    <header class="head">
      <div>
        <span class="label">Выручка за полгода</span>
        <strong class="total num">{{ priceShort(total) }}</strong>
      </div>

      <div v-if="hovered" class="tip">
        <span class="tip-month">{{ hovered.label }}</span>
        <strong class="num">{{ priceShort(hovered.amount) }}</strong>
      </div>
    </header>

    <svg
      class="svg"
      :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
      preserveAspectRatio="none"
      role="img"
      aria-label="График выручки по месяцам"
    >

      <defs>
        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.2" />
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <path :d="areaPath" fill="url(#revFill)" />

      <path
        :d="linePath"
        fill="none"
        stroke="var(--accent)"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
      />

      <circle
        v-for="point in points"
        :key="point.item.key"
        :cx="point.x"
        :cy="point.y"
        :r="hovered && hovered.key === point.item.key ? 5 : 3"
        fill="var(--surface)"
        stroke="var(--accent)"
        stroke-width="2"
        vector-effect="non-scaling-stroke"
      />
    </svg>

    <div class="months">
      <button
        v-for="item in data"
        :key="item.key"
        type="button"
        class="month"
        :class="{ on: hovered && hovered.key === item.key }"
        @mouseenter="hovered = item"
        @mouseleave="hovered = null"
        @focus="hovered = item"
        @blur="hovered = null"
      >
        {{ item.label }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.chart {
  padding: 15px 16px 10px;
  overflow: hidden;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.total {
  display: block;
  font-size: 20px;
  font-weight: 520;
  margin-top: 2px;
}

.tip {
  text-align: right;
  font-size: 12px;
  line-height: 1.3;
  animation: fade var(--fast) var(--ease);
}

.tip-month {
  display: block;
  color: var(--text-faint);
}

.svg {
  display: block;
  width: 100%;
  height: 150px;
}

.months {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}

.month {
  font: inherit;
  font-size: 11px;
  flex: 1;
  padding: 5px 0;
  border: none;
  border-radius: var(--r-xs);
  background: transparent;
  color: var(--text-faint);
  cursor: default;
  transition: color var(--fast) var(--ease), background var(--fast) var(--ease);
}

.month.on {
  color: var(--accent);
  background: var(--accent-wash);
}
</style>
