<script setup>

definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const route = useRoute()
const config = useRuntimeConfig()

const email = ref('')
const password = ref('')
const error = ref(null)
const isSending = ref(false)

async function submit() {
  isSending.value = true
  error.value = null

  try {
    await auth.login(email.value, password.value)

    await navigateTo(route.query.next || '/')
  } catch (e) {
    error.value = (e.data && e.data.message) || 'Не удалось войти'
  } finally {
    isSending.value = false
  }
}

useSeoMeta({ title: 'Вход' })
</script>

<template>
  <div class="box">
    <header class="brand rise">
      <svg class="mark" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="3.4" />
        <ellipse
          cx="16"
          cy="16"
          rx="11"
          ry="5.4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          transform="rotate(-24 16 16)"
        />
      </svg>
      {{ config.public.appName }}
    </header>

    <div class="rise" :style="{ '--i': 1 }">
      <h1>С возвращением</h1>
      <p class="sub">Войдите, чтобы продолжить работу с клиентами.</p>
    </div>

    <form class="card form rise" :style="{ '--i': 2 }" @submit.prevent="submit">
      <div class="field">
        <label for="email">Почта</label>
        <input
          id="email"
          v-model.trim="email"
          class="input"
          type="email"
          autocomplete="username"
          required
        />
      </div>

      <div class="field">

        <span class="row">
          <label for="password">Пароль</label>
          <NuxtLink to="/forgot" class="forgot">Забыли?</NuxtLink>
        </span>

        <input
          id="password"
          v-model="password"
          class="input"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>

      <button class="btn btn-primary wide" type="submit" :disabled="isSending">

        <AppIcon v-if="isSending" name="refresh" :size="15" class="spin" />
        {{ isSending ? 'Входим' : 'Войти' }}
      </button>
    </form>

    <p class="alt rise" :style="{ '--i': 3 }">
      Нет аккаунта?
      <NuxtLink to="/register">Создать</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 560;
  letter-spacing: -0.02em;
  margin-bottom: 30px;
}

.mark {
  width: 22px;
  height: 22px;
  color: var(--accent);
  fill: currentColor;
}

h1 {
  font-size: 25px;
  margin-bottom: 3px;
}

.sub {
  font-size: 13px;
  color: var(--text-dim);
  margin-bottom: 18px;
}

.form {
  padding: 17px;
  box-shadow: var(--shadow);
}

.wide {
  width: 100%;
  height: 36px;
  margin-top: 3px;
}

.spin {
  animation: spin 700ms linear infinite;
}

.row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;

  margin-bottom: 4px;
}

.row label {
  margin-bottom: 0;
}

.forgot {
  font-size: 11.5px;
  color: var(--text-faint);
  transition: color var(--fast) var(--ease);
}

.forgot:hover {
  color: var(--accent);
}

.alt {
  font-size: 12.5px;
  color: var(--text-dim);
  text-align: center;
  margin: 16px 0 0;
}

.alt a {
  color: var(--accent);
  font-weight: 500;
}

</style>
