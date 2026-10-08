<script setup>
const open = defineModel('open', { type: Boolean, default: false })

defineProps({
  title: { type: String, default: '' },
  width: { type: String, default: '460px' }
})

function close() {
  open.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape' && open.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)

  document.body.style.overflow = ''
})

watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
</script>

<template>
  <div v-if="open" class="backdrop" @click.self="close">

    <div class="modal" :style="{ maxWidth: width }" role="dialog" aria-modal="true">
      <header class="head">
        <h2>{{ title }}</h2>

        <button class="x" aria-label="Закрыть" @click="close">
          <AppIcon name="close" :size="15" :width="1.8" />
        </button>
      </header>

      <div class="body">

        <slot />
      </div>

      <footer v-if="$slots.footer" class="foot">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgb(13 16 22 / 0.5);

  backdrop-filter: blur(3px);
  animation: fade var(--fast) var(--ease);
}

.modal {
  width: 100%;
  max-height: 86dvh;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);

  animation: pop 260ms var(--ease);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);

  position: sticky;
  top: 0;
  background: var(--surface);
  border-radius: var(--r-lg) var(--r-lg) 0 0;
}

.head h2 {
  margin: 0;
}

.x {
  flex: none;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: var(--r-xs);
  background: transparent;
  color: var(--text-faint);
  cursor: pointer;
  transition: background var(--fast) var(--ease), color var(--fast) var(--ease);
}

.x:hover {
  background: var(--surface-2);
  color: var(--text);
}

.body {
  padding: 16px;
}

.foot {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
