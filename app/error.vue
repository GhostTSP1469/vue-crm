<script setup>
const props = defineProps({
  error: Object
})

const isNotFound = computed(() => props.error && props.error.statusCode === 404)

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="wrap">
    <div class="box">
      <span class="code num">{{ error ? error.statusCode : 500 }}</span>

      <h1>{{ isNotFound ? 'Такой страницы нет' : 'Что-то сломалось' }}</h1>

      <p>{{ (error && error.message) || 'Неожиданная ошибка на сервере' }}</p>

      <div class="actions">
        <button class="btn btn-primary" @click="goHome">На дашборд</button>

        <button class="btn" @click="$router.back()">Назад</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.box {
  text-align: center;
  max-width: 380px;
  animation: rise var(--slow) var(--ease);
}

.code {
  display: block;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: 10px;
}

h1 {
  font-size: 22px;
  margin-bottom: 6px;
}

p {
  font-size: 13px;
  color: var(--text-dim);
  margin-bottom: 22px;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
