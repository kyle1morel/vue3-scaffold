<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsRadioGroup from '@/components/bcds/RadioGroup.vue';

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  name,
  options,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  name: string;
  options: readonly ({ label: string | number; value: string | number } | string)[];
  readonly?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | number | undefined>(() => name);
</script>

<template>
  <BcdsRadioGroup
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :name
    :options
    :readonly
    :required
    @blur="handleBlur"
  />
</template>
