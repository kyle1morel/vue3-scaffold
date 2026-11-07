<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsDatePicker from '@/components/bcds/DatePicker.vue';

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  maxDate = undefined,
  name,
  readonly = false,
  required = false,
  showTime = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  maxDate?: Date;
  name: string;
  readonly?: boolean;
  required?: boolean;
  showTime?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<Date | null | undefined>(() => name);
</script>

<template>
  <BcdsDatePicker
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :max-date
    :name
    :readonly
    :required
    :show-time
    @blur="handleBlur"
  />
</template>
