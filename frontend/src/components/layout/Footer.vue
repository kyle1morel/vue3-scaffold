<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Constants
const LINK_COLUMNS = [
  [
    { key: 'home', href: 'https://www2.gov.bc.ca/gov/content/home' },
    { key: 'about', href: 'https://www2.gov.bc.ca/gov/content?id=3C4F47288DFB454987435AB5EFEFBB7F' },
    { key: 'disclaimer', href: 'https://www2.gov.bc.ca/gov/content?id=79F93E018712422FBC8E674A67A70535' },
    { key: 'privacy', href: 'https://www2.gov.bc.ca/gov/content?id=9E890E16955E4FF4BF3B0E07B4722932' }
  ],
  [
    { key: 'accessibility', href: 'https://www2.gov.bc.ca/gov/content?id=E08E79740F9C41B9B0C484685CC5E412' },
    { key: 'copyright', href: 'https://www2.gov.bc.ca/gov/content?id=1AAACC9C65754E4D89A118B875E0FBDA' },
    { key: 'contactUs', href: 'https://www2.gov.bc.ca/gov/content?id=6A77C17D0CCB48F897F8598CCC019111' }
  ]
];

// Actions
const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col pt-8">
    <div class="bg-surface-950 text-surface-0 border-y-3 border-[var(--p-gold-950)] px-20 py-8">
      {{ t('common.footer.acknowledgement') }}
    </div>
    <div class="bg-surface-0 px-20 py-8">
      <div class="flex justify-between pb-8">
        <div class="flex flex-col">
          <img
            src="@/assets/images/BCID_H_rgb_pos.png"
            class="h-15 self-start"
            alt="B.C. Government Logo"
          />
          <i18n-t
            keypath="common.footer.contact.message"
            tag="p"
            class="max-w-100"
          >
            <template #callUs>
              <a href="https://www2.gov.bc.ca/gov/content?id=6A77C17D0CCB48F897F8598CCC019111">
                {{ t('common.footer.contact.callUs') }}
              </a>
            </template>
            <template #serviceCentre>
              <a href="https://www2.gov.bc.ca/gov/content?id=FBC4210F6BC047A5884198F543C97D53">
                {{ t('common.footer.contact.serviceCentre') }}
              </a>
            </template>
          </i18n-t>
        </div>
        <div class="pr-20">
          <p class="font-bold">{{ t('common.footer.moreInfo') }}</p>
          <div class="flex gap-20">
            <div
              v-for="(column, index) in LINK_COLUMNS"
              :key="index"
              class="flex flex-col"
            >
              <a
                v-for="link in column"
                :key="link.key"
                :href="link.href"
                class="text-color py-2 pr-4 no-underline hover:underline"
              >
                {{ t(`common.footer.${link.key}`) }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="border-t border-surface-950 pt-8">
        © {{ new Date().getUTCFullYear() }} {{ t('common.footer.gov') }}.
      </div>
    </div>
  </div>
</template>
