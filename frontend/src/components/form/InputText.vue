<script setup lang="ts">
import { ErrorMessage } from 'vee-validate';

import InputTextInternal from './internal/InputTextInternal.vue';
import { FloatLabel } from '@/lib/primevue';

// Props
const {
  helpText = '',
  label = '',
  labelUrl = undefined,
  name,
  placeholder = '',
  disabled = false,
  floatLabel = false,
  bold = true,
  tooltip = undefined,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  labelUrl?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  bold?: boolean;
  floatLabel?: boolean;
  tooltip?: string;
  required?: boolean;
}>();

// Emits
const emit = defineEmits<{
  change: [event: Event];
  click: [event: MouseEvent];
  input: [event: Event];
}>();
</script>

<template>
  <div>
    <FloatLabel v-if="floatLabel">
      <InputTextInternal
        v-bind="{ label, labelUrl, name, placeholder, disabled, bold, tooltip, required }"
        @change="(e: Event) => emit('change', e)"
        @click="(e: MouseEvent) => emit('click', e)"
        @input="(e: Event) => emit('input', e)"
      />
    </FloatLabel>
    <InputTextInternal
      v-else
      v-bind="{ label, labelUrl, name, placeholder, disabled, bold, tooltip, required }"
      @change="(e: Event) => emit('change', e)"
      @click="(e: MouseEvent) => emit('click', e)"
      @input="(e: Event) => emit('input', e)"
    />

    <small :id="`${name}-help`">
      {{ helpText }}
    </small>
    <div class="mt-2">
      <ErrorMessage
        :name="name"
        class="app-error-message"
      />
    </div>
  </div>
</template>
