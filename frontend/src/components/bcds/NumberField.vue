<script setup lang="ts">
import InputNumber from 'primevue/inputnumber';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  maxFractionDigits = undefined,
  name = undefined,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  maxFractionDigits?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
}>();

const value = defineModel<number | null>();
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
    <InputNumber
      v-model="value"
      class="w-full"
      :disabled
      :input-id="id"
      :invalid
      :max-fraction-digits
      :name
      :placeholder
      :pt="{ pcInputText: { root: inputAttrs } }"
      :readonly
    />
  </FieldWrapper>
</template>
