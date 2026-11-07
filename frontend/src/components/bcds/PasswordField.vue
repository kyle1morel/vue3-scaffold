<script setup lang="ts">
import Password from 'primevue/password';

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
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
}>();

const value = defineModel<string>();
</script>

<template>
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    :description
    error-icon
    :error-message
    :label
    :required
  >
    <!-- Feedback is off, so there's no popup for aria-expanded to describe -->
    <Password
      v-model="value"
      :disabled
      :feedback="false"
      fluid
      :input-id="id"
      :input-props="{ ...inputAttrs, 'aria-expanded': undefined, readonly: readonly || undefined }"
      :invalid
      :name
      :placeholder
      toggle-mask
    />
  </FieldWrapper>
</template>
