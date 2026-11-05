<script setup lang="ts">
import { useField } from 'vee-validate';

import { Password } from '@/lib/primevue';

import FormField from './FormField.vue';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  placeholder = undefined,
  disabled = false,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
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
    <!-- Feedback is off, so there's no popup for aria-expanded to describe -->
    <Password
      v-model="value"
      v-bind="listeners"
      :disabled
      :feedback="false"
      fluid
      :input-id="id"
      :input-props="{ ...inputAttrs, 'aria-expanded': undefined }"
      :invalid
      :name
      :placeholder
      toggle-mask
      @blur="handleBlur"
    />
  </FormField>
</template>
