<script setup lang="ts">
import { useField } from 'vee-validate';

import { Checkbox } from '@/lib/primevue';

import FormField from './FormField.vue';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  disabled = false,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<boolean | undefined>(() => name);
</script>

<template>
  <FormField
    v-slot="{ id, inputAttrs, invalid, listeners }"
    :error="errorMessage"
    :help-text
    :required
  >
    <div class="flex items-center">
      <Checkbox
        v-model="value"
        v-bind="listeners"
        binary
        :disabled
        :input-id="id"
        :invalid
        :name
        :pt="{ input: inputAttrs }"
        @blur="handleBlur"
      />
      <label
        v-if="label"
        class="pl-2 mb-0 font-bold"
        :for="id"
      >
        {{ label }}
        <span
          v-if="required"
          aria-hidden="true"
          class="text-[var(--p-support-required-text)]"
        >
          *
        </span>
      </label>
    </div>
  </FormField>
</template>
