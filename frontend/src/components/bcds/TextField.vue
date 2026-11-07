<script setup lang="ts">
import InputMask from 'primevue/inputmask';
import InputText from 'primevue/inputtext';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  mask = undefined,
  name = undefined,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  // Formats the text as it's typed, such as (999) 999-9999
  mask?: string;
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
    :error-message
    :label
    :required
  >
    <InputMask
      v-if="mask"
      :id
      v-model="value"
      class="w-full"
      :disabled
      :invalid
      :mask
      :name
      :placeholder
      :pt="{ root: inputAttrs }"
      :readonly
    />
    <InputText
      v-else
      :id
      v-model="value"
      class="w-full"
      :disabled
      :invalid
      :name
      :placeholder
      :pt="{ root: inputAttrs }"
      :readonly
    />
  </FieldWrapper>
</template>
