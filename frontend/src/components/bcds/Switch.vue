<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui';
import { useI18n } from 'vue-i18n';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  labelPosition = 'right',
  name = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  labelPosition?: 'left' | 'right';
  name?: string;
  readonly?: boolean;
  required?: boolean;
}>();

const value = defineModel<boolean>();

// Composables
const { t } = useI18n();

// Actions
// Reka has no read-only state, so a read-only switch ignores the change.
function update(checked: boolean) {
  if (!readonly) value.value = checked;
}
</script>

<template>
  <!-- The label sits beside the switch, so the wrapper only adds the description and error. -->
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    class="bcds-switch"
    :description
    error-icon
    :error-message
    :required
  >
    <div
      class="bcds-switch-button"
      :class="{ 'bcds-switch-disabled': disabled, 'bcds-switch-readonly': readonly }"
    >
      <SwitchRoot
        :id
        v-bind="inputAttrs"
        :aria-invalid="invalid || undefined"
        :aria-readonly="readonly || undefined"
        class="bcds-switch-track"
        :class="{ 'bcds-switch-invalid': invalid }"
        :disabled
        :model-value="value ?? false"
        :name
        :required
        @update:model-value="update"
      >
        <SwitchThumb class="bcds-switch-handle" />
      </SwitchRoot>
      <label
        v-if="label"
        class="bcds-switch-label"
        :class="{ 'bcds-switch-label-left': labelPosition === 'left' }"
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
  .bcds-switch {
    color: var(--typography-color-secondary);
    font: var(--typography-regular-small-body);
    forced-color-adjust: none;
  }

  .bcds-switch-button {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: var(--layout-margin-small);
    cursor: pointer;
  }

  .bcds-switch-label {
    margin: 0;
    cursor: inherit;
  }

  .bcds-switch-label-left {
    order: -1;
  }

  .bcds-switch-track {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: var(--layout-margin-xxlarge);
    height: var(--icons-size-medium);
    padding: 0;
    border: none;
    border-radius: var(--icons-size-medium);
    background-color: var(--surface-color-primary-disabled);
    cursor: inherit;
    transition: background-color 200ms;
  }

  .bcds-switch-handle {
    display: block;
    box-sizing: border-box;
    width: var(--icons-size-medium);
    height: var(--icons-size-medium);
    border: var(--layout-border-width-medium) solid var(--surface-color-border-medium);
    border-radius: var(--icons-size-small);
    background-color: var(--surface-color-secondary-default);
    transition-property: background-color, border-color, transform;
    transition-duration: 200ms;
  }

  @media (prefers-reduced-motion) {
    .bcds-switch-track,
    .bcds-switch-handle {
      transition: none;
    }
  }

  .bcds-switch-button:not(.bcds-switch-disabled):hover .bcds-switch-handle {
    border-color: var(--surface-color-border-dark);
  }

  .bcds-switch-track:focus-visible {
    outline: solid var(--layout-border-width-medium) var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  .bcds-switch-track[data-state='checked'] {
    background-color: var(--surface-color-primary-default);
  }

  .bcds-switch-track[data-state='checked'] .bcds-switch-handle {
    border-color: var(--surface-color-primary-default);
    transform: translateX(100%);
  }

  .bcds-switch-button:not(.bcds-switch-disabled):hover .bcds-switch-track[data-state='checked'] {
    background-color: var(--surface-color-primary-hover);
  }

  .bcds-switch-button:not(.bcds-switch-disabled):hover .bcds-switch-track[data-state='checked'] .bcds-switch-handle {
    border-color: var(--surface-color-primary-hover);
  }

  /* Red like an invalid checkbox: the handle's border, and the track once switched on */
  .bcds-switch-track.bcds-switch-invalid .bcds-switch-handle,
  .bcds-switch-button:not(.bcds-switch-disabled):hover .bcds-switch-track.bcds-switch-invalid .bcds-switch-handle {
    border-color: var(--support-border-color-danger);
  }

  .bcds-switch-track.bcds-switch-invalid[data-state='checked'],
  .bcds-switch-button:not(.bcds-switch-disabled):hover .bcds-switch-track.bcds-switch-invalid[data-state='checked'] {
    background-color: var(--surface-color-primary-danger-button-default);
  }

  .bcds-switch-readonly {
    cursor: not-allowed;
  }

  .bcds-switch-disabled {
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }

  .bcds-switch-disabled .bcds-switch-track {
    background-color: var(--surface-color-primary-disabled);
  }

  .bcds-switch-disabled .bcds-switch-handle {
    border-color: var(--surface-color-border-default);
    background-color: var(--theme-gray-10);
  }
}
</style>
