<script setup lang="ts">
import { CalendarDate, CalendarDateTime, getLocalTimeZone } from '@internationalized/date';
import { DatePickerContent, DatePickerField, DatePickerInput, DatePickerRoot, DatePickerTrigger } from 'reka-ui';
import { computed, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from './Button.vue';
import Calendar, { CALENDAR_LOCALE } from './Calendar.vue';
import FieldWrapper from './FieldWrapper.vue';

import type { DateValue } from '@internationalized/date';

defineOptions({ inheritAttrs: false });

// Props
const {
  browserLocale = false,
  calendarDisabled = false,
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  firstDayOfWeek = undefined,
  granularity = 'day',
  hourCycle = undefined,
  label = undefined,
  maxValue = undefined,
  minValue = undefined,
  name = undefined,
  readonly = false,
  required = false,
  showFormatHelpText = true,
  size = 'medium',
  unavailableDate = undefined
} = defineProps<{
  // Orders the date segments as the browser's language does, instead of the app's
  browserLocale?: boolean;
  // Leaves out the calendar button, so the date can only be typed.
  calendarDisabled?: boolean;
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // The calendar's first column; without it, Reka starts the week on Sunday.
  firstDayOfWeek?: 'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed';
  // The smallest unit typed, so anything finer than day adds the time.
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  // 12 or 24 hour time; without it, the locale decides.
  hourCycle?: 12 | 24;
  label?: string;
  maxValue?: Date;
  minValue?: Date;
  name?: string;
  readonly?: boolean;
  required?: boolean;
  // Spells out the segment order under the field, such as year - month - day
  showFormatHelpText?: boolean;
  size?: 'medium' | 'small';
  // Dates that can't be chosen, such as weekends; the calendar strikes them through.
  unavailableDate?: (date: Date) => boolean;
}>();

// Emits
// The segments are separate inputs, so blur is when focus leaves them all.
const emit = defineEmits<{ blur: [event: FocusEvent] }>();

const value = defineModel<Date | null>();

// Composables
const { locale, t } = useI18n();

// State
// Reka works in calendar dates, which carry no time zone; the form keeps a local Date.
const dateValue = computed<DateValue | null>({
  get: () => (value.value ? toDateValue(value.value) : null),
  set: (date) => (value.value = date ? date.toDate(getLocalTimeZone()) : null)
});

const dateLocale = computed(() => (browserLocale ? navigator.language : locale.value));
provide(CALENDAR_LOCALE, dateLocale);
const maxDateValue = computed(() => (maxValue ? toDateValue(maxValue) : undefined));
const minDateValue = computed(() => (minValue ? toDateValue(minValue) : undefined));
const unavailable = computed(() =>
  unavailableDate ? (date: DateValue) => unavailableDate(date.toDate(getLocalTimeZone())) : undefined
);

// The calendar popup, closed once a day is picked
const open = ref(false);

// Built from the locale's own order and separators, such as year - month - day, hour : minute AM/PM
const formatHelpText = computed(() => {
  const words: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {
    day: t('components.datePicker.parts.day'),
    dayPeriod: t('components.datePicker.parts.dayPeriod'),
    hour: t('components.datePicker.parts.hour'),
    minute: t('components.datePicker.parts.minute'),
    month: t('components.datePicker.parts.month'),
    second: t('components.datePicker.parts.second'),
    year: t('components.datePicker.parts.year')
  };
  const parts = new Intl.DateTimeFormat(dateLocale.value, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(granularity !== 'day' ? { hour: 'numeric', hour12: hourCycle ? hourCycle === 12 : undefined } : {}),
    ...(granularity === 'minute' || granularity === 'second' ? { minute: '2-digit' } : {}),
    ...(granularity === 'second' ? { second: '2-digit' } : {})
  }).formatToParts();
  const format = parts
    .map(({ type, value: text }) => {
      if (type !== 'literal') return words[type] ?? '';
      const separator = text.trim();
      if (!separator) return ' ';
      return separator === ',' ? ', ' : ` ${separator} `;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
  return t('components.datePicker.format', { format });
});

const descriptionLines = computed(() =>
  [showFormatHelpText ? formatHelpText.value : '', description ?? ''].filter(Boolean)
);

// Actions
// Picking a day keeps the time already typed, when the field has one.
function onCalendarSelect(date: Date | null | undefined) {
  if (!date) return;
  if (granularity !== 'day' && value.value) {
    date.setHours(value.value.getHours(), value.value.getMinutes(), value.value.getSeconds());
  }
  value.value = date;
  open.value = false;
}

function onFocusOut(event: FocusEvent) {
  const field = event.currentTarget as HTMLElement;
  if (!field.contains(event.relatedTarget as Node | null)) emit('blur', event);
}

function toDateValue(date: Date) {
  const day = [date.getFullYear(), date.getMonth() + 1, date.getDate()] as const;
  return granularity === 'day'
    ? new CalendarDate(...day)
    : new CalendarDateTime(...day, date.getHours(), date.getMinutes(), date.getSeconds());
}
</script>

<template>
  <!-- The date is typed as separate segments, so the field is named with aria-labelledby. -->
  <FieldWrapper
    v-slot="{ inputAttrs, invalid, labelId }"
    v-bind="$attrs"
    :description="descriptionLines"
    :error-message
    :label
    non-labelable
    :required
  >
    <DatePickerRoot
      v-model="dateValue"
      v-model:open="open"
      :disabled
      :granularity
      :hour-cycle
      :is-date-unavailable="unavailable"
      :locale="dateLocale"
      :max-value="maxDateValue"
      :min-value="minDateValue"
      :name
      :readonly
      :required
    >
      <DatePickerField
        v-slot="{ segments }"
        v-bind="inputAttrs"
        :aria-invalid="invalid || undefined"
        :aria-labelledby="labelId"
        class="app-input"
        :class="{ 'app-input-small': size === 'small', 'app-input-invalid': invalid, 'app-input-readonly': readonly }"
        @focusout="onFocusOut"
      >
        <div class="flex grow items-center">
          <template
            v-for="item in segments"
            :key="item.part"
          >
            <DatePickerInput
              v-if="item.part === 'literal'"
              :part="item.part"
            >
              {{ item.value }}
            </DatePickerInput>
            <DatePickerInput
              v-else
              class="bcds-date-picker-segment"
              :part="item.part"
            >
              {{ item.value }}
            </DatePickerInput>
          </template>
        </div>
        <font-awesome-icon
          v-if="invalid"
          class="text-[var(--icons-color-danger)]"
          icon="fa-solid fa-triangle-exclamation"
        />
        <DatePickerTrigger
          v-if="!readonly && !calendarDisabled"
          as-child
        >
          <Button
            icon="fa-solid fa-calendar"
            icon-only
            :label="t('components.datePicker.open')"
            size="xsmall"
            variant="secondary"
          />
        </DatePickerTrigger>
      </DatePickerField>
      <DatePickerContent
        v-if="!calendarDisabled"
        class="app-popover"
        :side-offset="4"
      >
        <Calendar
          autofocus
          class="border-0"
          :disabled
          :first-day-of-week
          :max-value
          :min-value
          :model-value="value"
          :readonly
          :unavailable-date
          @update:model-value="onCalendarSelect"
        />
      </DatePickerContent>
    </DatePickerRoot>
  </FieldWrapper>
</template>

<style scoped>
@layer components {
  .app-input {
    padding: var(--layout-padding-xsmall) 0.75rem;
  }

  .app-input.app-input-small {
    padding: var(--layout-padding-hair) var(--layout-padding-small);
  }

  .bcds-date-picker-segment {
    outline: none;
  }

  .bcds-date-picker-segment:focus {
    margin: 0 var(--layout-margin-hair);
    border-radius: var(--layout-border-radius-small);
    padding: var(--layout-padding-hair);
    background: var(--surface-color-primary-default);
    color: var(--typography-color-primary-invert);
  }

  .app-input-readonly .bcds-date-picker-segment:focus {
    background: var(--surface-color-forms-disabled);
    color: var(--typography-color-primary);
  }
}
</style>
