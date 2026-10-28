<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { CopyToClipboard } from '@/components/form';
import { useAuthNStore, useConfigStore } from '@/store';
import { ButtonMode } from '@/utils/enums/application';

// Composables
const { t } = useI18n();

// Store
const { getAccessToken, getProfile } = storeToRefs(useAuthNStore());
const { getConfig } = storeToRefs(useConfigStore());

const appVersion = computed(() => {
  const gitRev = getConfig.value?.gitRev?.substring(0, 8);
  return `v${import.meta.env.APP_VERSION}${gitRev ? `-${gitRev}` : ''}`;
});
</script>

<template>
  <h2>{{ t('views.developer.title') }}</h2>
  <div class="flex flex-col gap-6">
    <div class="flex gap-2">
      <span>{{ t('views.developer.appVersion') }}</span>
      <span>{{ appVersion }}</span>
    </div>

    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <h4>{{ t('views.developer.config') }}</h4>
        <CopyToClipboard
          :mode="ButtonMode.ICON"
          :to-copy="JSON.stringify(getConfig)"
        />
      </div>
      <pre class="whitespace-pre-wrap break-all">{{ getConfig }}</pre>
    </section>

    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <h4>{{ t('views.developer.token') }}</h4>
        <CopyToClipboard
          :mode="ButtonMode.ICON"
          :to-copy="getAccessToken"
        />
      </div>
      <pre class="whitespace-pre-wrap break-all">{{ getAccessToken }}</pre>
    </section>

    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <h4>{{ t('views.developer.profile') }}</h4>
        <CopyToClipboard
          :mode="ButtonMode.ICON"
          :to-copy="JSON.stringify(getProfile)"
        />
      </div>
      <pre class="whitespace-pre-wrap break-all">{{ getProfile }}</pre>
    </section>
  </div>
</template>
