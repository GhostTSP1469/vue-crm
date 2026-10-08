<template>

  <div class="wrap">

    <div class="glow" aria-hidden="true">
      <span class="blob a" />
      <span class="blob b" />
    </div>

    <main class="inner">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.wrap {
  position: relative;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;

  overflow: hidden;
}

.glow {
  position: absolute;
  inset: 0;

  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
}

.a {
  width: 42vmax;
  height: 42vmax;
  top: -14vmax;
  right: -10vmax;
  background: radial-gradient(circle, var(--accent-wash), transparent 70%);
}

.b {
  width: 34vmax;
  height: 34vmax;
  bottom: -12vmax;
  left: -8vmax;
  background: radial-gradient(circle, var(--success-wash), transparent 70%);
}

.inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 360px;
}
</style>
