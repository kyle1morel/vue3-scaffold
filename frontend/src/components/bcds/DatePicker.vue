<script setup lang="ts">
import PrimeDatePicker from 'primevue/datepicker';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  maxDate = undefined,
  name = undefined,
  readonly = false,
  required = false,
  showTime = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  maxDate?: Date;
  name?: string;
  readonly?: boolean;
  required?: boolean;
  showTime?: boolean;
}>();

const value = defineModel<Date | null>();

// Composables
const { t } = useI18n();

// State
// The input is one text box, so the format is spelled out under it, as in the BC Design System date picker
const descriptionLines = computed(() => [
  showTime ? t('components.datePicker.formatWithTime') : t('components.datePicker.format'),
  description ?? ''
]);
</script>

<template>
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    :description="descriptionLines"
    :error-message
    :label
    :required
  >
    <PrimeDatePicker
      v-model="value"
      :disabled
      fluid
      icon-display="input"
      :input-id="id"
      :invalid
      :max-date
      :name
      :pt="{ pcInputText: { root: inputAttrs } }"
      :readonly
      show-icon
      :show-time
    />
  </FieldWrapper>
</template>
