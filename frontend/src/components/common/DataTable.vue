<script lang="ts">
import type { InjectionKey } from 'vue';

export interface ColumnDefinition {
  body?: (props: { data: Record<string, unknown> }) => unknown;
  field?: string;
  header: string;
}

// Each Column child registers itself here, in template order.
export const DATA_TABLE: InjectionKey<{
  register: (column: ColumnDefinition) => void;
  unregister: (column: ColumnDefinition) => void;
}> = Symbol('DataTable');
</script>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot
} from 'reka-ui';
import { computed, provide, shallowReactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { Button, ProgressCircle, Select } from '@/components/bcds';

// Props
const {
  loading = false,
  pageSizeOptions = [10, 25, 50],
  paginator = false,
  rowKey,
  rows,
  total = undefined
} = defineProps<{
  loading?: boolean;
  pageSizeOptions?: number[];
  // Shows the pager; the caller loads each page into rows.
  paginator?: boolean;
  rowKey: keyof T;
  rows: T[];
  // Rows across every page, for the pager; without it, rows is every row.
  total?: number;
}>();

// 1-based, as the API counts pages
const page = defineModel<number>('page', { default: 1 });
const pageSize = defineModel<number>('pageSize', { default: 10 });

// Emits
// After the user moves to another page or page size, once the models hold it.
const emit = defineEmits<{ page: [event: { page: number; pageSize: number }] }>();

// The default slot holds the Column children, which render nothing themselves.
defineSlots<{ default(): unknown; empty?(): unknown }>();

// Composables
const { t } = useI18n();

// State
const columns = shallowReactive<ColumnDefinition[]>([]);

provide(DATA_TABLE, {
  register: (column) => columns.push(column),
  unregister: (column) => columns.splice(columns.indexOf(column), 1)
});

const pageSizeItems = computed(() => pageSizeOptions.map((size) => ({ id: size, label: String(size) })));

// Actions
// A column's body slot, or else its field's value
const Cell = ({ column, row }: { column: ColumnDefinition; row: T }) =>
  column.body ? column.body({ data: row }) : String(row[column.field ?? ''] ?? '');

function setPage(value: number) {
  page.value = value;
  emit('page', { page: page.value, pageSize: pageSize.value });
}

function setPageSize(size: unknown) {
  pageSize.value = Number(size);
  setPage(1);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <slot />
    <!-- Wide tables scroll sideways on narrow screens instead of widening the page. -->
    <div class="relative overflow-x-auto">
      <table
        :aria-busy="loading || undefined"
        class="w-full border-collapse"
      >
        <thead>
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="index"
              class="border-b-2 border-[var(--surface-color-border-dark)] p-2 text-left"
              scope="col"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="String(row[rowKey])"
          >
            <td
              v-for="(column, index) in columns"
              :key="index"
              class="border-b border-[var(--surface-color-border-default)] p-2"
            >
              <Cell
                :column
                :row
              />
            </td>
          </tr>
          <tr v-if="!loading && !rows.length">
            <td
              class="p-2"
              :colspan="columns.length"
            >
              <slot name="empty" />
            </td>
          </tr>
        </tbody>
      </table>
      <ProgressCircle
        v-if="loading"
        :aria-label="t('ui.loading')"
        class="absolute inset-0 m-auto"
        is-indeterminate
      />
    </div>

    <div
      v-if="paginator"
      class="flex flex-wrap items-end justify-end gap-4"
    >
      <Select
        :items="pageSizeItems"
        :label="t('components.dataTable.pageSize')"
        :model-value="pageSize"
        size="small"
        @update:model-value="setPageSize"
      />
      <!-- Reka's own labels are English, so each part is given a translated one. -->
      <PaginationRoot
        v-slot="{ page: current }"
        :page
        :aria-label="t('components.dataTable.pagination')"
        :items-per-page="pageSize"
        :sibling-count="1"
        show-edges
        :total="total ?? rows.length"
        @update:page="setPage"
      >
        <PaginationList
          v-slot="{ items }"
          class="flex items-center gap-1"
        >
          <PaginationFirst
            :aria-label="t('components.dataTable.first')"
            as-child
          >
            <Button
              icon="fa-solid fa-angles-left"
              icon-only
              :label="t('components.dataTable.first')"
              size="small"
              variant="tertiary"
            />
          </PaginationFirst>
          <PaginationPrev
            :aria-label="t('components.dataTable.previous')"
            as-child
          >
            <Button
              icon="fa-solid fa-chevron-left"
              icon-only
              :label="t('components.dataTable.previous')"
              size="small"
              variant="tertiary"
            />
          </PaginationPrev>
          <template
            v-for="(item, index) in items"
            :key="index"
          >
            <PaginationListItem
              v-if="item.type === 'page'"
              :aria-label="t('components.dataTable.pageLink', { page: item.value })"
              as-child
              :value="item.value"
            >
              <Button
                :label="String(item.value)"
                size="small"
                :variant="item.value === current ? 'primary' : 'tertiary'"
              />
            </PaginationListItem>
            <PaginationEllipsis
              v-else
              aria-hidden="true"
              class="px-2"
            />
          </template>
          <PaginationNext
            :aria-label="t('components.dataTable.next')"
            as-child
          >
            <Button
              icon="fa-solid fa-chevron-right"
              icon-only
              :label="t('components.dataTable.next')"
              size="small"
              variant="tertiary"
            />
          </PaginationNext>
          <PaginationLast
            :aria-label="t('components.dataTable.last')"
            as-child
          >
            <Button
              icon="fa-solid fa-angles-right"
              icon-only
              :label="t('components.dataTable.last')"
              size="small"
              variant="tertiary"
            />
          </PaginationLast>
        </PaginationList>
      </PaginationRoot>
    </div>
  </div>
</template>
