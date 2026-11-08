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
  maxLength = undefined,
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
  // Stops typing at this many characters, with a count of them under the box
  maxLength?: number;
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
    error-icon
    :error-message
    :counter="maxLength ? `${value?.length ?? 0}/${maxLength}` : undefined"
    :label
    :required
  >
    <Textarea
      :id
      v-model="value"
      class="w-full"
      :disabled
      :invalid
      :maxlength="maxLength"
      :name
      :placeholder
      :pt="{ root: inputAttrs }"
      :readonly
      :rows
    />
  </FieldWrapper>
</template>
