<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsTextArea from '@/components/bcds/TextArea.vue';

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  name,
  placeholder = undefined,
  readonly = false,
  required = false,
  rows = 5
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  name: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | undefined>(() => name);
</script>

<template>
  <BcdsTextArea
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :name
    :placeholder
    :readonly
    :required
    :rows
    @blur="handleBlur"
  />
</template>
