<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import FooterLinks from './FooterLinks.vue';

// Props
const {
  copyright = '',
  fullWidth = false,
  hideAcknowledgement = false,
  hideCopyright = false,
  hideLogoAndLinks = false
} = defineProps<{
  copyright?: string;
  // Drops the 1100px cap, so the footer lines up with full-width content
  fullWidth?: boolean;
  hideAcknowledgement?: boolean;
  hideCopyright?: boolean;
  hideLogoAndLinks?: boolean;
}>();

const slots = defineSlots<{
  acknowledgement?(): unknown;
  contact?(): unknown;
  // Replaces the logo, contact and links, stacked to make room for more link lists
  default?(): unknown;
  links?(): unknown;
  logo?(): unknown;
}>();

// Composables
const { t } = useI18n();

// State
const links = computed(() => [
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
  },
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
]);
</script>

<template>
  <footer :class="['bcds-footer', { 'bcds-footer-full-width': fullWidth }]">
    <div
      v-if="!hideAcknowledgement"
      class="bcds-footer-acknowledgement"
    >
      <div class="bcds-footer-acknowledgement-text">
        <slot name="acknowledgement">
          <p>{{ t('components.footer.acknowledgement') }}</p>
        </slot>
      </div>
    </div>
    <div class="bcds-footer-container">
      <div class="bcds-footer-container-content">
        <div
          v-if="!hideLogoAndLinks"
          :class="[
            'bcds-footer-logo-links',
            slots.default ? 'bcds-footer-logo-links-vertical' : 'bcds-footer-logo-links-horizontal'
          ]"
        >
          <slot>
            <div class="bcds-footer-logo">
              <slot name="logo">
                <img
                  src="@/assets/images/BCID_H_rgb_pos.svg"
                  class="bcds-footer-logo-image"
                  alt=""
                />
              </slot>
              <slot name="contact">
                <i18n-t
                  keypath="components.footer.contact.message"
                  scope="global"
                  tag="p"
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
              </slot>
            </div>
            <slot name="links">
              <FooterLinks :title="t('components.footer.moreInfo')">
                <a
                  v-for="link in links"
                  :key="link.href"
                  :href="link.href"
                >
                  {{ link.label }}
                </a>
              </FooterLinks>
            </slot>
          </slot>
        </div>
        <hr v-if="!hideLogoAndLinks && !hideCopyright" />
        <p
          v-if="!hideCopyright"
          class="bcds-footer-copyright"
        >
          {{ copyright || `© ${new Date().getUTCFullYear()} ${t('components.footer.government')}.` }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@layer components {
  .bcds-footer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .bcds-footer-acknowledgement {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border-top: var(--layout-border-width-large) solid var(--theme-gold-60);
    border-bottom: var(--layout-border-width-large) solid var(--theme-gold-60);
    background-color: var(--theme-gray-110);
    padding: var(--layout-padding-xlarge);
  }

  .bcds-footer-acknowledgement-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    color: var(--typography-color-primary-invert);
    font: var(--typography-regular-small-body);
    max-width: 1100px;
    width: 100%;
  }

  .bcds-footer-acknowledgement-text > :deep(p) {
    margin: var(--layout-margin-none);
  }

  .bcds-footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    background-color: var(--surface-color-background-light-gray);
    padding: var(--layout-padding-xlarge);
  }

  .bcds-footer-container-content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--layout-padding-xlarge);
    max-width: 1100px;
    width: 100%;
  }

  .bcds-footer-full-width .bcds-footer-acknowledgement-text,
  .bcds-footer-full-width .bcds-footer-container-content {
    max-width: none;
  }

  .bcds-footer-logo-links {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    gap: var(--layout-padding-medium) var(--layout-padding-xlarge);
    justify-content: space-between;
    width: 100%;
  }

  .bcds-footer-logo-links-horizontal {
    flex-direction: row;
  }

  .bcds-footer-logo-links-vertical {
    flex-direction: column;
    align-items: stretch;
    row-gap: var(--layout-padding-xlarge);
  }

  .bcds-footer-logo {
    display: flex;
    flex-direction: column;
    gap: var(--layout-padding-large);
    min-width: 324px;
    width: 576px;
  }

  .bcds-footer-logo-image {
    width: 146px;
    min-width: 146px;
  }

  .bcds-footer-logo > :deep(p) {
    font: var(--typography-regular-small-body);
    margin: var(--layout-margin-none);
  }

  .bcds-footer-logo > :deep(p > a) {
    color: var(--typography-color-secondary);
    font: var(--typography-regular-small-body);
    text-decoration: underline;
  }

  .bcds-footer-logo > :deep(p > a:hover) {
    text-decoration: none;
  }

  /* The default links are narrower, so their list takes up at least 320px */
  .bcds-footer-logo-links-horizontal > :deep(.bcds-footer-links) {
    min-width: 320px;
  }

  /* Stacked, the links fill the width, so there's room for 4 columns */
  .bcds-footer-logo-links-vertical > :deep(.bcds-footer-links > ul) {
    grid-template-columns: repeat(4, 1fr);
  }

  .bcds-footer-container-content > hr {
    background-color: var(--surface-color-border-dark);
    border: var(--layout-border-width-none);
    height: var(--layout-border-width-small);
    margin: var(--layout-margin-none);
    width: 100%;
  }

  .bcds-footer-copyright {
    color: var(--typography-color-secondary);
    font: var(--typography-regular-body);
    margin: var(--layout-margin-none);
  }

  /* Tablet: links drop beneath the logo */
  @media (width <= 991px) {
    .bcds-footer-logo-links {
      flex-wrap: wrap;
    }

    .bcds-footer-logo {
      max-width: 324px;
    }

    .bcds-footer-logo-links-vertical > :deep(.bcds-footer-links > ul) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Extra small screens */
  @media (width <= 575px) {
    .bcds-footer-acknowledgement {
      padding: var(--layout-padding-xlarge) var(--layout-padding-medium);
    }

    .bcds-footer-container {
      padding: var(--layout-padding-medium);
    }

    .bcds-footer-container-content {
      gap: var(--layout-padding-medium);
    }

    .bcds-footer-logo {
      gap: var(--layout-padding-medium);
    }

    .bcds-footer-logo-links-vertical > :deep(.bcds-footer-links > ul) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
