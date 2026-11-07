<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsCheckbox from '@/components/bcds/Checkbox.vue';

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  name,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  name: string;
  readonly?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<boolean | undefined>(() => name);
</script>

<template>
  <BcdsCheckbox
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :name
    :readonly
    :required
    @blur="handleBlur"
  />
</template>
