<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsTextField from '@/components/bcds/TextField.vue';

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  mask = undefined,
  name,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  // Formats the text as it's typed, such as (999) 999-9999
  mask?: string;
  name: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | undefined>(() => name);

// Actions
// A cleared mask is no value, not an empty string
function update(val?: string) {
  value.value = mask ? val || undefined : val;
}
</script>

<template>
  <BcdsTextField
    :model-value="value"
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :mask
    :name
    :placeholder
    :readonly
    :required
    @blur="handleBlur"
    @update:model-value="update"
  />
</template>
