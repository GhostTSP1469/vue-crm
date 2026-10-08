<script setup>

const props = defineProps({
  clientId: { type: Number, required: true }
})

const emit = defineEmits(['saved', 'cancel'])

const ui = useUiStore()

const type = ref('call')
const text = ref('')
const isSaving = ref(false)
const serverError = ref(null)

const TYPE_OPTIONS = [
  { value: 'call', label: 'Звонок' },
  { value: 'email', label: 'Письмо' },
  { value: 'meeting', label: 'Встреча' },
  { value: 'note', label: 'Заметка' }
]

const placeholder = computed(() => {
  if (type.value === 'call') return 'О чём договорились'
  if (type.value === 'email') return 'Что отправили'
  if (type.value === 'meeting') return 'Что обсудили'
  return 'Что важно запомнить'
})

const isValid = computed(() => text.value.trim().length >= 3)

async function submit() {
  if (!isValid.value) return

  isSaving.value = true
  serverError.value = null

  try {
    await $fetch('/api/activities', {
      method: 'POST',
      body: {
        clientId: props.clientId,
        type: type.value,
        text: text.value
      }
    })

    ui.success('Событие записано')
    emit('saved')
  } catch (e) {
    serverError.value = (e.data && e.data.message) || 'Не удалось записать'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="field">
      <span class="as-label">Что произошло</span>
      <BaseSelect v-model="type" :options="TYPE_OPTIONS" aria-label="Тип события" />
    </div>

    <div class="field">
      <label for="a-text">Описание</label>
      <textarea
        id="a-text"
        v-model="text"
        class="input"
        rows="3"
        :placeholder="placeholder"
      />
    </div>

    <p v-if="serverError" class="error-text">{{ serverError }}</p>

    <div class="actions">
      <button type="button" class="btn" @click="emit('cancel')">Отмена</button>

      <button
        type="submit"
        class="btn btn-primary"
        :disabled="isSaving || !isValid"
      >
        {{ isSaving ? 'Записываем…' : 'Записать' }}
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
