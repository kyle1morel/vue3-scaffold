<script setup lang="ts">
import PrimeCheckbox from 'primevue/checkbox';
import { mergeProps } from 'vue';
import { useI18n } from 'vue-i18n';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  name = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  name?: string;
  readonly?: boolean;
  required?: boolean;
}>();

const value = defineModel<boolean>();

// Composables
const { t } = useI18n();

// Actions
// PrimeVue's readonly only skips the update, so the click is cancelled to stop the native checkbox toggling
function preventToggle(event: Event) {
  if (readonly) event.preventDefault();
}
</script>

<template>
  <!-- The label sits beside the box, so the wrapper only adds the description and error -->
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    :description
    :error-message
    :required
  >
    <div class="flex items-center">
      <PrimeCheckbox
        v-model="value"
        binary
        :disabled
        :input-id="id"
        :invalid
        :name
        :pt="{ input: mergeProps(inputAttrs, { 'aria-readonly': readonly || undefined, onClick: preventToggle }) }"
        :readonly
      />
      <label
        v-if="label"
        class="app-field-label pl-2 mb-0"
        :class="{ 'cursor-not-allowed': readonly }"
        :for="id"
      >
        {{ label }}
        <span
          v-if="required"
          class="app-field-required"
        >
          {{ t('components.fieldWrapper.required') }}
        </span>
      </label>
    </div>
  </FieldWrapper>
</template>
