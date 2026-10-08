<script setup>
defineProps({
  task: { type: Object, required: true },
  busy: { type: Boolean, default: false },

  showClient: { type: Boolean, default: true }
})

const emit = defineEmits(['toggle'])

const { date } = useFormat()
</script>

<template>
  <div class="task" :class="{ busy, done: task.done }">

    <BaseCheckbox
      :model-value="task.done"
      :disabled="busy"
      @change="emit('toggle', task)"
    />

    <div class="texts">
      <span class="title">{{ task.title }}</span>

      <span class="meta">

        <NuxtLink
          v-if="showClient && task.clientId"
          :to="`/clients/${task.clientId}`"
          class="client"
          @click.stop
        >
          {{ task.clientName }}
        </NuxtLink>

        <span v-else-if="showClient">без клиента</span>

        <template v-if="showClient"> · </template>

        {{ task.assigneeName }}
      </span>
    </div>

    <span class="due num" :class="{ late: task.isOverdue }">
      {{ date(task.dueDate) }}
    </span>
  </div>
</template>

<style scoped>
.task {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: opacity var(--fast) var(--ease);
}

.busy {
  opacity: 0.45;
  pointer-events: none;
}

.texts {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.35;
}

.title {
  font-size: 13.5px;
  font-weight: 480;
  transition: color var(--fast) var(--ease);
}

.done .title {
  text-decoration: line-through;
  color: var(--text-faint);
  font-weight: 400;
}

.meta {
  font-size: 11.5px;
  color: var(--text-faint);
}

.client {
  transition: color var(--fast) var(--ease);
}

.client:hover {
  color: var(--accent);
}

.due {
  flex: none;
  font-size: 12px;
  color: var(--text-faint);
}

.late {
  color: var(--danger);
  font-weight: 500;
}
</style>
