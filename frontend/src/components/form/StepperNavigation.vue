<script setup lang="ts">
import { nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

import { Button } from '@/lib/primevue';

// Props
const {
  nextCallback = () => {},
  nextDisabled = false,
  prevCallback = () => {},
  prevDisabled = false
} = defineProps<{
  nextCallback?: () => void;
  nextDisabled?: boolean;
  prevCallback?: () => void;
  prevDisabled?: boolean;
}>();

const activeStep = defineModel<number>('activeStep', {
  required: true
});

// Composables
const { t } = useI18n();

// Actions
function scrollToTop() {
  const stepperPanel = document.querySelector('.p-stepper');
  if (stepperPanel) {
    window.scroll(0, 0);
  }
}

function handleNextClick() {
  activeStep.value++;
  nextCallback?.();
  nextTick(() => scrollToTop());
}

function handlePrevClick() {
  activeStep.value--;
  prevCallback?.();
  nextTick(() => scrollToTop());
}
</script>

<template>
  <div class="flex pt-6 justify-between">
    <Button
      :aria-label="t('components.stepperNavigation.previous')"
      :class="prevDisabled ? 'invisible' : 'visible'"
      class="px-6 py-1"
      outlined
      icon="pi pi-arrow-left"
      icon-class="text-xl"
      :disabled="prevDisabled"
      @click="handlePrevClick"
    />
    <slot name="content" />
    <Button
      :aria-label="t('components.stepperNavigation.next')"
      :class="nextDisabled ? 'invisible' : 'visible'"
      class="px-6 py-1"
      outlined
      icon="pi pi-arrow-right"
      icon-class="text-xl"
      :disabled="nextDisabled"
      @click="handleNextClick"
    />
  </div>
</template>
