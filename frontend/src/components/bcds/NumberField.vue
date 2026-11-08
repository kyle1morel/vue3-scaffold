<script setup lang="ts">
import { NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput, NumberFieldRoot } from 'reka-ui';
import { useI18n } from 'vue-i18n';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  formatOptions = undefined,
  isWheelDisabled = false,
  label = undefined,
  maxValue = undefined,
  minValue = undefined,
  name = undefined,
  placeholder = undefined,
  readonly = false,
  required = false,
  size = 'medium',
  step = 1
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // How the number is shown, such as { style: 'currency', currency: 'CAD' }
  formatOptions?: Intl.NumberFormatOptions;
  // Stops the mouse wheel changing the value while the field has focus
  isWheelDisabled?: boolean;
  label?: string;
  maxValue?: number;
  minValue?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  size?: 'medium' | 'small';
  // How much the minus and plus buttons change the value
  step?: number;
}>();

const value = defineModel<number | null>();

// Composables
const { locale } = useI18n();
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
    <!-- Clearing the input gives undefined, which the form treats as no value, as it does null -->
    <NumberFieldRoot
      v-model="value"
      class="app-input number-field"
      :class="[size, { invalid, readonly }]"
      :disabled
      :disable-wheel-change="isWheelDisabled"
      :format-options
      :locale
      :max="maxValue"
      :min="minValue"
      :name
      :readonly
      :required
      :step
    >
      <NumberFieldDecrement
        v-if="!readonly"
        class="step"
      >
        <font-awesome-icon icon="fa-solid fa-minus" />
      </NumberFieldDecrement>
      <NumberFieldInput
        :id
        v-bind="inputAttrs"
        :aria-invalid="invalid || undefined"
        class="input"
        :placeholder
      />
      <font-awesome-icon
        v-if="invalid"
        class="error-icon"
        icon="fa-solid fa-triangle-exclamation"
      />
      <NumberFieldIncrement
        v-if="!readonly"
        class="step"
      >
        <font-awesome-icon icon="fa-solid fa-plus" />
      </NumberFieldIncrement>
    </NumberFieldRoot>
  </FieldWrapper>
</template>

<style scoped>
.number-field {
  gap: 0;
  padding: 0;
}

.input {
  align-self: stretch;
  padding: var(--layout-padding-small) 0.75rem;
}

.small .input {
  padding-block: var(--layout-padding-hair);
}

.error-icon {
  padding-right: 0.75rem;
  color: var(--icons-color-danger);
}

.step {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: stretch;
  width: var(--layout-margin-xxlarge);
  padding: 0;
  border: none;
  background: transparent;
  color: var(--icons-color-primary);
  cursor: pointer;
}

.small .step {
  width: var(--layout-margin-xlarge);
}

.step:first-child {
  border-right: var(--layout-border-width-small) solid var(--surface-color-border-default);
}

.step:last-child {
  border-left: var(--layout-border-width-small) solid var(--surface-color-border-default);
}

.step:hover {
  background: var(--surface-color-secondary-button-hover);
}

.step:disabled {
  color: var(--icons-color-disabled);
  cursor: not-allowed;
}
</style>
