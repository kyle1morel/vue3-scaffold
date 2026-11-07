<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Button, Tooltip } from '@/components/bcds';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import { Column, DataTable } from '@/lib/primevue';
import { deleteSubmission, listSubmissions } from '@/services';
import { RouteName } from '@/utils/enums';
import { formatDateShort } from '@/utils/formatters';
import { rethrowAs } from '@/utils/utils';

import type { DataTablePageEvent } from '@/lib/primevue';
import type { Submission } from '@/types';

// Constants
const PAGE_SIZE_OPTIONS = [10, 25, 50];

// Composables
const { confirm } = useConfirm();
const { t } = useI18n();
const toast = useToast();

// State
const first = ref(0);
const loading = ref(false);
const pageSize = ref(PAGE_SIZE_OPTIONS[0]);
const submissions = ref<Submission[]>([]);
const total = ref(0);

// Actions
async function loadPage() {
  loading.value = true;
  try {
    // The table tracks the first row index and the API takes a 1-based page
    const result = await listSubmissions({ page: first.value / pageSize.value + 1, pageSize: pageSize.value }).catch(
      rethrowAs(t('views.submissions.errors.load'))
    );
    submissions.value = result.items;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

function onPage(event: DataTablePageEvent) {
  first.value = event.first;
  pageSize.value = event.rows;
  return loadPage();
}

async function removeSubmission(submission: Submission) {
  await deleteSubmission(submission.id).catch(rethrowAs(t('views.submissions.errors.delete')));

  toast.success(t('views.submissions.deleted'));
  // Deleting the last row on a page leaves it empty, so show the page before it
  if (submissions.value.length === 1 && first.value > 0) first.value -= pageSize.value;
  await loadPage();
}

async function confirmDelete(submission: Submission) {
  const accepted = await confirm({
    acceptLabel: t('ui.actions.delete'),
    danger: true,
    message: t('views.submissions.confirmDelete.message', { name: submission.firstName }),
    rejectLabel: t('ui.actions.cancel'),
    title: t('views.submissions.confirmDelete.title')
  });
  if (accepted) await removeSubmission(submission);
}

onMounted(() => loadPage());
</script>

<template>
  <h1>{{ t('views.submissions.title') }}</h1>

  <DataTable
    v-model:first="first"
    :value="submissions"
    data-key="id"
    lazy
    paginator
    :rows="pageSize"
    :rows-per-page-options="PAGE_SIZE_OPTIONS"
    :total-records="total"
    :loading="loading"
    @page="onPage"
  >
    <template #empty>{{ t('views.submissions.empty') }}</template>
    <Column :header="t('views.submissions.columns.submitted')">
      <template #body="{ data }">{{ formatDateShort(data.createdAt) }}</template>
    </Column>
    <Column
      field="firstName"
      :header="t('views.submissions.columns.firstName')"
    />
    <Column
      field="email"
      :header="t('views.submissions.columns.email')"
    />
    <Column
      field="province"
      :header="t('views.submissions.columns.province')"
    />
    <Column
      field="city"
      :header="t('views.submissions.columns.city')"
    />
    <Column
      field="quantity"
      :header="t('views.submissions.columns.quantity')"
    />
    <Column :header="t('views.submissions.columns.actions')">
      <template #body="{ data }">
        <div class="flex gap-2">
          <Tooltip
            placement="bottom"
            :text="t('ui.actions.view')"
          >
            <Button
              icon="fa-solid fa-eye"
              icon-only
              :label="t('views.submissions.actions.view', { name: data.firstName })"
              :to="{ name: RouteName.SUBMISSION, params: { submissionId: data.id } }"
              variant="tertiary"
            />
          </Tooltip>
          <Tooltip
            placement="bottom"
            :text="t('ui.actions.delete')"
          >
            <Button
              danger
              icon="fa-solid fa-trash"
              icon-only
              :label="t('views.submissions.actions.delete', { name: data.firstName })"
              variant="tertiary"
              @click="confirmDelete(data)"
            />
          </Tooltip>
        </div>
      </template>
    </Column>
  </DataTable>
</template>
