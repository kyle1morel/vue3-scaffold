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
  isBrowserLocaleUsed = false,
  isCalendarDisabled = false,
  label = undefined,
  maxDate = undefined,
  minDate = undefined,
  name = undefined,
  readonly = false,
  required = false,
  showFormatHelpText = true,
  showTime = false,
  size = 'medium'
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // Orders the date segments as the browser's language does, instead of the app's
  isBrowserLocaleUsed?: boolean;
  // Leaves out the calendar button, so the date can only be typed
  isCalendarDisabled?: boolean;
  label?: string;
  maxDate?: Date;
  minDate?: Date;
  name?: string;
  readonly?: boolean;
  required?: boolean;
  // Spells out the segment order under the field, such as year - month - day
  showFormatHelpText?: boolean;
  showTime?: boolean;
  size?: 'medium' | 'small';
}>();

// Emits
// The segments are separate inputs, so blur is when focus leaves them all
const emit = defineEmits<{ blur: [event: FocusEvent] }>();

const value = defineModel<Date | null>();

// Composables
const { locale, t } = useI18n();

// State
// Reka works in calendar dates, which carry no time zone; the form keeps a local Date
const dateValue = computed<DateValue | null>({
  get: () => (value.value ? toDateValue(value.value) : null),
  set: (date) => (value.value = date ? date.toDate(getLocalTimeZone()) : null)
});

const dateLocale = computed(() => (isBrowserLocaleUsed ? navigator.language : locale.value));
const maxValue = computed(() => (maxDate ? toDateValue(maxDate) : undefined));
const minValue = computed(() => (minDate ? toDateValue(minDate) : undefined));

// The calendar shows days; its month and year open grids to jump to another month or year
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
    year: t('components.datePicker.parts.year')
  };
  const parts = new Intl.DateTimeFormat(dateLocale.value, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(showTime ? { hour: 'numeric', minute: '2-digit' } : {})
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

// Each view starts with focus on its current cell, so the keyboard can carry on from there
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
  return showTime ? new CalendarDateTime(...day, date.getHours(), date.getMinutes()) : new CalendarDate(...day);
}
</script>

<template>
  <!-- The date is typed as separate segments, so the field is named with aria-labelledby -->
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
      :granularity="showTime ? 'minute' : 'day'"
      :locale="dateLocale"
      :max-value
      :min-value
      :name
      :readonly
      :required
      weekday-format="short"
      @update:open="view = 'day'"
    >
      <DatePickerField
        v-slot="{ segments }"
        v-bind="inputAttrs"
        :aria-invalid="invalid || undefined"
        :aria-labelledby="labelId"
        class="app-input"
        :class="[size, { invalid, readonly }]"
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
              class="segment"
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
            <DatePickerHeader class="header">
              <DatePickerPrev class="nav">
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
              </DatePickerPrev>
              <DatePickerHeading class="heading">
                <button
                  :aria-label="t('components.datePicker.chooseMonth', { month: monthLabel })"
                  class="view-button"
                  type="button"
                  @click="view = 'month'"
                >
                  {{ monthLabel }}
                </button>
                <button
                  :aria-label="t('components.datePicker.chooseYear', { year: placeholder.year })"
                  class="view-button"
                  type="button"
                  @click="view = 'year'"
                >
                  {{ placeholder.year }}
                </button>
              </DatePickerHeading>
              <DatePickerNext class="nav">
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
              </DatePickerNext>
            </DatePickerHeader>
            <DatePickerGrid
              v-for="month in grid"
              :key="month.value.toString()"
              class="grid-table"
            >
              <DatePickerGridHead>
                <DatePickerGridRow>
                  <DatePickerHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="head-cell"
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
                      class="cell"
                      :day="weekDate"
                      :month="month.value"
                    />
                  </DatePickerCell>
                </DatePickerGridRow>
              </DatePickerGridBody>
            </DatePickerGrid>
          </DatePickerCalendar>
          <!-- Picking a month or year only moves the calendar to it; the date is still chosen from the days -->
          <MonthPickerRoot
            v-else-if="view === 'month'"
            v-slot="{ grid }"
            v-model:placeholder="placeholder"
            :locale="dateLocale"
            :max-value
            :min-value
            :model-value="dateValue"
            prevent-deselect
            @update:model-value="onMonthSelect"
          >
            <MonthPickerHeader class="header">
              <MonthPickerPrev class="nav">
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
              </MonthPickerPrev>
              <MonthPickerHeading class="heading">
                <button
                  :aria-label="t('components.datePicker.chooseYear', { year: placeholder.year })"
                  class="view-button"
                  type="button"
                  @click="view = 'year'"
                >
                  {{ placeholder.year }}
                </button>
              </MonthPickerHeading>
              <MonthPickerNext class="nav">
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
              </MonthPickerNext>
            </MonthPickerHeader>
            <MonthPickerGrid class="grid-table period-grid">
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
                      class="cell period"
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
            :max-value
            :min-value
            :model-value="dateValue"
            prevent-deselect
            @update:model-value="onYearSelect"
          >
            <YearPickerHeader class="header">
              <YearPickerPrev class="nav">
                <font-awesome-icon icon="fa-solid fa-chevron-left" />
              </YearPickerPrev>
              <YearPickerHeading class="heading" />
              <YearPickerNext class="nav">
                <font-awesome-icon icon="fa-solid fa-chevron-right" />
              </YearPickerNext>
            </YearPickerHeader>
            <YearPickerGrid class="grid-table period-grid">
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
                      class="cell period"
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

<!-- Reka renders the calendar inside its own wrapper, which a scoped style can't reach -->
<style>
.bcds-calendar {
  padding: var(--layout-padding-medium);
  font: var(--typography-regular-small-body);
}
</style>

<style scoped>
.app-input {
  padding: var(--layout-padding-xsmall) 0.75rem;
}

.app-input.small {
  padding: var(--layout-padding-hair) var(--layout-padding-small);
}

.segment {
  outline: none;
}

.segment:focus {
  margin: 0 var(--layout-margin-hair);
  border-radius: var(--layout-border-radius-small);
  padding: var(--layout-padding-hair);
  background: var(--surface-color-primary-default);
  color: var(--typography-color-primary-invert);
}

.readonly .segment:focus {
  background: var(--surface-color-forms-disabled);
  color: var(--typography-color-primary);
}

.nav {
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

.nav:hover {
  background: var(--surface-color-secondary-button-hover);
}

.nav:disabled {
  background: transparent;
  color: var(--typography-color-disabled);
  cursor: not-allowed;
}

.nav:focus-visible {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--layout-padding-xsmall) var(--layout-padding-small);
}

.heading {
  display: flex;
  flex: 1;
  justify-content: center;
  gap: var(--layout-margin-xsmall);
  font: var(--typography-bold-small-body);
}

.view-button {
  height: var(--icons-size-large);
  padding: 0 var(--layout-padding-xsmall);
  border: none;
  border-radius: var(--layout-border-radius-small);
  background: transparent;
  color: var(--typography-color-primary);
  font: var(--typography-bold-small-body);
  cursor: pointer;
}

.view-button:hover {
  background: var(--surface-color-secondary-button-hover);
}

.view-button:focus-visible {
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}

.grid-table {
  border-collapse: separate;
  border-spacing: var(--layout-margin-xsmall);
  text-align: center;
}

/* As wide as the day grid, so switching views doesn't resize the calendar */
.period-grid {
  width: calc(7 * var(--icons-size-xlarge) + 8 * var(--layout-margin-xsmall));
}

/* Bold, as a table header is by default */
.head-cell {
  font: var(--typography-bold-small-body);
}

.cell {
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

.cell:hover {
  background: var(--surface-color-secondary-button-hover);
}

.cell:focus-visible {
  border-color: var(--surface-color-border-active);
  background: var(--surface-color-secondary-button-hover);
}

.cell[data-today] {
  font: var(--typography-bold-small-body);
}

.cell[data-selected] {
  background: var(--surface-color-primary-button-default);
  color: var(--typography-color-primary-invert);
}

.cell[data-selected]:hover {
  background: var(--surface-color-primary-button-hover);
}

.cell[data-selected]:focus-visible {
  outline: var(--layout-border-width-small) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}

/* A month or year fills its column */
.cell.period {
  width: 100%;
  height: var(--layout-margin-xxlarge);
}

/* Days from the months either side are left out */
.cell[data-outside-view] {
  visibility: hidden;
}

.cell[data-disabled] {
  color: var(--typography-color-disabled);
  cursor: not-allowed;
}

.cell[data-unavailable] {
  color: var(--typography-color-danger);
  text-decoration: line-through;
  cursor: not-allowed;
}
</style>
