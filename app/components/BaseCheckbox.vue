<script setup>
const checked = defineModel({ type: Boolean, default: false })

defineProps({
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['change'])

function onChange(event) {
  const value = event.target.checked

  checked.value = value

  emit('change', value)
}
</script>

<template>
  <label class="box" :class="{ disabled }">
    <span class="frame">
      <input
        type="checkbox"
        :checked="checked"
        :disabled="disabled"
        @change="onChange"
      />

      <span class="mark" aria-hidden="true">

        <svg viewBox="0 0 16 16">
          <path d="M3.5 8.5l3 3 6-6.5" />
        </svg>
      </span>
    </span>

    <span v-if="label || $slots.default" class="text">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped>
.box {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;

  user-select: none;
}

.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.frame {
  position: relative;
  flex: none;
  width: 16px;
  height: 16px;
}

.frame input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}

.mark {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border: 1.5px solid var(--border-strong);
  border-radius: 4px;
  background: var(--surface);
  color: var(--accent-text);
  transition: background var(--fast) var(--ease),
    border-color var(--fast) var(--ease), transform var(--fast) var(--ease);
}

.box:hover .mark {
  border-color: var(--accent);
}

.frame input:active + .mark {
  transform: scale(0.88);
}

.frame input:focus-visible + .mark {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.frame input:checked + .mark {
  background: var(--accent);
  border-color: var(--accent);
}

.mark svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;

  stroke-dasharray: 16;
  stroke-dashoffset: 16;
  transition: stroke-dashoffset 240ms var(--ease) 40ms;
}

.frame input:checked + .mark svg {
  stroke-dashoffset: 0;
}

.text {
  font-size: 13px;
}
</style>
