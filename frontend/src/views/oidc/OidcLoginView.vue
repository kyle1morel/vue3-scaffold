<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Button, Card, Divider } from '@/lib/primevue';
import { useAuthNStore } from '@/store';
import { IdentityProviderKind } from '@/utils/enums/application';
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
    <Card class="w-full max-w-[28.75rem]">
      <template #title>
        <div>
          <h3 class="mb-0 mx-2">{{ t('views.oidcLogin.title') }}</h3>
        </div>
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

          <Divider />

          <h4 class="my-3">{{ t('views.oidcLogin.headings.internalUsers') }}</h4>

          <Button
            class="p-button-outlined mt-3"
            data-test="idir-mfa-login-button"
            :aria-label="t('views.oidcLogin.providers.idir.login')"
            @click="login(IdentityProviderKind.AZUREIDIR)"
          >
            {{ t('views.oidcLogin.providers.idir.login') }}
          </Button>
          <div class="my-3">
            <Divider />
          </div>

          <h4 class="mb-3">{{ t('views.oidcLogin.headings.register') }}</h4>
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
