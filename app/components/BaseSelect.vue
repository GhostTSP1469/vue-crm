<script setup>

const model = defineModel({ type: [String, Number], default: '' })

const props = defineProps({
  options: { type: Array, required: true },

  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' }
})

const open = ref(false)

const root = ref(null)

const selected = computed(() => {
  return props.options.find((option) => option.value === model.value)
})

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function pick(option) {
  model.value = option.value
  open.value = false
}

function onDocumentClick(event) {
  if (!open.value) return
  if (root.value && root.value.contains(event.target)) return
  open.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="select" :class="`s-${size}`">
    <button
      type="button"
      class="trigger"
      :class="{ open, empty: !selected }"
      :disabled="disabled"
      :aria-label="ariaLabel || undefined"
      :aria-expanded="open"
      @click="toggle"
    >
      <span class="text">{{ selected ? selected.label : 'Выберите' }}</span>

      <AppIcon
        name="chevron-down"
        :size="size === 'sm' ? 12 : 14"
        class="chev"
        :class="{ up: open }"
      />
    </button>

    <ul v-if="open" class="list thin-scroll" role="listbox">
      <li v-for="option in options" :key="option.value">
        <button
          type="button"
          class="option"
          :class="{ on: option.value === model }"
          role="option"
          :aria-selected="option.value === model"
          @click="pick(option)"
        >
          <span class="opt-text">{{ option.label }}</span>
          <AppIcon v-if="option.value === model" name="check" :size="13" :width="2.1" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>

.select {
  position: relative;
  width: 100%;
}

.trigger {
  font: inherit;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-align: left;
  cursor: pointer;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-sm);
  transition: border-color var(--fast) var(--ease),
    box-shadow var(--fast) var(--ease), background var(--fast) var(--ease);
}

.s-md .trigger {
  padding: 7px 9px 7px 11px;
}

.s-sm .trigger {
  padding: 3px 5px 3px 8px;
  font-size: 12px;
  border-color: transparent;
  background: var(--surface-2);
  color: var(--text-dim);
}

.trigger:hover:not(:disabled) {
  border-color: var(--text-faint);
}

.trigger.open {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-wash);
}

.trigger:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.empty .text {
  color: var(--text-faint);
}

.text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chev {
  color: var(--text-faint);
  transition: transform var(--mid) var(--ease), color var(--fast) var(--ease);
}

.chev.up {
  transform: rotate(180deg);
  color: var(--accent);
}

.list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;

  min-width: 100%;
  max-height: 260px;
  overflow-y: auto;
  z-index: var(--z-sticky);
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--r);
  box-shadow: var(--shadow-lg);
  animation: pop 180ms var(--ease);
}

.option {
  font: inherit;
  font-size: 13px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 8px;
  border: none;
  border-radius: var(--r-xs);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
}

.option:hover {
  background: var(--surface-2);
}

.option.on {
  color: var(--accent);
  font-weight: 500;
}

.opt-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
