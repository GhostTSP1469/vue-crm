<script setup>

defineProps({
  rows: { type: Array, required: true },

  sort: { type: String, default: '' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['sort', 'open', 'edit', 'remove'])

const { priceShort } = useFormat()

const auth = useAuthStore()
</script>

<template>
  <div class="wrap card">

    <div class="scroll thin-scroll">
      <table>
        <thead>
          <tr>

            <th>
              <button class="sorter" @click="emit('sort', 'name')">
                Клиент
                <AppIcon
                  name="arrow-up"
                  :size="11"
                  :width="2.2"
                  class="arrow"
                  :class="{ on: sort === 'name' }"
                />
              </button>
            </th>

            <th class="w-status">Статус</th>
            <th class="w-owner">Ответственный</th>
            <th class="right w-deals">Сделки</th>

            <th class="right w-money">
              <button class="sorter right-align" @click="emit('sort', 'revenue')">
                Выручка
                <AppIcon
                  name="arrow-up"
                  :size="11"
                  :width="2.2"
                  class="arrow"
                  :class="{ on: sort === 'revenue' }"
                />
              </button>
            </th>

            <th class="w-actions" />
          </tr>
        </thead>

        <tbody>

          <template v-if="loading">
            <tr v-for="n in 6" :key="`skeleton-${n}`">
              <td v-for="c in 6" :key="c">
                <span class="skeleton bar" />
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="(row, index) in rows"
              :key="row.id"
              class="row rise"
              :style="{ '--i': index }"
              tabindex="0"
              @click="emit('open', row)"
              @keydown.enter="emit('open', row)"
            >
              <td>
                <div class="who">

                  <span class="mono" aria-hidden="true">{{ row.name[0] }}</span>

                  <span class="names">
                    <strong>{{ row.name }}</strong>
                    <span>{{ row.company }}</span>
                  </span>
                </div>
              </td>

              <td><StatusBadge :status="row.status" /></td>

              <td class="dim">{{ row.ownerName }}</td>

              <td class="right num dim">{{ row.dealsCount }}</td>

              <td class="right num">{{ priceShort(row.revenue) }}</td>

              <td class="right">

                <div class="actions" @click.stop>
                  <button
                    class="btn btn-ghost mini"
                    :aria-label="`Изменить ${row.name}`"
                    @click="emit('edit', row)"
                  >
                    <AppIcon name="edit" :size="14" :width="1.7" />
                  </button>

                  <button
                    v-if="auth.isAdmin"
                    class="btn btn-ghost mini danger"
                    :aria-label="`Удалить ${row.name}`"
                    @click="emit('remove', row)"
                  >
                    <AppIcon name="trash" :size="14" :width="1.7" />
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && !rows.length" class="empty">
      <slot name="empty">Ничего не найдено</slot>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  overflow: hidden;
}

.scroll {
  overflow-x: auto;
}

table {
  width: 100%;

  border-collapse: collapse;
  font-size: 13px;
}

th {
  text-align: left;
  padding: 9px 13px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.055em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.w-status {
  width: 125px;
}
.w-owner {
  width: 150px;
}
.w-deals {
  width: 80px;
}
.w-money {
  width: 120px;
}
.w-actions {
  width: 76px;
}

.sorter {
  font: inherit;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  text-transform: inherit;
  letter-spacing: inherit;
  font-size: inherit;
  font-weight: inherit;
}

.sorter:hover {
  color: var(--text);
}

.right-align {
  margin-left: auto;
}

.arrow {
  opacity: 0;
  transition: opacity var(--fast) var(--ease);
}

.sorter:hover .arrow {
  opacity: 0.4;
}

.arrow.on {
  opacity: 1;
  color: var(--accent);
}

td {
  padding: 9px 13px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

tbody tr:last-child td {
  border-bottom: none;
}

.right {
  text-align: right;
}

.dim {
  color: var(--text-dim);
}

.row {
  cursor: pointer;
  transition: background var(--fast) var(--ease);
}

.row:hover {
  background: var(--surface-2);
}

.who {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.mono {
  flex: none;
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-dim);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 7px;
  transition: color var(--fast) var(--ease),
    background var(--fast) var(--ease), border-color var(--fast) var(--ease);
}

.row:hover .mono {
  color: var(--accent);
  background: var(--accent-wash);
  border-color: var(--accent-line);
}

.names {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.3;
}

.names strong {
  font-weight: 500;
}

.names span {
  font-size: 11.5px;
  color: var(--text-faint);
}

.actions {
  display: flex;
  gap: 1px;
  justify-content: flex-end;
  opacity: 0;
  transition: opacity var(--fast) var(--ease);
}

.row:hover .actions,
.row:focus-within .actions {
  opacity: 1;
}

@media (hover: none) {
  .actions {
    opacity: 1;
  }
}

.mini {
  padding: 4px 6px;
}

.danger:hover {
  color: var(--danger);
}

.bar {
  display: block;
  height: 11px;
  width: 70%;
}

.empty {
  padding: 42px 16px;
  text-align: center;
  color: var(--text-dim);
  font-size: 13px;
}
</style>
