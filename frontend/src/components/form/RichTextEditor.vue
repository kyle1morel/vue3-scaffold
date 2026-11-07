<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsRichTextEditor from '@/components/bcds/RichTextEditor.vue';

// Props
const {
  description = undefined,
  disabled = false,
  height = '160px',
  label = undefined,
  name,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  height?: string;
  label?: string;
  name: string;
  readonly?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | undefined>(() => name);
</script>

<template>
  <BcdsRichTextEditor
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :height
    :label
    :name
    :readonly
    :required
    @blur="handleBlur()"
  />
</template>
