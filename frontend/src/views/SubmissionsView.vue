<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { Button, Column, DataTable, useConfirm, useToast } from '@/lib/primevue';
import { deleteSubmission, listSubmissions } from '@/services';
import { RouteName } from '@/utils/enums/application';
import { formatDateShort } from '@/utils/formatters';

import type { DataTablePageEvent } from 'primevue/datatable';
import type { Submission } from '@/types';

// Constants
const PAGE_SIZE_OPTIONS = [10, 25, 50];

// Composables
const confirm = useConfirm();
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
    const result = await listSubmissions({ page: first.value / pageSize.value + 1, pageSize: pageSize.value });
    submissions.value = result.items;
    total.value = result.total;
  } catch {
    toast.error(t('views.submissions.errors.load'));
  } finally {
    loading.value = false;
  }
}

function onPage(event: DataTablePageEvent) {
  first.value = event.first;
  pageSize.value = event.rows;
  loadPage();
}

async function removeSubmission(submission: Submission) {
  try {
    await deleteSubmission(submission.id);
  } catch {
    toast.error(t('views.submissions.errors.delete'));
    return;
  }

  toast.success(t('views.submissions.deleted'));
  // Deleting the last row on a page leaves it empty, so show the page before it
  if (submissions.value.length === 1 && first.value > 0) first.value -= pageSize.value;
  await loadPage();
}

function confirmDelete(submission: Submission) {
  confirm.require({
    header: t('views.submissions.confirmDelete.title'),
    message: t('views.submissions.confirmDelete.message', { name: submission.firstName }),
    acceptLabel: t('ui.actions.delete'),
    acceptClass: 'p-button-danger',
    rejectLabel: t('ui.actions.cancel'),
    rejectProps: { outlined: true },
    accept: () => removeSubmission(submission)
  });
}

onMounted(() => loadPage());
</script>

<template>
  <h2>{{ t('views.submissions.title') }}</h2>

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
          <Button
            v-tooltip.bottom="t('ui.actions.view')"
            as="router-link"
            :to="{ name: RouteName.SUBMISSION, params: { submissionId: data.id } }"
            icon="pi pi-eye"
            text
            :aria-label="t('views.submissions.actions.view', { name: data.firstName })"
          />
          <Button
            v-tooltip.bottom="t('ui.actions.delete')"
            icon="pi pi-trash"
            severity="danger"
            text
            :aria-label="t('views.submissions.actions.delete', { name: data.firstName })"
            @click="confirmDelete(data)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
