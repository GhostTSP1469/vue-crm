<script setup>

const props = defineProps({
  clientId: { type: Number, default: null }
})

const emit = defineEmits(['saved', 'cancel'])

const ui = useUiStore()

const title = ref('')
const selectedClient = ref('')
const dueDate = ref('')
const isSaving = ref(false)
const serverError = ref(null)

onMounted(() => {
  const date = new Date()
  date.setDate(date.getDate() + 3)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  dueDate.value = `${year}-${month}-${day}`
})

const { data: clientsData } = useFetch('/api/clients', {
  query: { perPage: 100 }
})

const clientOptions = computed(() => {
  const options = [{ value: '', label: 'Без клиента' }]

  if (!clientsData.value) return options

  for (const client of clientsData.value.items) {
    options.push({
      value: String(client.id),
      label: client.name + ' · ' + client.company
    })
  }

  return options
})

const isValid = computed(() => {
  return title.value.trim().length >= 3 && dueDate.value !== ''
})

async function submit() {
  if (!isValid.value) return

  isSaving.value = true
  serverError.value = null

  let clientId = props.clientId

  if (!clientId && selectedClient.value) {
    clientId = Number(selectedClient.value)
  }

  try {
    await $fetch('/api/tasks', {
      method: 'POST',
      body: {
        title: title.value,
        clientId: clientId,
        dueDate: dueDate.value
      }
    })

    ui.success('Задача создана')
    emit('saved')
  } catch (e) {
    serverError.value = (e.data && e.data.message) || 'Не удалось создать'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="field">
      <label for="t-title">Что сделать</label>
      <input
        id="t-title"
        v-model="title"
        class="input"
        placeholder="Позвонить и уточнить сроки"
      />
    </div>

    <div v-if="!clientId" class="field">
      <span class="as-label">Клиент</span>
      <BaseSelect
        v-model="selectedClient"
        :options="clientOptions"
        aria-label="Клиент"
      />
    </div>

    <div class="field">
      <label for="t-date">Срок</label>
      <input id="t-date" v-model="dueDate" class="input" type="date" />
    </div>

    <p v-if="serverError" class="error-text">{{ serverError }}</p>

    <div class="actions">
      <button type="button" class="btn" @click="emit('cancel')">Отмена</button>

      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isSaving || !isValid"
      >
        {{ isSaving ? 'Создаём…' : 'Создать' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}
</style>
