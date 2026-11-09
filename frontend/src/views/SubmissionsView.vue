<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { Button, Tooltip } from '@/components/bcds';
import Column from '@/components/common/Column';
import DataTable from '@/components/common/DataTable.vue';
import { useConfirm } from '@/composables/useConfirm';
import { usePagedList } from '@/composables/usePagedList';
import { useToast } from '@/composables/useToast';
import { deleteSubmission, listSubmissions } from '@/services';
import { RouteName } from '@/utils/enums';
import { formatDateShort } from '@/utils/formatters';
import { rethrowAs } from '@/utils/utils';

import type { Submission } from '@/types';

// Composables
const { confirm } = useConfirm();
const { t } = useI18n();
const toast = useToast();
const {
  load,
  loading,
  page,
  pageSize,
  reloadAfterRemove,
  rows: submissions,
  total
} = usePagedList((request) => listSubmissions(request).catch(rethrowAs(t('views.submissions.errors.load'))));

// Actions

async function removeSubmission(submission: Submission) {
  await deleteSubmission(submission.id).catch(rethrowAs(t('views.submissions.errors.delete')));

  toast.success(t('views.submissions.deleted'));
  await reloadAfterRemove();
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

onMounted(() => load());
</script>

<template>
  <h1>{{ t('views.submissions.title') }}</h1>

  <DataTable
    v-model:page="page"
    v-model:page-size="pageSize"
    :loading
    paginator
    row-key="id"
    :rows="submissions"
    :total
    @page="load"
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
            :close-delay="0"
            :delay="0"
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
            :close-delay="0"
            :delay="0"
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
