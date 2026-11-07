<script setup lang="ts">
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui';
import { computed } from 'vue';

import FieldWrapper from './FieldWrapper.vue';

import type { AcceptableValue } from 'reka-ui';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  flexWrap = 'nowrap',
  label = undefined,
  name = undefined,
  options,
  orientation = 'vertical',
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // Whether horizontal options wrap onto more lines
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  label?: string;
  name?: string;
  // A plain string is both the label and the value
  options: readonly ({ description?: string; label: string | number; value: string | number } | string)[];
  orientation?: 'horizontal' | 'vertical';
  readonly?: boolean;
  required?: boolean;
}>();

// Emits
// Blur doesn't bubble to the group, so each radio reports its own
const emit = defineEmits<{ blur: [event: Event] }>();

const value = defineModel<string | number>();

// State
const radioOptions = computed(() =>
  options.map((option) =>
    typeof option === 'string' ? { description: undefined, label: option, value: option } : option
  )
);

// Actions
// Reka has no read-only state, so a read-only group ignores the change
function update(selected: AcceptableValue) {
  if (!readonly) value.value = selected as string | number;
}
</script>

<template>
  <!-- The radiogroup role takes aria-required and the label names it, so the group gets the field's attributes -->
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid, labelId }"
    v-bind="$attrs"
    :description
    error-icon
    :error-message
    :label
    non-labelable
    :required
  >
    <RadioGroupRoot
      v-bind="inputAttrs"
      :aria-labelledby="labelId"
      :aria-readonly="readonly || undefined"
      class="options"
      :class="orientation"
      :disabled
      :model-value="value ?? null"
      :name
      :orientation
      :required
      :style="{ flexWrap: orientation === 'horizontal' ? flexWrap : undefined }"
      @update:model-value="update"
    >
      <div
        v-for="(option, index) in radioOptions"
        :key="option.value"
        class="flex flex-col gap-1"
      >
        <div class="flex items-center">
          <RadioGroupItem
            :id="`${id}-${index}`"
            :aria-describedby="option.description ? `${id}-${index}-description` : undefined"
            class="radio"
            :class="{ invalid, readonly }"
            :value="option.value"
            @blur="(e: Event) => emit('blur', e)"
          />
          <label
            class="label"
            :class="{ 'cursor-not-allowed': readonly }"
            :for="`${id}-${index}`"
          >
            {{ option.label }}
          </label>
        </div>
        <span
          v-if="option.description"
          :id="`${id}-${index}-description`"
          class="description"
        >
          {{ option.description }}
        </span>
      </div>
    </RadioGroupRoot>
  </FieldWrapper>
</template>

<style scoped>
.options {
  display: flex;
}

.vertical {
  flex-direction: column;
  gap: var(--layout-margin-small);
}

.horizontal {
  flex-direction: row;
  gap: var(--layout-margin-medium);
}

/* Lines up under the label, past the radio and its gap */
.description {
  margin-left: calc(var(--icons-size-xsmall) + var(--layout-margin-small));
  color: var(--typography-color-secondary);
  font: var(--typography-regular-label);
}

.label {
  margin: 0 0 0 var(--layout-margin-small);
  color: var(--typography-color-secondary);
  font: var(--typography-regular-small-body);
}

.radio {
  flex-shrink: 0;
  box-sizing: border-box;
  width: var(--icons-size-xsmall);
  height: var(--icons-size-xsmall);
  border: var(--layout-border-width-small) solid var(--surface-color-border-medium);
  border-radius: var(--layout-border-radius-circular);
  background: var(--surface-color-secondary-default);
  cursor: pointer;
  transition: border 200ms;
}

@media (prefers-reduced-motion) {
  .radio {
    transition: none;
  }
}

.radio:hover {
  border-color: var(--surface-color-border-dark);
}

.radio:focus-visible {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}

.radio[data-state='checked'] {
  border: 5px solid var(--surface-color-primary-default);
}

.radio.invalid {
  border-color: var(--support-border-color-danger);
}

.radio.readonly {
  cursor: not-allowed;
}

.radio[data-disabled] {
  cursor: not-allowed;
}

.radio[data-disabled][data-state='checked'] {
  border-color: var(--surface-color-border-default);
}
</style>
