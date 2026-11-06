<script setup lang="ts">
import { useField } from 'vee-validate';

import { Textarea } from '@/lib/primevue';

import FormField from './FormField.vue';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  placeholder = undefined,
  disabled = false,
  readonly = false,
  rows = 5,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  rows?: number;
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
  >
    <Textarea
      :id
      v-model="value"
      v-bind="{ ...listeners, ...inputAttrs }"
      class="w-full"
      :disabled
      :readonly
      :invalid
      :name
      :placeholder
      :rows
      @blur="handleBlur"
    />
  </FormField>
</template>
