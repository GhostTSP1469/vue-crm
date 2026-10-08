<script setup>

const props = defineProps({
  value: { type: Number, required: true },
  label: { type: String, required: true },
  hint: { type: String, default: '' }
})

const R = 34
const STROKE = 7

const LENGTH = 2 * Math.PI * R

const dash = computed(() => {
  const safe = Math.min(Math.max(props.value, 0), 100)
  return (safe / 100) * LENGTH
})
</script>

<template>
  <section class="card donut">
    <div class="ring">
      <svg viewBox="0 0 80 80" role="img" :aria-label="`${label}: ${value}%`">

        <circle
          cx="40"
          cy="40"
          :r="R"
          fill="none"
          stroke="var(--surface-3)"
          :stroke-width="STROKE"
        />

        <circle
          cx="40"
          cy="40"
          :r="R"
          fill="none"
          stroke="var(--accent)"
          :stroke-width="STROKE"
          stroke-linecap="round"
          :stroke-dasharray="`${dash} ${LENGTH}`"
          transform="rotate(-90 40 40)"
          class="progress"
        />
      </svg>

      <strong class="value num">{{ value }}%</strong>
    </div>

    <div class="texts">
      <span class="label">{{ label }}</span>
      <span v-if="hint" class="hint">{{ hint }}</span>
    </div>
  </section>
</template>

<style scoped>
.donut {
  padding: 15px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.ring {
  position: relative;
  flex: none;
  width: 72px;
  height: 72px;
}

.ring svg {
  width: 100%;
  height: 100%;
}

.progress {
  animation: draw 900ms var(--ease) both;
}

@keyframes draw {
  from {
    stroke-dasharray: 0 999;
  }
}

.value {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 520;
}

.texts {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.hint {
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.4;
}
</style>
