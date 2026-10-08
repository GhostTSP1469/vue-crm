<script setup>
definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const ui = useUiStore()
const config = useRuntimeConfig()

const name = ref('')
const email = ref('')
const password = ref('')
const repeat = ref('')
const role = ref('Менеджер')
const error = ref(null)
const isSending = ref(false)

const ROLES = [
  {
    value: 'Менеджер',
    title: 'Менеджер',
    text: 'Ведёт клиентов, создаёт и правит сделки и задачи.'
  },
  {
    value: 'Руководитель',
    title: 'Руководитель',
    text: 'То же плюс удаление клиентов и сделок.'
  }
]

const nameOk = computed(() => name.value.trim().length >= 2)

const emailOk = computed(() => {
  return email.value.includes('@') && email.value.includes('.')
})

const passwordOk = computed(() => password.value.length >= 4)
const repeatOk = computed(() => repeat.value === password.value)

const isValid = computed(() => {
  return nameOk.value && emailOk.value && passwordOk.value && repeatOk.value
})

const hint = computed(() => {
  if (password.value && !passwordOk.value) {
    return 'Пароль не короче четырёх символов'
  }

  if (repeat.value && !repeatOk.value) {
    return 'Пароли не совпадают'
  }

  return null
})

async function submit() {
  if (!isValid.value) return

  isSending.value = true
  error.value = null

  try {
    await auth.register(name.value, email.value, password.value, role.value)

    ui.success('Аккаунт создан')

    await navigateTo('/')
  } catch (e) {
    error.value = (e.data && e.data.message) || 'Не удалось создать аккаунт'
  } finally {
    isSending.value = false
  }
}

useSeoMeta({ title: 'Регистрация' })
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
      <h1>Создать аккаунт</h1>
      <p class="sub">
        Новый сотрудник сразу получает доступ к общей базе клиентов.
      </p>
    </div>

    <form class="card form rise" :style="{ '--i': 2 }" @submit.prevent="submit">
      <div class="field">
        <label for="name">Имя и фамилия</label>
        <input
          id="name"
          v-model.trim="name"
          class="input"
          autocomplete="name"
          placeholder="Пётр Левин"
          required
        />
      </div>

      <div class="field">
        <label for="email">Рабочая почта</label>
        <input
          id="email"
          v-model.trim="email"
          class="input"
          type="email"
          autocomplete="email"
          placeholder="petr@crm.ru"
          required
        />
      </div>

      <div class="two">
        <div class="field">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="password"
            class="input"
            type="password"
            autocomplete="new-password"
            required
          />
        </div>

        <div class="field">
          <label for="repeat">Ещё раз</label>
          <input
            id="repeat"
            v-model="repeat"
            class="input"
            type="password"
            autocomplete="new-password"
            required
          />
        </div>
      </div>

      <div class="field">
        <span class="as-label">Роль</span>

        <div class="roles" role="radiogroup" aria-label="Роль">
          <button
            v-for="item in ROLES"
            :key="item.value"
            type="button"
            class="role"
            :class="{ on: role === item.value }"
            role="radio"
            :aria-checked="role === item.value"
            @click="role = item.value"
          >
            <strong>{{ item.title }}</strong>
            <span>{{ item.text }}</span>
          </button>
        </div>
      </div>

      <p v-if="hint" class="hint">{{ hint }}</p>
      <p v-if="error" class="error-text">{{ error }}</p>

      <button
        class="btn btn-primary wide"
        type="submit"
        :disabled="isSending || !isValid"
      >
        <AppIcon v-if="isSending" name="refresh" :size="15" class="spin" />
        {{ isSending ? 'Создаём…' : 'Создать аккаунт' }}
      </button>
    </form>

    <p class="alt rise" :style="{ '--i': 3 }">
      Уже есть аккаунт?
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

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.roles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.role {
  font: inherit;
  display: grid;
  gap: 2px;
  text-align: left;
  padding: 9px 10px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--surface);
  cursor: pointer;
  transition: border-color var(--fast) var(--ease),
    background var(--fast) var(--ease);
}

.role:hover:not(.on) {
  border-color: var(--text-faint);
}

.role strong {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text);
}

.role span {
  font-size: 11px;
  line-height: 1.45;
  color: var(--text-faint);
}

.role.on {
  background: var(--accent-wash);
  border-color: var(--accent-line);
}

.role.on strong {
  color: var(--accent);
}

.hint {
  font-size: 11.5px;
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

@media (max-width: 420px) {
  .two,
  .roles {
    grid-template-columns: 1fr;
  }
}
</style>
