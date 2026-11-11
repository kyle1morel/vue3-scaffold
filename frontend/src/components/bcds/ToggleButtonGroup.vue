<script setup lang="ts">
import { ToggleGroupRoot } from 'reka-ui';
import { useId } from 'vue';

import type { AcceptableValue } from 'reka-ui';

// The label sits beside the group, so attributes go to the group.
defineOptions({ inheritAttrs: false });

// Props
const {
  disabled = false,
  disallowEmptySelection = false,
  label = undefined,
  orientation = 'horizontal',
  selectionMode = 'single',
  size = 'medium'
} = defineProps<{
  disabled?: boolean;
  // Stops the last selected button being turned off
  disallowEmptySelection?: boolean;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  selectionMode?: 'multiple' | 'single';
  size?: 'medium' | 'small';
}>();

// A single selection is one value, a multiple selection is a list of them.
const value = defineModel<string | string[] | undefined>();

defineSlots<{ default(): unknown }>();

// State
const labelId = useId();

// Actions
function update(selected: AcceptableValue | AcceptableValue[]) {
  const next = selected as string | string[] | undefined;
  const empty = Array.isArray(next) ? !next.length : !next;
  if (!(disallowEmptySelection && empty)) value.value = next;
}
</script>

<template>
  <span
    v-if="label"
    :id="labelId"
    class="bcds-toggle-button-group-label"
  >
    {{ label }}
  </span>
  <ToggleGroupRoot
    v-bind="$attrs"
    :aria-labelledby="label ? labelId : undefined"
    class="bcds-toggle-button-group"
    :class="`bcds-toggle-button-group-${size}`"
    :data-orientation="orientation"
    :disabled
    :model-value="value"
    :orientation
    :type="selectionMode"
    @update:model-value="update"
  >
    <slot />
  </ToggleGroupRoot>
</template>

<style scoped>
@layer components {
  .bcds-toggle-button-group {
    display: flex;
    flex: 1 1 auto;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--layout-margin-small);
    box-sizing: border-box;
    padding: var(--layout-padding-xsmall);
    border-radius: var(--layout-border-radius-medium);
    background-color: var(--surface-color-secondary-button-disabled);
  }

  .bcds-toggle-button-group[data-orientation='horizontal'] {
    flex-direction: row;
    min-height: var(--layout-margin-xlarge);
  }

  .bcds-toggle-button-group[data-orientation='vertical'] {
    flex-direction: column;
  }

  /* The group's size wins over each button's own. */
  .bcds-toggle-button-group-small :deep(.bcds-toggle-button) {
    font: var(--typography-regular-small-body);
  }

  .bcds-toggle-button-group-medium :deep(.bcds-toggle-button) {
    font: var(--typography-regular-body);
  }

  .bcds-toggle-button-group-label {
    display: flex;
    padding: var(--layout-padding-small) var(--layout-padding-none);
    color: var(--typography-color-secondary);
    font: var(--typography-regular-small-body);
  }
}
</style>
