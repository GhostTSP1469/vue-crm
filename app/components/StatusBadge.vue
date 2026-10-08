<script setup>

const props = defineProps({
  status: { type: String, required: true }
})

const MAP = {
  lead: { label: 'Лид', tone: 'accent' },
  active: { label: 'Активный', tone: 'success' },
  churned: { label: 'Потерян', tone: 'danger' },

  new: { label: 'Новая', tone: 'neutral' },
  qualified: { label: 'Квалифицирована', tone: 'accent' },
  proposal: { label: 'Предложение', tone: 'warn' },
  won: { label: 'Выиграна', tone: 'success' },
  lost: { label: 'Проиграна', tone: 'danger' }
}

const meta = computed(() => {
  return MAP[props.status] || { label: props.status, tone: 'neutral' }
})
</script>

<template>

  <span class="badge" :class="`t-${meta.tone}`">
    <span class="dot" aria-hidden="true" />
    {{ meta.label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 480;
  padding: 2px 8px 2px 7px;
  border-radius: var(--r-xs);
  white-space: nowrap;
  border: 1px solid transparent;
}

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;

  background: currentColor;
  flex: none;
}

.t-neutral {
  background: var(--surface-2);
  border-color: var(--border);
  color: var(--text-dim);
}

.t-accent {
  background: var(--accent-wash);
  border-color: var(--accent-line);
  color: var(--accent);
}

.t-success {
  background: var(--success-wash);
  color: var(--success);
}

.t-warn {
  background: var(--warn-wash);
  color: var(--warn);
}

.t-danger {
  background: var(--danger-wash);
  color: var(--danger);
}
</style>
