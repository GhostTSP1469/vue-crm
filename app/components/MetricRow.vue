<script setup>

defineProps({
  items: { type: Array, required: true }
})
</script>

<template>
  <div class="row">

    <template v-for="(item, index) in items" :key="item.label">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="cell link"
        :class="[`t-${item.tone || 'default'}`, { lead: index === 0 }]"
      >
        <span class="label">{{ item.label }}</span>
        <strong class="value num">{{ item.value }}</strong>
        <span v-if="item.hint" class="hint">{{ item.hint }}</span>

        <AppIcon name="arrow-right" :size="12" :width="2" class="go" />
      </NuxtLink>

      <div
        v-else
        class="cell"
        :class="[`t-${item.tone || 'default'}`, { lead: index === 0 }]"
      >
        <span class="label">{{ item.label }}</span>
        <strong class="value num">{{ item.value }}</strong>
        <span v-if="item.hint" class="hint">{{ item.hint }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;

  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.cell {
  position: relative;
  flex: 1 1 0;

  min-width: 150px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cell + .cell {
  border-left: 1px solid var(--border);
}

.value {
  font-size: 19px;
  font-weight: 520;
  line-height: 1.2;
  margin-top: 3px;
}

.lead {
  flex: 1.4 1 0;
}

.lead .value {
  font-size: 27px;
  letter-spacing: -0.025em;
}

.hint {
  font-size: 11.5px;
  color: var(--text-faint);
}

.link {
  transition: background var(--fast) var(--ease);
}

.link:hover {
  background: var(--surface-2);
}

.go {
  position: absolute;
  top: 14px;
  right: 14px;
  color: var(--text-faint);
  opacity: 0;
  transition: opacity var(--fast) var(--ease), transform var(--mid) var(--ease);
}

.link:hover .go {
  opacity: 1;
  transform: translateX(2px);
}

.t-success .value {
  color: var(--success);
}
.t-danger .value {
  color: var(--danger);
}
.t-accent .value {
  color: var(--accent);
}

@media (max-width: 760px) {
  .cell {
    flex: 1 1 50%;
    min-width: 0;
    border-top: 1px solid var(--border);
  }

  .cell + .cell {
    border-left: none;
  }

  .cell:nth-child(odd) + .cell {
    border-left: 1px solid var(--border);
  }

  .lead .value {
    font-size: 22px;
  }
}
</style>
