<script setup lang="ts">
import { Time } from '@internationalized/date';
import { TimeFieldInput, TimeFieldRoot } from 'reka-ui';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import FieldWrapper from './FieldWrapper.vue';

import type { TimeValue } from 'reka-ui';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  granularity = 'minute',
  hourCycle = undefined,
  label = undefined,
  maxValue = undefined,
  minValue = undefined,
  name = undefined,
  readonly = false,
  required = false,
  size = 'medium'
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // The smallest unit typed
  granularity?: 'hour' | 'minute' | 'second';
  // 12 or 24 hour time; without it, the locale decides.
  hourCycle?: 12 | 24;
  label?: string;
  // 24 hour HH:mm or HH:mm:ss, like the value
  maxValue?: string;
  minValue?: string;
  name?: string;
  readonly?: boolean;
  required?: boolean;
  size?: 'medium' | 'small';
}>();

// Emits
// The segments are separate inputs, so blur is when focus leaves them all.
const emit = defineEmits<{ blur: [event: FocusEvent] }>();

// 24 hour HH:mm, or HH:mm:ss at second granularity, as a native time input gives
const value = defineModel<string | null>();

// Composables
const { locale } = useI18n();

// State
const timeValue = computed<TimeValue | null>({
  get: () => (value.value ? toTime(value.value) : null),
  set: (time) => (value.value = time ? fromTime(time) : null)
});

// Actions
function fromTime(time: TimeValue) {
  const parts = [time.hour, time.minute, ...(granularity === 'second' ? [time.second] : [])];
  return parts.map((part) => String(part).padStart(2, '0')).join(':');
}

function onFocusOut(event: FocusEvent) {
  const field = event.currentTarget as HTMLElement;
  if (!field.contains(event.relatedTarget as Node | null)) emit('blur', event);
}

function toTime(text: string) {
  const [hour = 0, minute = 0, second = 0] = text.split(':').map(Number);
  return new Time(hour, minute, second);
}
</script>

<template>
  <!-- The time is typed as separate segments, so the field is named with aria-labelledby. -->
  <FieldWrapper
    v-slot="{ inputAttrs, invalid, labelId }"
    v-bind="$attrs"
    :description
    :error-message
    :label
    non-labelable
    :required
  >
    <TimeFieldRoot
      v-slot="{ segments }"
      v-model="timeValue"
      v-bind="inputAttrs"
      :aria-invalid="invalid || undefined"
      :aria-labelledby="labelId"
      class="app-input"
      :class="{ 'app-input-small': size === 'small', 'app-input-invalid': invalid, 'app-input-readonly': readonly }"
      :disabled
      :granularity
      :hour-cycle
      :locale
      :max-value="maxValue ? toTime(maxValue) : undefined"
      :min-value="minValue ? toTime(minValue) : undefined"
      :name
      :readonly
      :required
      @focusout="onFocusOut"
    >
      <div class="flex grow items-center">
        <template
          v-for="item in segments"
          :key="item.part"
        >
          <TimeFieldInput
            v-if="item.part === 'literal'"
            :part="item.part"
          >
            {{ item.value }}
          </TimeFieldInput>
          <TimeFieldInput
            v-else
            class="bcds-time-field-segment"
            :part="item.part"
          >
            {{ item.value }}
          </TimeFieldInput>
        </template>
      </div>
      <font-awesome-icon
        v-if="invalid"
        class="text-[var(--icons-color-danger)]"
        icon="fa-solid fa-triangle-exclamation"
      />
    </TimeFieldRoot>
  </FieldWrapper>
</template>

<style scoped>
@layer components {
  .app-input.app-input-small {
    padding: var(--layout-padding-hair) var(--layout-padding-small);
  }

  .bcds-time-field-segment {
    padding: 0 var(--layout-padding-hair);
    outline: none;
  }

  .bcds-time-field-segment:focus {
    border-radius: var(--layout-border-radius-small);
    padding: var(--layout-padding-hair);
    background: var(--surface-color-primary-default);
    color: var(--typography-color-primary-invert);
  }

  .bcds-time-field-segment[data-placeholder] {
    color: var(--typography-color-placeholder);
  }

  .app-input-readonly .bcds-time-field-segment:focus {
    background: var(--surface-color-forms-disabled);
    color: var(--typography-color-primary);
  }
}
</style>
