<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsPasswordField from '@/components/bcds/PasswordField.vue';

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  name,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  name: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | undefined>(() => name);
</script>

<template>
  <BcdsPasswordField
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :name
    :placeholder
    :readonly
    :required
    @blur="handleBlur"
  />
</template>
