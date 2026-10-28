<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();

// State
const linkColumns = computed(() => [
  [
    { label: t('components.footer.home'), href: 'https://www2.gov.bc.ca/gov/content/home' },
    {
      label: t('components.footer.about'),
      href: 'https://www2.gov.bc.ca/gov/content?id=3C4F47288DFB454987435AB5EFEFBB7F'
    },
    {
      label: t('components.footer.disclaimer'),
      href: 'https://www2.gov.bc.ca/gov/content?id=79F93E018712422FBC8E674A67A70535'
    },
    {
      label: t('components.footer.privacy'),
      href: 'https://www2.gov.bc.ca/gov/content?id=9E890E16955E4FF4BF3B0E07B4722932'
    }
  ],
  [
    {
      label: t('components.footer.accessibility'),
      href: 'https://www2.gov.bc.ca/gov/content?id=E08E79740F9C41B9B0C484685CC5E412'
    },
    {
      label: t('components.footer.copyright'),
      href: 'https://www2.gov.bc.ca/gov/content?id=1AAACC9C65754E4D89A118B875E0FBDA'
    },
    {
      label: t('components.footer.contactUs'),
      href: 'https://www2.gov.bc.ca/gov/content?id=6A77C17D0CCB48F897F8598CCC019111'
    }
  ]
]);
</script>

<template>
  <div class="flex flex-col pt-8">
    <div class="bg-surface-950 text-surface-0 border-y-3 border-[var(--p-gold-950)] px-4 md:px-20 py-8">
      {{ t('components.footer.acknowledgement') }}
    </div>
    <div class="bg-surface-0 px-4 md:px-20 py-8">
      <div class="flex flex-col md:flex-row md:justify-between gap-8 pb-8">
        <div class="flex flex-col">
          <img
            src="@/assets/images/BCID_H_rgb_pos.png"
            class="h-15 self-start"
            :alt="t('app.logoAlt')"
          />
          <i18n-t
            keypath="components.footer.contact.message"
            scope="global"
            tag="p"
            class="max-w-100"
          >
            <template #callUs>
              <a href="https://www2.gov.bc.ca/gov/content?id=6A77C17D0CCB48F897F8598CCC019111">
                {{ t('components.footer.contact.callUs') }}
              </a>
            </template>
            <template #serviceCentre>
              <a href="https://www2.gov.bc.ca/gov/content?id=FBC4210F6BC047A5884198F543C97D53">
                {{ t('components.footer.contact.serviceCentre') }}
              </a>
            </template>
          </i18n-t>
        </div>
        <div class="md:pr-20">
          <p class="font-bold uppercase">{{ t('components.footer.moreInfo') }}</p>
          <div class="flex gap-x-12 md:gap-x-20">
            <div
              v-for="(column, index) in linkColumns"
              :key="index"
              class="flex flex-col"
            >
              <a
                v-for="link in column"
                :key="link.href"
                :href="link.href"
                class="text-color py-2 pr-4 no-underline hover:underline"
              >
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="border-t border-surface-950 pt-8">
        © {{ new Date().getUTCFullYear() }} {{ t('components.footer.government') }}.
      </div>
    </div>
  </div>
</template>
