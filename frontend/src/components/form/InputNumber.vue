<script setup lang="ts">
import { useField } from 'vee-validate';

import { InputNumber } from '@/lib/primevue';

import FormField from './FormField.vue';

import type { InputNumberBlurEvent } from 'primevue/inputnumber';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  placeholder = undefined,
  disabled = false,
  readonly = false,
  maxFractionDigits = undefined,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  maxFractionDigits?: number;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<number | null | undefined>(() => name);
</script>

<template>
  <FormField
    v-slot="{ id, inputAttrs, invalid, listeners }"
    :error="errorMessage"
    :help-text
    :label
    :required
  >
    <InputNumber
      v-model="value"
      v-bind="listeners"
      class="w-full"
      :disabled
      :readonly
      :input-id="id"
      :invalid
      :max-fraction-digits
      :name
      :placeholder
      :pt="{ pcInputText: { root: inputAttrs } }"
      @blur="(e: InputNumberBlurEvent) => handleBlur(e.originalEvent)"
    />
  </FormField>
</template>
