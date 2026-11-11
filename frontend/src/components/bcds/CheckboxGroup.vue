<script setup lang="ts">
import { computed } from 'vue';

import Checkbox from './Checkbox.vue';
import FieldWrapper from './FieldWrapper.vue';

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
  // A plain string is both the label and the value.
  options: readonly ({ description?: string; label: string | number; value: string | number } | string)[];
  orientation?: 'horizontal' | 'vertical';
  readonly?: boolean;
  required?: boolean;
}>();

const value = defineModel<(string | number)[]>({ default: () => [] });

// State
const checkboxOptions = computed(() =>
  options.map((option) =>
    typeof option === 'string' ? { description: undefined, label: option, value: option } : option
  )
);

// Actions
function toggle(option: string | number, checked: boolean | undefined) {
  value.value = checked ? [...value.value, option] : value.value.filter((selected) => selected !== option);
}
</script>

<template>
  <!-- A group can't take aria-required, so the label's "(required)" carries it. -->
  <FieldWrapper
    v-slot="{ inputAttrs, invalid, labelId }"
    v-bind="$attrs"
    :description
    error-icon
    :error-message
    :label
    non-labelable
    :required
  >
    <div
      v-bind="{ ...inputAttrs, 'aria-required': undefined }"
      :aria-labelledby="labelId"
      class="bcds-checkbox-group-options"
      :class="`bcds-checkbox-group-${orientation}`"
      role="group"
      :style="{ flexWrap: orientation === 'horizontal' ? flexWrap : undefined }"
    >
      <Checkbox
        v-for="option in checkboxOptions"
        :key="option.value"
        :description="option.description"
        :disabled
        :invalid
        :label="String(option.label)"
        :model-value="value.includes(option.value)"
        :name
        :readonly
        @update:model-value="toggle(option.value, $event)"
      />
    </div>
  </FieldWrapper>
</template>

<style scoped>
@layer components {
  .bcds-checkbox-group-options {
    display: flex;
  }

  .bcds-checkbox-group-vertical {
    flex-direction: column;
    gap: var(--layout-margin-small);
  }

  .bcds-checkbox-group-horizontal {
    flex-direction: row;
    gap: var(--layout-margin-medium);
  }
}
</style>
