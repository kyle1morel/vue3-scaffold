<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsSelect from '@/components/bcds/Select.vue';

import type { SelectItemProps, SelectSectionProps } from '@/components/bcds';

// Props
const {
  description = undefined,
  disabled = false,
  items = undefined,
  label = undefined,
  loading = false,
  name,
  overflow = 'wrap',
  placeholder = undefined,
  readonly = false,
  required = false,
  sections = undefined,
  selectionMode = 'single',
  size = 'medium'
} = defineProps<{
  description?: string;
  disabled?: boolean;
  items?: SelectItemProps[];
  label?: string;
  loading?: boolean;
  name: string;
  overflow?: 'scroll' | 'wrap';
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  sections?: SelectSectionProps[];
  selectionMode?: 'multiple' | 'single';
  size?: 'medium' | 'small';
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | number | (string | number)[] | null>(() => name);
</script>

<template>
  <BcdsSelect
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :items
    :label
    :loading
    :name
    :overflow
    :placeholder
    :readonly
    :required
    :sections
    :selection-mode
    :size
    @blur="handleBlur"
  />
</template>
