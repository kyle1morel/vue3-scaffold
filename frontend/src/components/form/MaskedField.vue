<script setup lang="ts">
import { vMaska } from 'maska/vue';
import { useField } from 'vee-validate';

import BcdsTextField from '@/components/bcds/TextField.vue';

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  mask,
  name,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  // Formats the text as it's typed: # is a digit, @ a letter and * either, such as (###) ###-####
  mask: string;
  name: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | undefined>(() => name);

// Actions
// An emptied field is no value, not an empty string.
function update(text?: string) {
  value.value = text || undefined;
}
</script>

<template>
  <!-- The directive finds the input inside the field. -->
  <BcdsTextField
    v-maska="mask"
    :model-value="value"
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :name
    :placeholder
    :readonly
    :required
    @blur="handleBlur"
    @update:model-value="update"
  />
</template>
