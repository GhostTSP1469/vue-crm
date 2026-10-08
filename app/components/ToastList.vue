<script setup>
const ui = useUiStore()

const ICONS = {
  success: 'check',
  error: 'alert',
  info: 'info'
}
</script>

<template>
  <div class="host">

    <button
      v-for="toast in ui.toasts"
      :key="toast.id"
      type="button"
      class="toast"
      :class="`t-${toast.type}`"
      @click="ui.dismiss(toast.id)"
    >
      <AppIcon :name="ICONS[toast.type] || 'info'" :size="15" :width="1.9" class="ico" />
      <span>{{ toast.message }}</span>
    </button>
  </div>
</template>

<style scoped>
.host {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: 7px;

  max-width: min(340px, calc(100vw - 32px));
}

.toast {
  font: inherit;
  text-align: left;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 10px 12px;
  border-radius: var(--r);
  background: var(--surface);
  border: 1px solid var(--border-strong);
  box-shadow: var(--shadow-lg);
  color: var(--text);
  font-size: 13px;
  cursor: pointer;

  animation: slide-left 280ms var(--ease);
}

.toast:active {
  transform: scale(0.98);
}

.ico {
  margin-top: 1px;
}

.t-success {
  border-left: 2.5px solid var(--success);
}
.t-success .ico {
  color: var(--success);
}

.t-error {
  border-left: 2.5px solid var(--danger);
}
.t-error .ico {
  color: var(--danger);
}

.t-info {
  border-left: 2.5px solid var(--accent);
}
.t-info .ico {
  color: var(--accent);
}
</style>
