<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { DatePicker } from '@/lib/primevue';

import FormField from './FormField.vue';

import type { DatePickerBlurEvent } from 'primevue/datepicker';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  disabled = false,
  readonly = false,
  showFormatHelpText = true,
  showTime = false,
  maxDate = undefined,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  disabled?: boolean;
  readonly?: boolean;
  // The input is one text box, so the format is spelled out under it, as in the BC Design System date picker
  showFormatHelpText?: boolean;
  showTime?: boolean;
  maxDate?: Date;
  required?: boolean;
}>();

// Composables
const { t } = useI18n();

// State
const { errorMessage, handleBlur, value } = useField<Date | null | undefined>(() => name);

const helpLines = computed(() => {
  const format = showTime ? t('components.datePicker.formatWithTime') : t('components.datePicker.format');
  return [showFormatHelpText ? format : '', helpText ?? ''];
});
</script>

<template>
  <FormField
    v-slot="{ id, inputAttrs, invalid, listeners }"
    :error="errorMessage"
    :help-text="helpLines"
    :label
    :required
  >
    <DatePicker
      v-model="value"
      v-bind="listeners"
      :disabled
      :readonly
      fluid
      icon-display="input"
      :input-id="id"
      :invalid
      :max-date
      :name
      :pt="{ pcInputText: { root: inputAttrs } }"
      show-icon
      :show-time
      @blur="(e: DatePickerBlurEvent) => handleBlur(e.originalEvent)"
    />
  </FormField>
</template>
