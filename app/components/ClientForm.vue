<script setup>

const props = defineProps({
  client: { type: Object, default: null }
})

const emit = defineEmits(['saved', 'cancel'])

const ui = useUiStore()

const touched = ref({})
const serverError = ref(null)
const isSaving = ref(false)

const form = ref({
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'lead',
  note: '',
  tags: []
})

const STATUS_OPTIONS = [
  { value: 'lead', label: 'Лид' },
  { value: 'active', label: 'Активный' },
  { value: 'churned', label: 'Потерян' }
]

watch(
  () => props.client,
  (client) => {
    if (client) {
      form.value = {
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        status: client.status,
        note: client.note || '',

        tags: [...(client.tags || [])]
      }
    } else {
      form.value = {
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'lead',
        note: '',
        tags: []
      }
    }

    touched.value = {}
    serverError.value = null
  },
  { immediate: true }
)

const errors = computed(() => {
  const result = {}

  if (form.value.name.trim().length < 2) {
    result.name = 'Минимум 2 символа'
  }

  if (form.value.company.trim().length < 2) {
    result.company = 'Минимум 2 символа'
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email.trim())) {
    result.email = 'Проверьте адрес'
  }

  return result
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

function errorFor(field) {
  return touched.value[field] ? errors.value[field] : null
}

const tagInput = ref('')

function addTag() {
  const tag = tagInput.value.trim()

  if (!tag || form.value.tags.includes(tag)) {
    tagInput.value = ''
    return
  }

  form.value.tags.push(tag)
  tagInput.value = ''
}

function removeTag(tag) {
  form.value.tags = form.value.tags.filter((t) => t !== tag)
}

async function submit() {
  touched.value = { name: true, company: true, email: true }

  if (!isValid.value) return

  isSaving.value = true
  serverError.value = null

  try {
    let saved

    if (props.client) {
      saved = await $fetch(`/api/clients/${props.client.id}`, {
        method: 'PATCH',
        body: form.value
      })
    } else {
      saved = await $fetch('/api/clients', {
        method: 'POST',
        body: form.value
      })
    }

    ui.success(props.client ? 'Изменения сохранены' : 'Клиент добавлен')
    emit('saved', saved)
  } catch (e) {
    serverError.value = (e.data && e.data.message) || 'Не удалось сохранить'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>

  <form @submit.prevent="submit">
    <div class="two">
      <div class="field">
        <label for="c-name">Имя</label>
        <input
          id="c-name"
          v-model="form.name"
          class="input"
          @blur="touched.name = true"
        />
        <p v-if="errorFor('name')" class="error-text">{{ errorFor('name') }}</p>
      </div>

      <div class="field">
        <label for="c-company">Компания</label>
        <input
          id="c-company"
          v-model="form.company"
          class="input"
          @blur="touched.company = true"
        />
        <p v-if="errorFor('company')" class="error-text">
          {{ errorFor('company') }}
        </p>
      </div>
    </div>

    <div class="two">
      <div class="field">
        <label for="c-email">Почта</label>

        <input
          id="c-email"
          v-model.trim="form.email"
          class="input"
          type="email"
          @blur="touched.email = true"
        />
        <p v-if="errorFor('email')" class="error-text">{{ errorFor('email') }}</p>
      </div>

      <div class="field">
        <label for="c-phone">Телефон</label>
        <input id="c-phone" v-model.trim="form.phone" class="input" />
      </div>
    </div>

    <div class="field">

      <span class="as-label">Статус</span>
      <BaseSelect
        v-model="form.status"
        :options="STATUS_OPTIONS"
        aria-label="Статус клиента"
      />
    </div>

    <div class="field">
      <label for="c-tag">Теги</label>

      <div v-if="form.tags.length" class="tags">
        <span v-for="tag in form.tags" :key="tag" class="tag">
          {{ tag }}
          <button type="button" class="tag-x" @click="removeTag(tag)">
            <AppIcon name="close" :size="10" :width="2" />
          </button>
        </span>
      </div>

      <input
        id="c-tag"
        v-model="tagInput"
        class="input"
        placeholder="Введите тег и нажмите Enter"
        @keydown.enter.prevent="addTag"
      />
    </div>

    <div class="field">
      <label for="c-note">Заметка</label>
      <textarea id="c-note" v-model="form.note" class="input" rows="3" />
    </div>

    <p v-if="serverError" class="error-text">{{ serverError }}</p>

    <div class="actions">
      <button type="button" class="btn" @click="emit('cancel')">Отмена</button>

      <button type="submit" class="btn btn-primary" :disabled="isSaving">
        {{ isSaving ? 'Сохраняем…' : client ? 'Сохранить' : 'Добавить' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 6px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11.5px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--r-xs);
  padding: 2px 3px 2px 8px;
}

.tag-x {
  display: grid;
  place-items: center;
  border: none;
  background: none;
  color: var(--text-faint);
  cursor: pointer;
  padding: 2px;
  border-radius: 3px;
}

.tag-x:hover {
  color: var(--danger);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

@media (max-width: 520px) {
  .two {
    grid-template-columns: 1fr;
  }
}
</style>
