<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue';
import { useI18n } from 'vue-i18n';

// The field passes its attributes on with v-bind="$attrs": class and style stay on this wrapper, and the rest go to
// the control through inputAttrs, so PrimeVue's own props can't be set from outside
defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  errorMessage = undefined,
  label = undefined,
  nonLabelable = false,
  required = false
} = defineProps<{
  // Several lines show one per row, as one description
  description?: string | string[];
  errorMessage?: string;
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
  }): unknown;
}>();

// Composables
const { t } = useI18n();

// State
const attrs = useAttrs();
const id = useId();
const ids = { description: `${id}-description`, error: `${id}-error`, label: `${id}-label` };
const descriptionLines = computed(() => [description ?? []].flat().filter(Boolean));

// Only rendered ids, so nothing points at a missing element
const aria = computed(() => ({
  'aria-describedby':
    [descriptionLines.value.length && ids.description, errorMessage && ids.error].filter(Boolean).join(' ') ||
    undefined,
  'aria-required': required || undefined
}));

// Actions
function inputAttrs() {
  const rest = Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style');

  return { ...Object.fromEntries(rest), ...aria.value };
}
</script>

<template>
  <!-- The label, description and error every field shares, linked to the control through the slot -->
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
        {{ t('components.fieldWrapper.required') }}
      </span>
    </label>
    <slot
      v-bind="{
        id,
        inputAttrs: inputAttrs(),
        invalid: !!errorMessage,
        labelId: label ? ids.label : undefined
      }"
    />
    <!-- One text with line breaks, so screen readers still hear a space between lines -->
    <small
      v-if="descriptionLines.length"
      :id="ids.description"
      class="app-description block whitespace-pre-line"
    >
      {{ descriptionLines.join('\n') }}
    </small>
    <div
      v-if="errorMessage"
      :id="ids.error"
      class="app-error-message mt-2"
    >
      <font-awesome-icon icon="fa-solid fa-circle-exclamation" />
      {{ errorMessage }}
    </div>
  </div>
</template>
