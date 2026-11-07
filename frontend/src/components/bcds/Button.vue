<script setup lang="ts">
import PrimeButton from 'primevue/button';
import { computed, useAttrs, useSlots } from 'vue';

import type { RouteLocationRaw } from 'vue-router';

// Attributes and listeners go on the button element, so PrimeVue's own props can't be set from outside
defineOptions({ inheritAttrs: false });

// Props
const {
  danger = false,
  disabled = false,
  icon = undefined,
  iconOnly = false,
  label = undefined,
  to = undefined,
  type = 'button',
  variant = 'primary'
} = defineProps<{
  // For destructive actions, on any variant
  danger?: boolean;
  disabled?: boolean;
  // A FontAwesome icon, such as fa-solid fa-check
  icon?: string;
  // Shows only the icon, with the label as its accessible name
  iconOnly?: boolean;
  label?: string;
  // Renders a router link styled as a button
  to?: RouteLocationRaw;
  type?: 'button' | 'reset' | 'submit';
  variant?: 'link' | 'primary' | 'secondary' | 'tertiary';
}>();

defineSlots<{ default?(): unknown }>();

// State
const attrs = useAttrs();
const slots = useSlots();

// The theme styles PrimeVue's secondary severity as the BC secondary button, and its text style as tertiary
const appearance = computed(() => ({
  link: variant === 'link',
  outlined: danger && variant === 'secondary',
  severity: danger ? 'danger' : variant === 'secondary' ? 'secondary' : undefined,
  text: variant === 'tertiary'
}));

// Actions
// The label names the button when it isn't shown; the caller's own attributes win
function rootAttrs() {
  return {
    ...((iconOnly || slots.default) && label ? { 'aria-label': label } : {}),
    ...(to ? { to } : { type }),
    ...attrs
  };
}
</script>

<template>
  <PrimeButton
    :as="to ? 'router-link' : undefined"
    v-bind="appearance"
    :disabled
    :label="iconOnly ? undefined : label"
    :pt="{ root: rootAttrs() }"
  >
    <template
      v-if="icon"
      #icon="{ class: iconClass }"
    >
      <font-awesome-icon
        :class="iconClass"
        :icon
      />
    </template>
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </PrimeButton>
</template>
