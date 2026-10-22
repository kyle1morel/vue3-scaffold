<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { CopyToClipboard } from '@/components/form';
import { useAuthNStore, useConfigStore } from '@/store';
import { ButtonMode } from '@/utils/enums/application';

// Store
const { getAccessToken, getProfile } = storeToRefs(useAuthNStore());
const { getConfig } = storeToRefs(useConfigStore());

const appVersion = import.meta.env.APP_VERSION;
</script>

<template>
  <h2>Developer</h2>
  <div class="flex flex-col gap-6">
    <div class="flex gap-2">
      <span>Application version:</span>
      <span>v{{ appVersion }}{{ getConfig?.gitRev ? '-' + getConfig.gitRev.substring(0, 8) : '' }}</span>
    </div>

    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <h4>Config</h4>
        <CopyToClipboard
          :mode="ButtonMode.ICON"
          :to-copy="JSON.stringify(getConfig)"
        />
      </div>
      <pre class="whitespace-pre-wrap break-all">{{ getConfig }}</pre>
    </section>

    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <h4>Token</h4>
        <CopyToClipboard
          :mode="ButtonMode.ICON"
          :to-copy="getAccessToken"
        />
      </div>
      <pre class="whitespace-pre-wrap break-all">{{ getAccessToken }}</pre>
    </section>

    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <h4>Profile</h4>
        <CopyToClipboard
          :mode="ButtonMode.ICON"
          :to-copy="JSON.stringify(getProfile)"
        />
      </div>
      <pre class="whitespace-pre-wrap break-all">{{ getProfile }}</pre>
    </section>
  </div>
</template>
