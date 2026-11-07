<script setup lang="ts">
import {
  injectTooltipProviderContext,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger
} from 'reka-ui';

import type { FunctionalComponent } from 'vue';

// Props
const {
  delay = undefined,
  isDisabled = false,
  offset = 10,
  placement = 'top',
  text
} = defineProps<{
  // Milliseconds of hover before it opens; App.vue's provider sets the default
  delay?: number;
  isDisabled?: boolean;
  // Pixels between the trigger and the tooltip, arrow included
  offset?: number;
  placement?: 'bottom' | 'left' | 'right' | 'top';
  text: string;
}>();

// The slot is the element the tooltip describes, such as a Button
defineSlots<{ default(): unknown }>();

// State
// App.vue's provider lets neighbouring tooltips skip the open delay; without one, such as in a spec, it brings its own
const Passthrough: FunctionalComponent = (_, { slots }) => slots.default?.();
const provider = injectTooltipProviderContext(null) ? Passthrough : TooltipProvider;
</script>

<template>
  <component :is="provider">
    <TooltipRoot
      :delay-duration="delay"
      :disabled="isDisabled"
    >
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          class="bcds-tooltip"
          :side="placement"
          :side-offset="offset"
        >
          {{ text }}
          <TooltipArrow
            class="bcds-tooltip-arrow"
            :height="9"
            :width="19"
          />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </component>
</template>

<!-- Reka renders the tooltip inside its own wrapper, which a scoped style can't reach -->
<style>
.bcds-tooltip {
  z-index: 1100;
  padding: var(--layout-padding-xsmall) var(--layout-padding-small);
  border-radius: var(--layout-border-radius-medium);
  background: var(--theme-gray-110);
  box-shadow: var(--surface-shadow-small);
  color: var(--typography-color-primary-invert);
  font: var(--typography-regular-small-body);
}

.bcds-tooltip-arrow {
  fill: var(--theme-gray-110);
}
</style>
