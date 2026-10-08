<script setup>

const ui = useUiStore()
const route = useRoute()

const menuOpen = ref(false)

const palette = ref(null)

function openSearch() {
  if (palette.value) palette.value.show()
}

watch(
  () => route.path,
  () => {
    menuOpen.value = false
  }
)

onMounted(() => {
  ui.loadTheme()
})
</script>

<template>
  <div class="shell">

    <a href="#content" class="skip-link">К содержимому</a>

    <AppSidebar :open="menuOpen" />

    <div v-if="menuOpen" class="scrim" @click="menuOpen = false" />

    <div class="main">
      <AppTopbar @menu="menuOpen = !menuOpen" @search="openSearch" />

      <main id="content" class="content">

        <slot />
      </main>

      <AppFooter />
    </div>

    <ToastList />
    <CommandPalette ref="palette" />
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 208px 1fr;
  min-height: 100dvh;
}

.main {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 24px 26px 48px;
  max-width: 1180px;
  width: 100%;
}

.scrim {
  display: none;
}

@media (max-width: 880px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: calc(var(--z-drawer) - 1);
    background: rgb(13 16 22 / 0.45);
    animation: fade var(--mid) var(--ease);
  }

  .content {
    padding: 18px 15px 40px;
  }
}
</style>
