<script setup>
const page = defineModel({ type: Number, required: true })

const props = defineProps({
  pages: { type: Number, required: true }
})

const visible = computed(() => {
  const result = []

  for (let i = 1; i <= props.pages; i++) {
    const isNear = Math.abs(i - page.value) <= 1

    const isEdge = i === 1 || i === props.pages

    if (isNear || isEdge) {
      result.push(i)
      continue
    }

    const last = result[result.length - 1]

    if (last !== '…') {
      result.push('…')
    }
  }

  return result
})

function go(value) {
  if (value === '…') return

  page.value = Math.min(Math.max(value, 1), props.pages)
}
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Страницы">
    <button
      class="side"
      :disabled="page === 1"
      aria-label="Предыдущая страница"
      @click="go(page - 1)"
    >
      <AppIcon name="chevron-left" :size="14" :width="1.9" />
    </button>

    <div class="nums">
      <button
        v-for="(item, index) in visible"
        :key="`${item}-${index}`"
        class="num-btn num"
        :class="{ on: item === page, dots: item === '…' }"
        :disabled="item === '…'"
        :aria-current="item === page ? 'page' : undefined"
        @click="go(item)"
      >
        {{ item }}
      </button>
    </div>

    <button
      class="side"
      :disabled="page === pages"
      aria-label="Следующая страница"
      @click="go(page + 1)"
    >
      <AppIcon name="chevron-right" :size="14" :width="1.9" />
    </button>
  </nav>
</template>

<style scoped>
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 16px;
}

.nums {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
}

.num-btn,
.side {
  font: inherit;
  font-size: 12.5px;
  min-width: 28px;
  height: 26px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: var(--r-xs);
  background: transparent;
  color: var(--text-dim);
  cursor: pointer;
  transition: background var(--fast) var(--ease), color var(--fast) var(--ease),
    transform var(--fast) var(--ease);
}

.num-btn:hover:not(:disabled),
.side:hover:not(:disabled) {
  background: var(--surface);
  color: var(--text);
}

.num-btn:active:not(:disabled),
.side:active:not(:disabled) {
  transform: scale(0.92);
}

.num-btn.on {
  background: var(--accent);
  color: var(--accent-text);
  font-weight: 500;
}

.num-btn.on:hover {
  background: var(--accent);
  color: var(--accent-text);
}

.dots {
  cursor: default;
  min-width: 16px;
  color: var(--text-faint);
}

.side {
  width: 28px;
  border-color: var(--border);
  background: var(--surface);
}

.side:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
