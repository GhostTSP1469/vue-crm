<script setup>
definePageMeta({ layout: 'auth' })

const ui = useUiStore()
const config = useRuntimeConfig()

const step = ref(1)

const email = ref('')
const code = ref('')
const password = ref('')
const error = ref(null)
const isSending = ref(false)

const shownCode = ref('')

const emailOk = computed(() => {
  return email.value.includes('@') && email.value.includes('.')
})

const resetOk = computed(() => {
  return code.value.trim().length === 6 && password.value.length >= 4
})

async function askCode() {
  if (!emailOk.value) return

  isSending.value = true
  error.value = null

  try {
    const res = await $fetch('/api/auth/forgot', {
      method: 'POST',
      body: { email: email.value }
    })

    shownCode.value = res.code || ''
    step.value = 2
  } catch (e) {
    error.value = (e.data && e.data.message) || 'Не удалось отправить код'
  } finally {
    isSending.value = false
  }
}

async function applyNew() {
  if (!resetOk.value) return

  isSending.value = true
  error.value = null

  try {
    await $fetch('/api/auth/reset', {
      method: 'POST',
      body: {
        email: email.value,
        code: code.value,
        password: password.value
      }
    })

    ui.success('Пароль изменён')

    await navigateTo('/login')
  } catch (e) {
    error.value = (e.data && e.data.message) || 'Не удалось сменить пароль'
  } finally {
    isSending.value = false
  }
}
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
      <h1>Сброс пароля</h1>

      <p class="sub">
        {{
          step === 1
            ? 'Введите рабочую почту — пришлём код подтверждения.'
            : 'Введите код и придумайте новый пароль.'
        }}
      </p>
    </div>

    <form
      v-if="step === 1"
      class="card form rise"
      :style="{ '--i': 2 }"
      @submit.prevent="askCode"
    >
      <div class="field">
        <label for="email">Рабочая почта</label>
        <input
          id="email"
          v-model.trim="email"
          class="input"
          type="email"
          autocomplete="email"
          placeholder="admin@crm.ru"
          required
        />
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>

      <button
        class="btn btn-primary wide"
        type="submit"
        :disabled="isSending || !emailOk"
      >
        <AppIcon v-if="isSending" name="refresh" :size="15" class="spin" />
        {{ isSending ? 'Отправляем' : 'Получить код' }}
      </button>
    </form>

    <form
      v-else
      class="card form rise"
      :style="{ '--i': 2 }"
      @submit.prevent="applyNew"
    >

      <p v-if="shownCode" class="code">
        Код подтверждения: <strong>{{ shownCode }}</strong>
      </p>

      <p v-else class="hint">
        Если такая почта есть в системе, код отправлен.
      </p>

      <div class="field">
        <label for="code">Код из шести цифр</label>
        <input
          id="code"
          v-model.trim="code"
          class="input"
          inputmode="numeric"
          maxlength="6"
          autocomplete="one-time-code"
          required
        />
      </div>

      <div class="field">
        <label for="password">Новый пароль</label>
        <input
          id="password"
          v-model="password"
          class="input"
          type="password"
          autocomplete="new-password"
          required
        />
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>

      <button
        class="btn btn-primary wide"
        type="submit"
        :disabled="isSending || !resetOk"
      >
        <AppIcon v-if="isSending" name="refresh" :size="15" class="spin" />
        {{ isSending ? 'Меняем' : 'Сменить пароль' }}
      </button>

      <button type="button" class="back" @click="step = 1">
        Ввести другую почту
      </button>
    </form>

    <p class="alt rise" :style="{ '--i': 3 }">
      Вспомнили пароль?
      <NuxtLink to="/login">Войти</NuxtLink>
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
  line-height: 1.55;
  color: var(--text-dim);
  margin-bottom: 18px;
}

.form {
  padding: 17px;
  box-shadow: var(--shadow);
}

.code {
  font-size: 12.5px;
  margin: 0;
  padding: 9px 11px;
  border-radius: var(--r-sm);
  background: var(--accent-wash);
  border: 1px solid var(--accent-line);
  color: var(--accent);
}

.code strong {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 14px;
  letter-spacing: 0.1em;
}

.hint {
  font-size: 12px;
  color: var(--text-faint);
  margin: 0;
}

.wide {
  width: 100%;
  height: 36px;
  margin-top: 3px;
}

.spin {
  animation: spin 700ms linear infinite;
}

.back {
  font: inherit;
  font-size: 12px;
  padding: 0;
  border: none;
  background: none;
  color: var(--text-faint);
  cursor: pointer;
  transition: color var(--fast) var(--ease);
}

.back:hover {
  color: var(--text);
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
