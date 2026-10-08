<script setup>

const emit = defineEmits(['menu', 'search'])

const route = useRoute()

const SECTIONS = {
  '/': 'Дашборд',
  '/clients': 'Клиенты',
  '/deals': 'Сделки',
  '/tasks': 'Задачи'
}

const crumbs = computed(() => {
  const path = route.path

  if (SECTIONS[path]) {
    return [{ label: SECTIONS[path], to: null }]
  }

  if (path.startsWith('/clients/')) {
    return [
      { label: 'Клиенты', to: '/clients' },
      { label: 'Карточка', to: null }
    ]
  }

  return [{ label: 'Орбита', to: null }]
})
</script>

<template>
  <header class="bar">

    <button class="burger" aria-label="Меню" @click="emit('menu')">
      <AppIcon name="menu" :size="16" :width="1.8" />
    </button>

    <nav class="crumbs" aria-label="Хлебные крошки">

      <template v-for="(crumb, index) in crumbs" :key="crumb.label">
        <NuxtLink v-if="crumb.to" :to="crumb.to" class="crumb link">
          {{ crumb.label }}
        </NuxtLink>

        <span v-else class="crumb current">{{ crumb.label }}</span>

        <span v-if="index < crumbs.length - 1" class="slash" aria-hidden="true">
          /
        </span>
      </template>
    </nav>

    <button class="search" @click="emit('search')">
      <AppIcon name="search" :size="14" :width="1.8" class="s-ico" />
      <span class="s-text">Поиск по CRM</span>
      <kbd>Ctrl K</kbd>
    </button>
  </header>
</template>

<style scoped>
.bar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  gap: 12px;
  height: 52px;
  padding: 0 18px;
  border-bottom: 1px solid var(--border);

  background: color-mix(in srgb, var(--bg) 80%, transparent);
  backdrop-filter: blur(12px);
}

.burger {
  display: none;
  width: 29px;
  height: 29px;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--text-dim);
  cursor: pointer;
}

.crumbs {
  display: flex;
  align-items: center;
  gap: 6px;

  margin-right: auto;
  font-size: 13px;
  min-width: 0;
}

.crumb {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current {
  font-weight: 480;
}

.link {
  color: var(--text-dim);
  transition: color var(--fast) var(--ease);
}

.link:hover {
  color: var(--accent);
}

.slash {
  color: var(--text-faint);
}

.search {
  font: inherit;
  font-size: 12.5px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 7px 5px 9px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: var(--surface);
  color: var(--text-faint);
  cursor: pointer;
  transition: border-color var(--fast) var(--ease), color var(--fast) var(--ease);
}

.search:hover {
  border-color: var(--text-faint);
  color: var(--text-dim);
}

.s-text {
  min-width: 110px;
  text-align: left;
}

kbd {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 10px;
  line-height: 1;
  padding: 3px 5px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 4px;
}

@media (max-width: 880px) {
  .burger {
    display: grid;
  }

  .bar {
    padding: 0 13px;
    gap: 9px;
  }

  .s-text,
  kbd {
    display: none;
  }

  .search {
    padding: 6px;
  }
}
</style>
