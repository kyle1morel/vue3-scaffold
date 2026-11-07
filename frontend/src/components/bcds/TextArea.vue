<script setup lang="ts">
import Textarea from 'primevue/textarea';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  name = undefined,
  placeholder = undefined,
  readonly = false,
  required = false,
  rows = 5
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
}>();

const value = defineModel<string>();
</script>

<template>
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    :description
    :error-message
    :label
    :required
  >
    <Textarea
      :id
      v-model="value"
      class="w-full"
      :disabled
      :invalid
      :name
      :placeholder
      :pt="{ root: inputAttrs }"
      :readonly
      :rows
    />
  </FieldWrapper>
</template>
