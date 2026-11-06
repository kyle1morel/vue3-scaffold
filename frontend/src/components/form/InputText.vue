<script setup lang="ts">
import { useField } from 'vee-validate';

import { InputText } from '@/lib/primevue';

import FormField from './FormField.vue';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  placeholder = undefined,
  disabled = false,
  readonly = false,
  tooltip = undefined,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  tooltip?: string;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | undefined>(() => name);
</script>

<template>
  <FormField
    v-slot="{ id, inputAttrs, invalid, listeners }"
    :error="errorMessage"
    :help-text
    :label
    :required
    :tooltip
  >
    <InputText
      :id
      v-model="value"
      v-bind="{ ...listeners, ...inputAttrs }"
      class="w-full"
      :disabled
      :readonly
      :invalid
      :name
      :placeholder
      @blur="handleBlur"
    />
  </FormField>
</template>
