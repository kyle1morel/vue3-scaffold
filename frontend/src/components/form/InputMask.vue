<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';

import { InputMask } from '@/lib/primevue';

import FormField from './FormField.vue';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  mask,
  placeholder = undefined,
  disabled = false,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  mask: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | undefined>(() => name);

// A cleared mask is no value, not an empty string
const maskedValue = computed({
  get: () => value.value || undefined,
  set: (val?: string) => (value.value = val || undefined)
});
</script>

<template>
  <FormField
    v-slot="{ id, inputAttrs, invalid, listeners }"
    :error="errorMessage"
    :help-text
    :label
    :required
  >
    <InputMask
      :id
      v-model="maskedValue"
      v-bind="{ ...listeners, ...inputAttrs }"
      class="w-full"
      :disabled
      :invalid
      :mask
      :name
      :placeholder
      @blur="handleBlur"
    />
  </FormField>
</template>
