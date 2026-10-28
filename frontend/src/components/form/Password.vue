<script setup lang="ts">
import { useField, ErrorMessage } from 'vee-validate';

import { Password } from '@/lib/primevue';

// Props
const {
  helpText = '',
  type = 'text',
  label = '',
  name,
  placeholder = '',
  bold = true,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  placeholder?: string;
  type?: string;
  bold?: boolean;
  required?: boolean;
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
      <span
        v-if="required"
        class="text-[var(--p-support-required-text)]"
      >
        *
      </span>
    </label>
    <!-- Only inputProps reach the input; plain attributes land on PrimeVue's wrapper div. Feedback is off, so there's
         no popup for aria-expanded to describe -->
    <Password
      v-model="value"
      :aria-labelledby="`${name}-label`"
      :input-id="name"
      :input-props="{ 'aria-describedby': `${name}-help`, 'aria-required': required, 'aria-expanded': undefined }"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      fluid
      :invalid="!!errorMessage"
      :feedback="false"
      toggle-mask
      @blur="handleBlur"
    />
    <small :id="`${name}-help`">{{ helpText }}</small>
    <div>
      <ErrorMessage
        :name="name"
        class="app-error-message"
      />
    </div>
  </div>
</template>
