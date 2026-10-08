<script setup>

const ui = useUiStore()

const OPTIONS = [
  { value: 'auto', label: 'Как в системе', icon: 'auto' },
  { value: 'light', label: 'Светлая', icon: 'sun' },
  { value: 'dark', label: 'Тёмная', icon: 'moon' }
]
</script>

<template>

  <div class="switch" role="radiogroup" aria-label="Оформление">
    <button
      v-for="option in OPTIONS"
      :key="option.value"
      type="button"
      class="opt"
      :class="{ on: ui.theme === option.value }"
      role="radio"
      :aria-checked="ui.theme === option.value"
      :title="option.label"
      @click="ui.setTheme(option.value)"
    >
      <AppIcon :name="option.icon" :size="14" :width="1.7" />
      <span class="sr-only">{{ option.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.switch {
  display: flex;
  gap: 1px;
  padding: 2px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
}

.opt {
  flex: 1;
  height: 23px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: var(--r-xs);
  background: transparent;
  color: var(--text-faint);
  cursor: pointer;
  transition: background var(--fast) var(--ease), color var(--fast) var(--ease),
    transform var(--fast) var(--ease);
}

.opt:hover:not(.on) {
  color: var(--text-dim);
}

.opt:active {
  transform: scale(0.9);
}

.opt.on {
  background: var(--surface);
  border-color: var(--border);
  color: var(--accent);
}
</style>
