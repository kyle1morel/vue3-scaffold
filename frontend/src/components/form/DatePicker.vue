<script setup lang="ts">
import { useField } from 'vee-validate';

import { DatePicker } from '@/lib/primevue';

import FormField from './FormField.vue';

import type { DatePickerBlurEvent } from 'primevue/datepicker';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  disabled = false,
  showTime = false,
  placeholder = undefined,
  maxDate = undefined,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  disabled?: boolean;
  showTime?: boolean;
  placeholder?: string;
  maxDate?: Date;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<Date | null | undefined>(() => name);
</script>

<template>
  <FormField
    v-slot="{ id, inputAttrs, invalid, listeners }"
    :error="errorMessage"
    :help-text
    :label
    :required
  >
    <DatePicker
      v-model="value"
      v-bind="listeners"
      :disabled
      fluid
      icon-display="input"
      :input-id="id"
      :invalid
      :max-date
      :name
      :placeholder
      :pt="{ pcInputText: { root: inputAttrs } }"
      show-icon
      :show-time
      @blur="(e: DatePickerBlurEvent) => handleBlur(e.originalEvent)"
    />
  </FormField>
</template>
