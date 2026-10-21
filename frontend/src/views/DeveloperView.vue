<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { CopyToClipboard } from '@/components/form';
import { useAuthNStore, useConfigStore } from '@/store';
import { ButtonMode } from '@/utils/enums/application';

// Store
const { getAccessToken, getProfile } = storeToRefs(useAuthNStore());
const { getConfig } = storeToRefs(useConfigStore());
</script>

<template>
  <h2>Developer</h2>
  <div class="flex">
    <div>Application version:</div>
    <div
      v-if="getConfig"
      class="version pl-2"
    >
      {{ getConfig.gitRev ? '-' + getConfig.gitRev.substring(0, 8) : '' }}
    </div>
  </div>
  <div>
    <div class="flex items-center mt-4">
      <h3 class="mr-2">Config</h3>
      <div>
        <CopyToClipboard
          :mode="ButtonMode.ICON"
          :to-copy="JSON.stringify(getConfig)"
        />
      </div>
    </div>
    {{ getConfig }}

    <div class="flex items-center mt-4">
      <h3 class="mr-2">Token</h3>
      <div>
        <CopyToClipboard
          :mode="ButtonMode.ICON"
          :to-copy="getAccessToken"
        />
      </div>
    </div>

    <div class="wrap-block">
      {{ getAccessToken }}
    </div>

    <div class="flex items-center mt-4">
      <h3 class="mr-2">Profile</h3>
      <div>
        <CopyToClipboard
          :mode="ButtonMode.ICON"
          :to-copy="JSON.stringify(getProfile)"
        />
      </div>
    </div>
    {{ getProfile }}
  </div>
</template>

<style lang="scss" scoped>
h3 {
  margin-top: 1em;
}
</style>
