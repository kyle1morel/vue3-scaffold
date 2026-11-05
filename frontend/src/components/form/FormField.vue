<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';

import Tooltip from '@/components/common/Tooltip.vue';

// class and style stay on the wrapper; the field's other attributes go to its control through the slot
defineOptions({ inheritAttrs: false });

// Props
const {
  error = undefined,
  helpText = undefined,
  label = undefined,
  nonLabelable = false,
  required = false,
  tooltip = undefined
} = defineProps<{
  error?: string;
  helpText?: string;
  label?: string;
  // The control isn't an input a label can point at, so it's named with aria-labelledby instead
  nonLabelable?: boolean;
  required?: boolean;
  tooltip?: string;
}>();

defineSlots<{
  default(props: {
    id: string;
    inputAttrs: Record<string, unknown>;
    invalid: boolean;
    labelId: string | undefined;
    listeners: Record<string, unknown>;
  }): unknown;
}>();

// State
const attrs = useAttrs();
const id = useId();
const ids = { error: `${id}-error`, help: `${id}-help`, label: `${id}-label`, tooltip: `${id}-tooltip` };

// Only rendered ids, so nothing points at a missing element
const aria = computed(() => ({
  'aria-describedby':
    [tooltip && ids.tooltip, helpText && ids.help, error && ids.error].filter(Boolean).join(' ') || undefined,
  'aria-required': required || undefined
}));

// Actions
// Listeners stay on the PrimeVue component so its emits still fire; other attributes belong on the input
function splitAttrs() {
  const listeners: Record<string, unknown> = {};
  const inputAttrs: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class' || key === 'style') continue;
    if (/^on[A-Z]/.test(key)) listeners[key] = value;
    else inputAttrs[key] = value;
  }

  return { inputAttrs: { ...inputAttrs, ...aria.value }, listeners };
}
</script>

<template>
  <div
    :class="$attrs.class"
    :style="$attrs.style"
  >
    <label
      v-if="label"
      :id="ids.label"
      class="font-bold"
      :for="nonLabelable ? undefined : id"
    >
      {{ label }}
      <span
        v-if="required"
        aria-hidden="true"
        class="text-[var(--p-support-required-text)]"
      >
        *
      </span>
    </label>
    <Tooltip
      v-if="tooltip"
      :id="ids.tooltip"
      class="pl-2 mb-2"
      icon="fa-solid fa-circle-question"
      :text="tooltip"
    />
    <slot
      v-bind="{
        ...splitAttrs(),
        id,
        invalid: !!error,
        labelId: label ? ids.label : undefined
      }"
    />
    <small
      v-if="helpText"
      :id="ids.help"
    >
      {{ helpText }}
    </small>
    <div
      v-if="error"
      :id="ids.error"
      class="app-error-message mt-2"
    >
      {{ error }}
    </div>
  </div>
</template>
