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
import { onBeforeUnmount, ref } from 'vue';

import type { FunctionalComponent } from 'vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  closeDelay = 500,
  delay = undefined,
  isDisabled = false,
  offset = 10,
  placement = 'top',
  text
} = defineProps<{
  // Milliseconds it stays after the pointer or focus leaves
  closeDelay?: number;
  // Milliseconds of hover before it opens; App.vue's provider sets the default.
  delay?: number;
  isDisabled?: boolean;
  // Pixels between the trigger and the tooltip, arrow included
  offset?: number;
  placement?: 'bottom' | 'left' | 'right' | 'top';
  text: string;
}>();

// The slot is the element the tooltip describes, such as a Button.
defineSlots<{ default(): unknown }>();

// State
// App.vue's provider lets neighbouring tooltips skip the open delay; without one, such as in a spec, it brings its own.
const Passthrough: FunctionalComponent = (_, { slots }) => slots.default?.();
const provider = injectTooltipProviderContext(null) ? Passthrough : TooltipProvider;

// Reka closes straight away, so the close is held back here.
const open = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | undefined;

onBeforeUnmount(() => clearTimeout(closeTimer));

// Actions
function onOpenChange(value: boolean) {
  clearTimeout(closeTimer);
  if (value || !closeDelay) open.value = value;
  else closeTimer = setTimeout(() => (open.value = false), closeDelay);
}

// Esc still closes at once, so the tooltip can always be dismissed.
function closeNow() {
  clearTimeout(closeTimer);
  open.value = false;
}
</script>

<template>
  <component :is="provider">
    <TooltipRoot
      :delay-duration="delay"
      :disabled="isDisabled"
      :open
      @update:open="onOpenChange"
    >
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          v-bind="$attrs"
          class="bcds-tooltip"
          :side="placement"
          :side-offset="offset"
          @escape-key-down="closeNow"
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

<!-- Reka renders the tooltip inside its own wrapper, which a scoped style can't reach. -->
<style>
@layer components {
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
}
</style>
