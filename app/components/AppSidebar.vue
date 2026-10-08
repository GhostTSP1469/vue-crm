<script setup>
defineProps({
  open: { type: Boolean, default: false }
})

const config = useRuntimeConfig()
const auth = useAuthStore()

const { data: tasksData } = useFetch('/api/tasks', {
  query: { filter: 'overdue' }
})

const overdue = computed(() => {
  if (!tasksData.value) return 0
  return tasksData.value.counts.overdue
})

const LINKS = [
  { to: '/', label: 'Дашборд', icon: 'dashboard' },
  { to: '/clients', label: 'Клиенты', icon: 'clients' },
  { to: '/deals', label: 'Сделки', icon: 'deals' },
  { to: '/tasks', label: 'Задачи', icon: 'tasks', badge: 'overdue' }
]
</script>

<template>
  <aside class="side" :class="{ open }">
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

    <nav aria-label="Основная навигация">
      <span class="label nav-label">Рабочее место</span>

      <NuxtLink
        v-for="(link, index) in LINKS"
        :key="link.to"
        :to="link.to"
        class="link rise"
        :style="{ '--i': index }"
      >
        <AppIcon :name="link.icon" :size="17" />
        {{ link.label }}

        <span v-if="link.badge === 'overdue' && overdue" class="badge num">
          {{ overdue }}
        </span>
      </NuxtLink>
    </nav>

    <div class="bottom">
      <span class="label">Оформление</span>
      <ThemeSwitch />
    </div>

    <div v-if="auth.user" class="me">

      <span class="ava" aria-hidden="true">{{ auth.user.name[0] }}</span>

      <span class="who">
        <strong>{{ auth.user.name }}</strong>
        <span class="role">{{ auth.user.role }}</span>
      </span>

      <button class="btn btn-ghost out" title="Выйти" @click="auth.logout">
        <AppIcon name="logout" :size="15" />
        <span class="sr-only">Выйти</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.side {
  position: sticky;
  top: 0;
  height: 100dvh;
  padding: 16px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: var(--surface);
  border-right: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 7px;
  font-size: 14px;
  font-weight: 560;
  letter-spacing: -0.02em;
}

.mark {
  width: 21px;
  height: 21px;
  flex: none;
  color: var(--accent);
  fill: currentColor;
  transition: transform var(--slow) var(--ease);
}

.brand:hover .mark {
  transform: rotate(-20deg);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.nav-label {
  padding: 0 8px 6px;
}

.link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 9px;
  border-radius: var(--r-sm);
  font-size: 13px;
  color: var(--text-dim);
  transition: color var(--fast) var(--ease), background var(--fast) var(--ease);
}

.link:hover {
  background: var(--surface-2);
  color: var(--text);
}

.link.router-link-exact-active {
  background: var(--accent-wash);
  color: var(--accent);
  font-weight: 500;
}

.badge {
  margin-left: auto;
  font-size: 10.5px;
  padding: 1px 5px;
  border-radius: var(--r-xs);
  background: var(--danger-wash);
  color: var(--danger);
}

.bottom {
  margin-top: auto;
  padding: 0 7px;
}

.bottom .label {
  display: block;
  margin-bottom: 5px;
}

.me {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 7px 2px;
  border-top: 1px solid var(--border);
}

.ava {
  width: 29px;
  height: 29px;
  flex: none;
  display: grid;
  place-items: center;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-wash);
  border: 1px solid var(--accent-line);
  border-radius: 8px;
}

.who {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  line-height: 1.3;
}

.who strong {
  font-size: 12.5px;
  font-weight: 500;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role {
  font-size: 11px;
  color: var(--text-faint);
}

.out {
  padding: 5px;
  color: var(--text-faint);
}

.out:hover {
  color: var(--danger);
}

@media (max-width: 880px) {
  .side {
    position: fixed;
    inset: 0 auto 0 0;
    width: 230px;
    z-index: var(--z-drawer);

    transform: translateX(-100%);
    transition: transform var(--mid) var(--ease);
    box-shadow: var(--shadow-lg);
  }

  .side.open {
    transform: translateX(0);
  }
}
</style>
