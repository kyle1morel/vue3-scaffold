<script setup lang="ts">
import { useField, ErrorMessage } from 'vee-validate';

import { Select } from '@/lib/primevue';

import type { SelectChangeEvent } from 'primevue/select';
import type { InputEvent } from '@/types';

// Props
const {
  helpText = '',
  label = '',
  name,
  dataKey = undefined,
  placeholder = '',
  disabled = false,
  options,
  getOptionLabel = undefined,
  optionValue = undefined,
  bold = true
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  dataKey?: string | undefined;
  placeholder?: string;
  disabled?: boolean;
  options: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOptionLabel?: string | ((data: any) => string) | undefined; // Matches Prisma type
  optionValue?: string;
  bold?: boolean;
}>();

// Emits
const emit = defineEmits<{
  input: [event: InputEvent];
  change: [event: SelectChangeEvent];
}>();

const { errorMessage, handleBlur, value } = useField<string>(name);
</script>

<template>
  <div>
    <label
      :id="`${name}-label`"
      :class="{ 'font-bold': bold }"
      :for="name"
    >
      {{ label }}
    </label>
    <Select
      v-model="value"
      append-to="body"
      editable
      :aria-describedby="`${name}-help`"
      :aria-labelledby="`${name}-label`"
      :name="name"
      :placeholder="placeholder"
      class="w-full"
      :invalid="!!errorMessage"
      :disabled="disabled"
      :options="options"
      :option-label="getOptionLabel"
      :option-value="optionValue"
      :data-key="dataKey"
      @blur="handleBlur"
      @input="(e: InputEvent) => emit('input', e)"
      @change="(e) => emit('change', e)"
    />
    <small :id="`${name}-help`">{{ helpText }}</small>
    <div class="mt-2">
      <ErrorMessage
        :name="name"
        class="app-error-message"
      />
    </div>
  </div>
</template>
