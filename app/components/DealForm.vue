<script setup>
const props = defineProps({
  clientId: { type: Number, default: null }
})

const emit = defineEmits(['saved', 'cancel'])

const ui = useUiStore()

const title = ref('')
const amount = ref('')
const selectedClient = ref('')
const isSaving = ref(false)
const serverError = ref(null)

const needsClient = computed(() => props.clientId === null)

const { data: clientsData } = useFetch('/api/clients', {
  query: { perPage: 100 }
})

const clientOptions = computed(() => {
  const options = []

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
  if (title.value.trim().length < 3) return false
  if (!(Number(amount.value) > 0)) return false

  if (needsClient.value && !selectedClient.value) return false

  return true
})

async function submit() {
  if (!isValid.value) return

  isSaving.value = true
  serverError.value = null

  const clientId = props.clientId || Number(selectedClient.value)

  try {
    await $fetch('/api/deals', {
      method: 'POST',
      body: {
        clientId: clientId,
        title: title.value,
        amount: Number(amount.value)
      }
    })

    ui.success('Сделка создана')
    emit('saved')
  } catch (e) {
    serverError.value = (e.data && e.data.message) || 'Не удалось создать сделку'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div v-if="needsClient" class="field">
      <span class="as-label">Клиент</span>
      <BaseSelect
        v-model="selectedClient"
        :options="clientOptions"
        placeholder="Выберите клиента"
        aria-label="Клиент"
      />
    </div>

    <div class="field">
      <label for="d-title">Название</label>
      <input
        id="d-title"
        v-model="title"
        class="input"
        placeholder="Поставка оборудования"
      />
    </div>

    <div class="field">
      <label for="d-amount">Сумма, ₽</label>
      <input
        id="d-amount"
        v-model="amount"
        class="input"
        type="number"
        min="1"
        placeholder="150000"
      />
    </div>

    <p v-if="serverError" class="error-text">{{ serverError }}</p>

    <div class="form-actions">
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
