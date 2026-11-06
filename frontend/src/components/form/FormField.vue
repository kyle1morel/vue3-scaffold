<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';
import { useI18n } from 'vue-i18n';

// class and style stay on the wrapper; the field's other attributes go to its control through the slot
defineOptions({ inheritAttrs: false });

// Props
const {
  error = undefined,
  helpText = undefined,
  label = undefined,
  nonLabelable = false,
  required = false
} = defineProps<{
  error?: string;
  // Several lines show one per row, as one description
  helpText?: string | string[];
  label?: string;
  // The control isn't an input a label can point at, so it's named with aria-labelledby instead
  nonLabelable?: boolean;
  required?: boolean;
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

// Composables
const { t } = useI18n();

// State
const attrs = useAttrs();
const id = useId();
const ids = { error: `${id}-error`, help: `${id}-help`, label: `${id}-label` };
const helpLines = computed(() => [helpText ?? []].flat().filter(Boolean));

// Only rendered ids, so nothing points at a missing element
const aria = computed(() => ({
  'aria-describedby': [helpLines.value.length && ids.help, error && ids.error].filter(Boolean).join(' ') || undefined,
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
      class="app-field-label"
      :for="nonLabelable ? undefined : id"
    >
      {{ label }}
      <span
        v-if="required"
        class="app-field-required"
      >
        {{ t('components.formField.required') }}
      </span>
    </label>
    <slot
      v-bind="{
        ...splitAttrs(),
        id,
        invalid: !!error,
        labelId: label ? ids.label : undefined
      }"
    />
    <!-- One text with line breaks, so screen readers still hear a space between lines -->
    <small
      v-if="helpLines.length"
      :id="ids.help"
      class="app-help-text block whitespace-pre-line"
    >
      {{ helpLines.join('\n') }}
    </small>
    <div
      v-if="error"
      :id="ids.error"
      class="app-error-message mt-2"
    >
      <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
      {{ error }}
    </div>
  </div>
</template>
