<script setup>
defineProps({
  icon: { type: String, default: 'box' }
})
</script>

<template>
  <div class="empty">
    <span class="art">
      <AppIcon :name="icon" :size="20" :width="1.5" />
    </span>

    <h2>

      <slot name="title">Ничего нет</slot>
    </h2>

    <p><slot /></p>

    <div v-if="$slots.action" class="action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty {
  padding: 46px 24px 50px;
  text-align: center;

  border: 1px dashed var(--border-strong);
  border-radius: var(--r-block);
  animation: fade var(--slow) var(--ease);
}

.art {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin: 0 auto 12px;
  border-radius: 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-faint);
}

h2 {
  font-size: 15px;
  margin-bottom: 4px;
}

p {
  margin: 0 auto;

  max-width: 34ch;
  font-size: 13px;
  color: var(--text-dim);
}

.action {
  margin-top: 18px;
}
</style>
