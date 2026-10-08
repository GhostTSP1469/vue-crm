<script setup>
const props = defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 16 },

  width: { type: Number, default: 1.6 }
})

const FILLED = ['spark', 'dot']

const PATHS = {
  dashboard: 'M4 13h5v7H4zM10 7h5v13h-5zM16 10h5v10h-5z',
  clients:
    'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 10.5a2.5 2.5 0 1 0 0-5M18 19.5c0-2.2-.8-3.9-2-5',
  deals: 'M4 8h11l-2.5-2.5M20 16H9l2.5 2.5',
  tasks: 'M4 7l2.5 2.5L11 5M4 17l2.5 2.5L11 15M14 7h6M14 17h6',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',

  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M20 6L9 17l-5-5',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16.5 16.5L21 21',
  edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6',
  logout: 'M15 4h4v16h-4M11 8l-4 4 4 4M7 12h9',
  menu: 'M4 7h16M4 12h16M4 17h16',
  alert: 'M12 3l9 16H3zM12 8v5M12 16h.01',
  download: 'M12 4v11M7.5 11l4.5 4.5 4.5-4.5M4 20h16',
  command: 'M8 4h8v16H8zM4 8h16M4 16h16',

  'chevron-down': 'M6 9.5l6 6 6-6',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',

  call: 'M7.5 3.5h-3a1.5 1.5 0 0 0-1.5 1.5A16 16 0 0 0 19 21a1.5 1.5 0 0 0 1.5-1.5v-3l-4.5-1.5-1.8 2a12.5 12.5 0 0 1-5.2-5.2l2-1.8z',
  mail: 'M3.5 6.5h17v11h-17zM3.5 6.5l8.5 6.5 8.5-6.5',
  meeting: 'M4 7h16v13H4zM4 11h16M8 4v3M16 4v3M9.5 15.3l1.8 1.8 3.4-3.4',
  note: 'M6 3h8l5 5v13H6zM14 3v5h5M9.5 12.5h6M9.5 16h4',

  auto: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 3v18',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z',

  box: 'M4 7h16v13H4zM4 7l2-3h12l2 3M9 12h6',
  spark: 'M12 3.5l2.1 6.4 6.4 2.1-6.4 2.1L12 20.5l-2.1-6.4L3.5 12l6.4-2.1z'
}

const path = computed(() => PATHS[props.name] || PATHS.box)
const isFilled = computed(() => FILLED.includes(props.name))
</script>

<template>
  <svg
    class="icon"
    :class="{ filled: isFilled }"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    :stroke-width="width"
    aria-hidden="true"
  >
    <path :d="path" />
  </svg>
</template>

<style scoped>
.icon {
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.filled {
  fill: currentColor;
  stroke: none;
}
</style>
