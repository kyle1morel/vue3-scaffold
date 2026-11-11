<script setup lang="ts">
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
  injectAccordionRootContext
} from 'reka-ui';
import { computed, useId } from 'vue';

// Props
const {
  disabled = false,
  label = undefined,
  value = undefined
} = defineProps<{
  disabled?: boolean;
  label?: string;
  // Identifies the accordion in an AccordionGroup's expanded list
  value?: string;
}>();

const open = defineModel<boolean>('open', { default: false });

defineSlots<{ default(): unknown }>();

// State
// In a group, the group keeps which accordions are expanded.
const group = injectAccordionRootContext(null);
const id = useId();

const parts = computed(() =>
  group
    ? { content: AccordionContent, root: AccordionItem, trigger: AccordionTrigger }
    : { content: CollapsibleContent, root: CollapsibleRoot, trigger: CollapsibleTrigger }
);
const rootProps = computed(() =>
  group ? { value: value ?? id } : { open: open.value, 'onUpdate:open': (expanded: boolean) => (open.value = expanded) }
);
</script>

<template>
  <component
    :is="parts.root"
    v-slot="{ open: expanded }"
    v-bind="rootProps"
    class="bcds-accordion"
    :disabled
  >
    <component
      :is="parts.trigger"
      class="bcds-accordion-button"
    >
      {{ label }}
      <font-awesome-icon :icon="expanded ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" />
    </component>
    <component
      :is="parts.content"
      class="bcds-accordion-panel"
    >
      <slot />
    </component>
  </component>
</template>

<style scoped>
@layer components {
  .bcds-accordion {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: var(--layout-border-width-small) solid var(--surface-color-border-default);
    border-radius: var(--layout-border-radius-medium);
  }

  .bcds-accordion-button {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--layout-margin-small);
    padding: var(--layout-padding-small) var(--layout-padding-medium);
    border: none;
    background-color: var(--surface-color-background-light-gray);
    color: var(--typography-color-primary);
    font: var(--typography-bold-body);
    text-align: left;
    cursor: pointer;
  }

  .bcds-accordion-button:focus-visible {
    outline: none;
  }

  .bcds-accordion:not([data-disabled]) > .bcds-accordion-button:hover {
    background-color: var(--surface-color-menus-hover);
  }

  .bcds-accordion-panel {
    display: flex;
    align-items: flex-start;
    gap: var(--layout-margin-small);
    padding: var(--layout-padding-medium);
    background-color: var(--surface-color-forms-default);
    font: var(--typography-regular-body);
  }

  /* The whole accordion shows focus, not just its button */
  .bcds-accordion:has(> .bcds-accordion-button:focus-visible) {
    outline: solid var(--layout-border-width-medium) var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  .bcds-accordion[data-disabled] > .bcds-accordion-button {
    background-color: var(--surface-color-forms-disabled);
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }
}
</style>
