<script setup>

const config = useRuntimeConfig()

const year = new Date().getFullYear()

const SECTIONS = [
  { label: 'Дашборд', to: '/' },
  { label: 'Клиенты', to: '/clients' },
  { label: 'Сделки', to: '/deals' },
  { label: 'Задачи', to: '/tasks' }
]

const ACCOUNT = [
  { label: 'Вход в систему', to: '/login' },
  { label: 'Регистрация', to: '/register' },
  { label: 'Сброс пароля', to: '/forgot' }
]

const PARTNERS = [
  {
    name: 'ТехноЛайн',
    kind: 'оптовая торговля',
    shape: 'M3 17h5l4-10 4 10h5'
  },
  {
    name: 'АгроИнвест',
    kind: 'агрохолдинг',
    shape: 'M12 20v-9m0 0c3 0 4-3 4-6-3 0-4 3-4 6zm0 0c-3 0-4-3-4-6 3 0 4 3 4 6z'
  },
  {
    name: 'Медкабинет',
    kind: 'сеть клиник',
    shape: 'M12 4v16M4 12h16'
  },
  {
    name: 'Кофе и код',
    kind: 'кофейни',
    shape: 'M6 7h10v6a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V7zm10 1h2a2 2 0 0 1 0 4h-2'
  },
  {
    name: 'Логистик Про',
    kind: 'перевозки',
    shape: 'M3 16V7h10v9m0-6h4l3 3v3h-7M7 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 19zm10 0a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 17 19z'
  }
]
</script>

<template>
  <footer class="foot">
    <div class="inner">

      <div class="brand-col">
        <NuxtLink to="/" class="brand">
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
        </NuxtLink>

        <p class="about">
          Клиенты, сделки и задачи в одном месте: воронка по этапам, отчёты
          по выручке и вся история общения в карточке клиента.
        </p>
      </div>

      <nav class="col">
        <span class="col-title">Разделы</span>

        <ul>
          <li v-for="link in SECTIONS" :key="link.label">
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <nav class="col">
        <span class="col-title">Аккаунт</span>

        <ul>
          <li v-for="link in ACCOUNT" :key="link.label">
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="partners">
      <span class="col-title">Работают в системе</span>

      <div class="logos">
        <span v-for="company in PARTNERS" :key="company.name" class="logo">
          <svg class="glyph" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="company.shape" />
          </svg>

          <span class="logo-text">
            <strong>{{ company.name }}</strong>
            <span>{{ company.kind }}</span>
          </span>
        </span>
      </div>
    </div>

    <div class="bottom">
      <span>© {{ year }} {{ config.public.appName }}</span>
      <span>Все права защищены</span>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  border-top: 1px solid var(--border);
  background: var(--surface);
  margin-top: 40px;
}

.inner {
  display: grid;

  grid-template-columns: 2fr 1fr 1fr;
  gap: 32px;
  padding: 30px 26px 26px;
  max-width: 1180px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 560;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}

.mark {
  width: 20px;
  height: 20px;
  flex: none;
  color: var(--accent);
  fill: currentColor;
}

.about {
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--text-dim);

  max-width: 48ch;
  margin: 0 0 10px;
}

.col-title {
  display: block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.055em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-bottom: 11px;
}

.col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  font-size: 12.5px;
}

.col a {
  color: var(--text-dim);
  transition: color var(--fast) var(--ease);
}

.col a:hover {
  color: var(--accent);
}

.partners {
  padding: 16px 26px 18px;
  border-top: 1px solid var(--border);
  background: var(--surface-2);
}

.logos {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--text-dim);

  opacity: 0.7;
}

.glyph {
  width: 19px;
  height: 19px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.logo-text {
  display: grid;
  line-height: 1.25;
}

.logo-text strong {
  font-size: 12.5px;
  font-weight: 500;
}

.logo-text span {
  font-size: 10.5px;
  color: var(--text-faint);
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 13px 26px;
  border-top: 1px solid var(--border);
  font-size: 11.5px;
  color: var(--text-faint);
}

.bottom a {
  transition: color var(--fast) var(--ease);
}

.bottom a:hover {
  color: var(--accent);
}

@media (max-width: 880px) {
  .inner {
    grid-template-columns: 1fr 1fr;
    gap: 26px;
    padding: 24px 15px 20px;
  }

  .brand-col {
    grid-column: 1 / -1;
  }

  .partners,
  .bottom {
    padding-inline: 15px;
  }

  .logos {
    gap: 18px;
  }
}
</style>
