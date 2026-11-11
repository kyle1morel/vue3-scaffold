<script setup lang="ts">
import { AccordionRoot } from 'reka-ui';
import { computed } from 'vue';

// The title sits above the group, so attributes go to the group.
defineOptions({ inheritAttrs: false });

// Props
const {
  disabled = false,
  multiple = false,
  title = undefined,
  titleElement = 'span'
} = defineProps<{
  disabled?: boolean;
  // Lets more than one accordion be expanded at a time
  multiple?: boolean;
  title?: string;
  titleElement?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
}>();

// The values of the expanded accordions
const expanded = defineModel<string[]>({ default: () => [] });

defineSlots<{ default(): unknown }>();

// State
// Reka takes one value when one accordion can be open, and a list when several can.
const modelValue = computed(() => (multiple ? expanded.value : expanded.value[0]));

// Actions
function update(value: string | string[] | undefined) {
  expanded.value = [value ?? []].flat();
}
</script>

<template>
  <div
    v-if="title"
    class="bcds-accordion-group-title"
  >
    <component :is="titleElement">{{ title }}</component>
  </div>
  <AccordionRoot
    v-bind="$attrs"
    class="bcds-accordion-group"
    collapsible
    :disabled
    :model-value
    :type="multiple ? 'multiple' : 'single'"
    @update:model-value="update"
  >
    <slot />
  </AccordionRoot>
</template>

<style scoped>
@layer components {
  .bcds-accordion-group {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--layout-border-width-small);
    overflow: hidden;
    border: var(--layout-border-width-small) solid var(--surface-color-border-default);
    border-radius: var(--layout-border-radius-medium);
    background-color: var(--surface-color-border-default);
  }

  /* The group draws the borders, as the lines between its accordions */
  .bcds-accordion-group > :deep(.bcds-accordion) {
    border: none;
    border-radius: var(--layout-border-radius-none);
  }

  .bcds-accordion-group > :deep(.bcds-accordion:has(> .bcds-accordion-button:focus-visible)) {
    border-radius: var(--layout-border-radius-hair);
    outline-offset: calc(var(--layout-margin-hair) * -1);
  }

  .bcds-accordion-group-title {
    margin: var(--layout-margin-medium) var(--layout-margin-none);
    color: var(--typography-color-primary);
  }

  .bcds-accordion-group-title > * {
    margin-block: 0;
  }

  .bcds-accordion-group-title > h1 {
    font: var(--typography-bold-h1);
  }

  .bcds-accordion-group-title > h2 {
    font: var(--typography-bold-h2);
  }

  .bcds-accordion-group-title > h3 {
    font: var(--typography-bold-h3);
  }

  .bcds-accordion-group-title > h4 {
    font: var(--typography-bold-h4);
  }

  .bcds-accordion-group-title > h5 {
    font: var(--typography-bold-h5);
  }

  .bcds-accordion-group-title > h6 {
    font: var(--typography-bold-h6);
  }

  .bcds-accordion-group-title > span {
    font: var(--typography-bold-large-body);
  }
}
</style>
