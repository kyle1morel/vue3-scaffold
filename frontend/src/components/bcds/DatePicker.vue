<script setup lang="ts">
import { CalendarDate, CalendarDateTime, getLocalTimeZone } from '@internationalized/date';
import {
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerContent,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot,
  DatePickerTrigger,
  MonthPickerCell,
  MonthPickerCellTrigger,
  MonthPickerGrid,
  MonthPickerGridBody,
  MonthPickerGridRow,
  MonthPickerHeader,
  MonthPickerHeading,
  MonthPickerNext,
  MonthPickerPrev,
  MonthPickerRoot,
  YearPickerCell,
  YearPickerCellTrigger,
  YearPickerGrid,
  YearPickerGridBody,
  YearPickerGridRow,
  YearPickerHeader,
  YearPickerHeading,
  YearPickerNext,
  YearPickerPrev,
  YearPickerRoot
} from 'reka-ui';
import { computed, nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from './Button.vue';
import FieldWrapper from './FieldWrapper.vue';

import type { DateValue } from '@internationalized/date';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  firstDayOfWeek = undefined,
  granularity = 'day',
  hourCycle = undefined,
  isBrowserLocaleUsed = false,
  isCalendarDisabled = false,
  isDateUnavailable = undefined,
  label = undefined,
  maxValue = undefined,
  minValue = undefined,
  name = undefined,
  readonly = false,
  required = false,
  showFormatHelpText = true,
  size = 'medium'
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // The calendar's first column; without it, Reka starts the week on Sunday.
  firstDayOfWeek?: 'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed';
  // The smallest unit typed, so anything finer than day adds the time.
  granularity?: 'day' | 'hour' | 'minute' | 'second';
  // 12 or 24 hour time; without it, the locale decides.
  hourCycle?: 12 | 24;
  // Orders the date segments as the browser's language does, instead of the app's
  isBrowserLocaleUsed?: boolean;
  // Leaves out the calendar button, so the date can only be typed.
  isCalendarDisabled?: boolean;
  // Dates that can't be chosen, such as weekends; the calendar strikes them through.
  isDateUnavailable?: (date: Date) => boolean;
  label?: string;
  maxValue?: Date;
  minValue?: Date;
  name?: string;
  readonly?: boolean;
  required?: boolean;
  // Spells out the segment order under the field, such as year - month - day
  showFormatHelpText?: boolean;
  size?: 'medium' | 'small';
}>();

// Emits
// The segments are separate inputs, so blur is when focus leaves them all.
const emit = defineEmits<{ blur: [event: FocusEvent] }>();

const value = defineModel<Date | null>();

// Constants
// Reka numbers the days of the week from Sunday.
const WEEKDAYS = { fri: 5, mon: 1, sat: 6, sun: 0, thu: 4, tue: 2, wed: 3 } as const;

// Composables
const { locale, t } = useI18n();

// State
// Reka works in calendar dates, which carry no time zone; the form keeps a local Date.
const dateValue = computed<DateValue | null>({
  get: () => (value.value ? toDateValue(value.value) : null),
  set: (date) => (value.value = date ? date.toDate(getLocalTimeZone()) : null)
});

const dateLocale = computed(() => (isBrowserLocaleUsed ? navigator.language : locale.value));
const maxDateValue = computed(() => (maxValue ? toDateValue(maxValue) : undefined));
const minDateValue = computed(() => (minValue ? toDateValue(minValue) : undefined));
const unavailable = computed(() =>
  isDateUnavailable ? (date: DateValue) => isDateUnavailable(date.toDate(getLocalTimeZone())) : undefined
);
const weekStartsOn = computed(() => (firstDayOfWeek ? WEEKDAYS[firstDayOfWeek] : undefined));

// The calendar shows days; its month and year open grids to jump to another month or year.
const view = ref<'day' | 'month' | 'year'>('day');
const calendar = useTemplateRef<HTMLElement>('calendar');

// The month the calendar is showing, which the day, month and year views share
const placeholder = shallowRef<DateValue>(dateValue.value ?? toDateValue(new Date()));
const monthLabel = computed(() =>
  new Intl.DateTimeFormat(dateLocale.value, { month: 'long' }).format(placeholder.value.toDate(getLocalTimeZone()))
);

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

// Each view starts with focus on its current cell, so the keyboard can carry on from there.
watch(view, async () => {
  await nextTick();
  const cells = calendar.value?.querySelectorAll<HTMLElement>('.cell:not([data-disabled]):not([data-unavailable])');
  const current = [...(cells ?? [])].find((cell) => cell.hasAttribute('data-focused'));
  (current ?? cells?.[0])?.focus();
});

// Actions
function onFocusOut(event: FocusEvent) {
  const field = event.currentTarget as HTMLElement;
  if (!field.contains(event.relatedTarget as Node | null)) emit('blur', event);
}

function onMonthSelect(month: DateValue | DateValue[] | undefined) {
  if (!month || Array.isArray(month)) return;
  placeholder.value = placeholder.value.set({ month: month.month, year: month.year });
  view.value = 'day';
}

function onYearSelect(year: DateValue | DateValue[] | undefined) {
  if (!year || Array.isArray(year)) return;
  placeholder.value = placeholder.value.set({ year: year.year });
  view.value = 'month';
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
      v-model:placeholder="placeholder"
      close-on-select
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
      :week-starts-on
      weekday-format="short"
      @update:open="view = 'day'"
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
          v-if="!readonly && !isCalendarDisabled"
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
        v-if="!isCalendarDisabled"
        class="app-popover bcds-calendar"
        :side-offset="4"
      >
        <div ref="calendar">
          <DatePickerCalendar
            v-if="view === 'day'"
            v-slot="{ weekDays, grid }"
          >
            <DatePickerHeader class="bcds-date-picker-header">
              <DatePickerPrev class="bcds-date-picker-nav">
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
              </DatePickerPrev>
              <DatePickerHeading class="bcds-date-picker-heading">
                <button
                  :aria-label="t('components.datePicker.chooseMonth', { month: monthLabel })"
                  class="bcds-date-picker-view-button"
                  type="button"
                  @click="view = 'month'"
                >
                  {{ monthLabel }}
                </button>
                <button
                  :aria-label="t('components.datePicker.chooseYear', { year: placeholder.year })"
                  class="bcds-date-picker-view-button"
                  type="button"
                  @click="view = 'year'"
                >
                  {{ placeholder.year }}
                </button>
              </DatePickerHeading>
              <DatePickerNext class="bcds-date-picker-nav">
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
              </DatePickerNext>
            </DatePickerHeader>
            <DatePickerGrid
              v-for="month in grid"
              :key="month.value.toString()"
              class="bcds-date-picker-grid-table"
            >
              <DatePickerGridHead>
                <DatePickerGridRow>
                  <DatePickerHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="bcds-date-picker-head-cell"
                  >
                    {{ day }}
                  </DatePickerHeadCell>
                </DatePickerGridRow>
              </DatePickerGridHead>
              <DatePickerGridBody>
                <DatePickerGridRow
                  v-for="(weekDates, index) in month.rows"
                  :key="index"
                >
                  <DatePickerCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                  >
                    <DatePickerCellTrigger
                      class="bcds-date-picker-cell"
                      :day="weekDate"
                      :month="month.value"
                    />
                  </DatePickerCell>
                </DatePickerGridRow>
              </DatePickerGridBody>
            </DatePickerGrid>
          </DatePickerCalendar>
          <!-- Picking a month or year only moves the calendar to it; the date is still chosen from the days. -->
          <MonthPickerRoot
            v-else-if="view === 'month'"
            v-slot="{ grid }"
            v-model:placeholder="placeholder"
            :locale="dateLocale"
            :max-value="maxDateValue"
            :min-value="minDateValue"
            :model-value="dateValue"
            prevent-deselect
            @update:model-value="onMonthSelect"
          >
            <MonthPickerHeader class="bcds-date-picker-header">
              <MonthPickerPrev class="bcds-date-picker-nav">
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
              </MonthPickerPrev>
              <MonthPickerHeading class="bcds-date-picker-heading">
                <button
                  :aria-label="t('components.datePicker.chooseYear', { year: placeholder.year })"
                  class="bcds-date-picker-view-button"
                  type="button"
                  @click="view = 'year'"
                >
                  {{ placeholder.year }}
                </button>
              </MonthPickerHeading>
              <MonthPickerNext class="bcds-date-picker-nav">
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
              </MonthPickerNext>
            </MonthPickerHeader>
            <MonthPickerGrid class="bcds-date-picker-grid-table bcds-date-picker-period-grid">
              <MonthPickerGridBody>
                <MonthPickerGridRow
                  v-for="(months, index) in grid.rows"
                  :key="index"
                >
                  <MonthPickerCell
                    v-for="month in months"
                    :key="month.toString()"
                    :date="month"
                  >
                    <MonthPickerCellTrigger
                      class="bcds-date-picker-cell bcds-date-picker-period"
                      :month
                    />
                  </MonthPickerCell>
                </MonthPickerGridRow>
              </MonthPickerGridBody>
            </MonthPickerGrid>
          </MonthPickerRoot>
          <YearPickerRoot
            v-else
            v-slot="{ grid }"
            v-model:placeholder="placeholder"
            :locale="dateLocale"
            :max-value="maxDateValue"
            :min-value="minDateValue"
            :model-value="dateValue"
            prevent-deselect
            @update:model-value="onYearSelect"
          >
            <YearPickerHeader class="bcds-date-picker-header">
              <YearPickerPrev class="bcds-date-picker-nav">
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
              </YearPickerPrev>
              <YearPickerHeading class="bcds-date-picker-heading" />
              <YearPickerNext class="bcds-date-picker-nav">
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
              </YearPickerNext>
            </YearPickerHeader>
            <YearPickerGrid class="bcds-date-picker-grid-table bcds-date-picker-period-grid">
              <YearPickerGridBody>
                <YearPickerGridRow
                  v-for="(years, index) in grid.rows"
                  :key="index"
                >
                  <YearPickerCell
                    v-for="year in years"
                    :key="year.toString()"
                    :date="year"
                  >
                    <YearPickerCellTrigger
                      class="bcds-date-picker-cell bcds-date-picker-period"
                      :year
                    />
                  </YearPickerCell>
                </YearPickerGridRow>
              </YearPickerGridBody>
            </YearPickerGrid>
          </YearPickerRoot>
        </div>
      </DatePickerContent>
    </DatePickerRoot>
  </FieldWrapper>
</template>

<!-- Reka renders the calendar inside its own wrapper, which a scoped style can't reach. -->
<style>
@layer components {
  .bcds-calendar {
    padding: var(--layout-padding-medium);
    font: var(--typography-regular-small-body);
  }
}
</style>

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

  .bcds-date-picker-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--icons-size-large);
    height: var(--icons-size-large);
    border: none;
    border-radius: var(--layout-border-radius-small);
    background: transparent;
    color: var(--icons-color-primary);
    font-size: var(--icons-size-small);
    cursor: pointer;
  }

  .bcds-date-picker-nav:hover {
    background: var(--surface-color-secondary-button-hover);
  }

  .bcds-date-picker-nav:disabled {
    background: transparent;
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }

  .bcds-date-picker-nav:focus-visible {
    outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  .bcds-date-picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--layout-padding-xsmall) var(--layout-padding-small);
  }

  .bcds-date-picker-heading {
    display: flex;
    flex: 1;
    justify-content: center;
    gap: var(--layout-margin-xsmall);
    font: var(--typography-bold-small-body);
  }

  .bcds-date-picker-view-button {
    height: var(--icons-size-large);
    padding: 0 var(--layout-padding-xsmall);
    border: none;
    border-radius: var(--layout-border-radius-small);
    background: transparent;
    color: var(--typography-color-primary);
    font: var(--typography-bold-small-body);
    cursor: pointer;
  }

  .bcds-date-picker-view-button:hover {
    background: var(--surface-color-secondary-button-hover);
  }

  .bcds-date-picker-view-button:focus-visible {
    outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  .bcds-date-picker-grid-table {
    border-collapse: separate;
    border-spacing: var(--layout-margin-xsmall);
    text-align: center;
  }

  /* As wide as the day grid, so switching views doesn't resize the calendar */
  .bcds-date-picker-period-grid {
    width: calc(7 * var(--icons-size-xlarge) + 8 * var(--layout-margin-xsmall));
  }

  /* Bold, as a table header is by default */
  .bcds-date-picker-head-cell {
    font: var(--typography-bold-small-body);
  }

  .bcds-date-picker-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--icons-size-xlarge);
    height: var(--icons-size-xlarge);
    padding: var(--layout-padding-xsmall);
    border: var(--layout-border-width-small) solid transparent;
    border-radius: var(--layout-border-radius-small);
    color: var(--typography-color-primary);
    cursor: pointer;
    outline: none;
  }

  .bcds-date-picker-cell:hover {
    background: var(--surface-color-secondary-button-hover);
  }

  .bcds-date-picker-cell:focus-visible {
    border-color: var(--surface-color-border-active);
    background: var(--surface-color-secondary-button-hover);
  }

  .bcds-date-picker-cell[data-today] {
    font: var(--typography-bold-small-body);
  }

  .bcds-date-picker-cell[data-selected] {
    background: var(--surface-color-primary-button-default);
    color: var(--typography-color-primary-invert);
  }

  .bcds-date-picker-cell[data-selected]:hover {
    background: var(--surface-color-primary-button-hover);
  }

  .bcds-date-picker-cell[data-selected]:focus-visible {
    outline: var(--layout-border-width-small) solid var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  /* A month or year fills its column */
  .bcds-date-picker-cell.bcds-date-picker-period {
    width: 100%;
    height: var(--layout-margin-xxlarge);
  }

  /* Days from the months either side are left out */
  .bcds-date-picker-cell[data-outside-view] {
    visibility: hidden;
  }

  .bcds-date-picker-cell[data-disabled] {
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }

  .bcds-date-picker-cell[data-unavailable] {
    color: var(--typography-color-danger);
    text-decoration: line-through;
    cursor: not-allowed;
  }
}
</style>
