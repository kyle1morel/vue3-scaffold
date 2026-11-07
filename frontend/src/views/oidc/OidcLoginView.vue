<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Button, Separator } from '@/components/bcds';
import Card from '@/components/common/Card.vue';
import { useAuthNStore } from '@/store';
import { IdentityProviderKind } from '@/utils/enums';
import { findIdpConfig } from '@/utils/utils';

// Actions
const { t } = useI18n();

function login(kind: IdentityProviderKind) {
  const idpCfg = findIdpConfig(kind);
  if (idpCfg) useAuthNStore().login(idpCfg.idp);
}
</script>

<template>
  <div class="flex justify-center mt-7">
    <Card class="w-full max-w-[32rem]">
      <template #title>
        <h1 class="mx-2 my-0">{{ t('views.oidcLogin.title') }}</h1>
      </template>
      <template #content>
        <div class="flex flex-col justify-center mx-2">
          <Button
            class="mb-3"
            data-test="bcsc-login-button"
            :aria-label="t('views.oidcLogin.providers.bcsc.login')"
            @click="login(IdentityProviderKind.BCSC)"
          >
            {{ t('views.oidcLogin.providers.bcsc.login') }}
          </Button>
          <Button
            class="mb-3"
            data-test="bceid-login-button"
            :aria-label="t('views.oidcLogin.providers.basicBceid.login')"
            @click="login(IdentityProviderKind.BCEID)"
          >
            {{ t('views.oidcLogin.providers.basicBceid.login') }}
          </Button>
          <Button
            class="mb-3"
            data-test="bceid-business-login-button"
            :aria-label="t('views.oidcLogin.providers.businessBceid.login')"
            @click="login(IdentityProviderKind.BCEIDBUSINESS)"
          >
            {{ t('views.oidcLogin.providers.businessBceid.login') }}
          </Button>

          <Separator size="small" />

          <h2 class="mt-0 mb-3">{{ t('views.oidcLogin.headings.internalUsers') }}</h2>

          <Button
            variant="secondary"
            class="mb-3"
            data-test="idir-mfa-login-button"
            :aria-label="t('views.oidcLogin.providers.idir.login')"
            @click="login(IdentityProviderKind.AZUREIDIR)"
          >
            {{ t('views.oidcLogin.providers.idir.login') }}
          </Button>
          <Separator size="small" />

          <h2 class="mt-0 mb-3">{{ t('views.oidcLogin.headings.register') }}</h2>
          <div class="outline outline-[var(--p-borderlight)] rounded-lg p-2 mb-3">
            <a
              class="mb-3 mr-1"
              href="https://id.gov.bc.ca/account/"
              target="_blank"
            >
              {{ t('views.oidcLogin.providers.bcsc.register') }}
            </a>
            <span>{{ t('views.oidcLogin.providers.bcsc.requirement') }}</span>
          </div>
          <div class="outline outline-[var(--p-borderlight)] rounded-lg p-2 mb-3">
            <a
              class="mb-3 mr-1"
              href="https://www.bceid.ca/register/basic/account_details.aspx?type=regular&eServiceType=basic"
              target="_blank"
            >
              {{ t('views.oidcLogin.providers.basicBceid.register') }}
            </a>
            <span>{{ t('views.oidcLogin.providers.basicBceid.requirement') }}</span>
          </div>

          <div class="outline outline-[var(--p-borderlight)] rounded-lg p-2">
            <a
              class="mb-3 mr-1"
              href="https://www.bceid.ca/register/business/getting_started/getting_started.aspx"
              target="_blank"
            >
              {{ t('views.oidcLogin.providers.businessBceid.register') }}
            </a>
            <span>{{ t('views.oidcLogin.providers.businessBceid.requirement') }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
