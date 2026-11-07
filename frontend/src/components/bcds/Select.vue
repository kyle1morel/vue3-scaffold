<script setup lang="ts">
import InputText from 'primevue/inputtext';
import PrimeSelect from 'primevue/select';
import { computed } from 'vue';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  loading = false,
  name = undefined,
  optionLabel = undefined,
  options,
  optionValue = undefined,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  loading?: boolean;
  name?: string;
  // The property shown for object options; without it the option itself is shown
  optionLabel?: string;
  options: unknown[];
  // The property saved for object options; without it the option itself is saved
  optionValue?: string;
  placeholder?: string;
  // PrimeVue's Select has no read-only state, so this shows the chosen label in a read-only input
  readonly?: boolean;
  required?: boolean;
}>();

const value = defineModel<unknown>();

// State
const selectedLabel = computed(() => {
  const option = options.find((o) => resolve(o, optionValue) === value.value);
  const shown = option === undefined ? undefined : resolve(option, optionLabel);
  return shown === undefined || shown === null ? undefined : String(shown);
});

// Actions
function resolve(option: unknown, field?: string) {
  return field ? (option as Record<string, unknown>)?.[field] : option;
}
</script>

<template>
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid, labelId }"
    v-bind="$attrs"
    :description
    :error-message
    :label
    :non-labelable="!readonly"
    :required
  >
    <InputText
      v-if="readonly"
      :id
      class="w-full"
      :invalid
      :model-value="selectedLabel"
      :name
      :placeholder
      :pt="{ root: inputAttrs }"
      readonly
    />
    <PrimeSelect
      v-else
      v-model="value"
      :aria-labelledby="labelId"
      class="w-full"
      :disabled
      :input-id="id"
      :invalid
      :loading
      :name
      :options
      :option-label
      :option-value
      :placeholder
      :pt="{ label: inputAttrs }"
    />
  </FieldWrapper>
</template>
