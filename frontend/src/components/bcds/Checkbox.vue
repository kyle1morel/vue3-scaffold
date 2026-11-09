<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui';
import { useI18n } from 'vue-i18n';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  indeterminate = false,
  label = undefined,
  name = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // Neither checked nor unchecked, such as a select-all box when only some are selected
  indeterminate?: boolean;
  label?: string;
  name?: string;
  readonly?: boolean;
  required?: boolean;
}>();

const value = defineModel<boolean>();

// Composables
const { t } = useI18n();

// Actions
// Reka has no read-only state, so a read-only box ignores the change.
function update(checked: boolean | 'indeterminate') {
  if (!readonly) value.value = checked === true;
}
</script>

<template>
  <!-- The label sits beside the box, so the wrapper only adds the description and error. -->
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    :description
    error-icon
    :error-message
    :required
  >
    <div class="flex items-center">
      <CheckboxRoot
        :id
        v-bind="inputAttrs"
        :aria-invalid="invalid || undefined"
        :aria-readonly="readonly || undefined"
        class="bcds-checkbox-box"
        :class="{ 'bcds-checkbox-invalid': invalid, 'bcds-checkbox-readonly': readonly }"
        :disabled
        :model-value="indeterminate ? 'indeterminate' : (value ?? false)"
        :name
        :required
        @update:model-value="update"
      >
        <CheckboxIndicator class="flex">
          <font-awesome-icon :icon="indeterminate ? 'fa-solid fa-minus' : 'fa-solid fa-check'" />
        </CheckboxIndicator>
      </CheckboxRoot>
      <label
        v-if="label"
        class="bcds-checkbox-label"
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

<style scoped>
@layer components {
  .bcds-checkbox-label {
    margin-bottom: 0;
    padding-left: 10px;
    color: var(--typography-color-secondary);
    font: var(--typography-regular-small-body);
  }

  .bcds-checkbox-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-sizing: content-box;
    width: var(--icons-size-small);
    height: var(--icons-size-small);
    padding: 0;
    border: var(--layout-border-width-small) solid var(--surface-color-border-medium);
    border-radius: var(--layout-border-radius-small);
    background: var(--surface-color-secondary-default);
    color: var(--icons-color-primary-invert);
    font-size: 0.75rem;
    cursor: pointer;
  }

  .bcds-checkbox-box:hover {
    border-color: var(--surface-color-border-dark);
  }

  .bcds-checkbox-box:focus-visible {
    outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  .bcds-checkbox-box[data-state='checked'],
  .bcds-checkbox-box[data-state='indeterminate'] {
    border-color: var(--surface-color-primary-default);
    background: var(--surface-color-primary-default);
  }

  .bcds-checkbox-box[data-state='checked']:hover {
    border-color: var(--surface-color-primary-hover);
    background: var(--surface-color-primary-hover);
  }

  .bcds-checkbox-box.bcds-checkbox-invalid {
    border-color: var(--support-border-color-danger);
  }

  .bcds-checkbox-box.bcds-checkbox-invalid[data-state='checked'],
  .bcds-checkbox-box.bcds-checkbox-invalid[data-state='indeterminate'] {
    background: var(--surface-color-primary-danger-button-default);
  }

  .bcds-checkbox-box.bcds-checkbox-readonly {
    cursor: not-allowed;
  }

  .bcds-checkbox-box[data-disabled] {
    border-color: var(--surface-color-border-medium);
    background: var(--surface-color-primary-disabled);
    color: var(--icons-color-disabled);
    cursor: not-allowed;
  }
}
</style>
