<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsDatePicker from '@/components/bcds/DatePicker.vue';

// Props
const {
  description = undefined,
  disabled = false,
  granularity = 'day',
  label = undefined,
  maxValue = undefined,
  name,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  label?: string;
  maxValue?: Date;
  name: string;
  readonly?: boolean;
  required?: boolean;
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
    :granularity
    :label
    :max-value
    :name
    :readonly
    :required
    @blur="handleBlur"
  />
</template>
