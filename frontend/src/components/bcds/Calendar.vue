<script lang="ts">
import type { InjectionKey, Ref } from 'vue';

// A DatePicker shows its calendar in the language it uses for the date, which can be the browser's.
export const CALENDAR_LOCALE: InjectionKey<Readonly<Ref<string>>> = Symbol('CalendarLocale');
</script>

<script setup lang="ts">
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
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
import { computed, inject, nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { DateValue } from '@internationalized/date';

// Props
const {
  autofocus = false,
  disabled = false,
  firstDayOfWeek = undefined,
  maxValue = undefined,
  minValue = undefined,
  readonly = false,
  unavailableDate = undefined
} = defineProps<{
  // Moves focus to the selected day, or today, when the calendar appears
  autofocus?: boolean;
  disabled?: boolean;
  // The first column; without it, Reka starts the week on Sunday.
  firstDayOfWeek?: 'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed';
  maxValue?: Date;
  minValue?: Date;
  readonly?: boolean;
  // Dates that can't be chosen, such as weekends; they're struck through.
  unavailableDate?: (date: Date) => boolean;
}>();

const value = defineModel<Date | null>();

// Constants
// Reka numbers the days of the week from Sunday.
const WEEKDAYS = { fri: 5, mon: 1, sat: 6, sun: 0, thu: 4, tue: 2, wed: 3 } as const;

// Composables
const { locale: appLocale, t } = useI18n();

// State
const locale = inject(CALENDAR_LOCALE, appLocale);

// Reka works in calendar dates, which carry no time zone; the value is a local Date.
const dateValue = computed<DateValue | null>({
  get: () => (value.value ? toDateValue(value.value) : null),
  set: (date) => (value.value = date ? date.toDate(getLocalTimeZone()) : null)
});

const maxDateValue = computed(() => (maxValue ? toDateValue(maxValue) : undefined));
const minDateValue = computed(() => (minValue ? toDateValue(minValue) : undefined));
const unavailable = computed(() =>
  unavailableDate ? (date: DateValue) => unavailableDate(date.toDate(getLocalTimeZone())) : undefined
);
const weekStartsOn = computed(() => (firstDayOfWeek ? WEEKDAYS[firstDayOfWeek] : undefined));

// The calendar shows days; its month and year open grids to jump to another month or year.
const view = ref<'day' | 'month' | 'year'>('day');
const calendar = useTemplateRef<HTMLElement>('calendar');

// The month the calendar is showing, which the day, month and year views share
const placeholder = shallowRef<DateValue>(dateValue.value ?? toDateValue(new Date()));
const monthLabel = computed(() =>
  new Intl.DateTimeFormat(locale.value, { month: 'long' }).format(placeholder.value.toDate(getLocalTimeZone()))
);

// Each view starts with focus on its current cell, so the keyboard can carry on from there.
watch(view, async () => {
  await nextTick();
  const cells = calendar.value?.querySelectorAll<HTMLElement>(
    '.bcds-calendar-cell:not([data-disabled]):not([data-unavailable])'
  );
  const current = [...(cells ?? [])].find((cell) => cell.hasAttribute('data-focused'));
  (current ?? cells?.[0])?.focus();
});

// Actions
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
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}
</script>

<template>
  <div
    ref="calendar"
    class="bcds-calendar"
  >
    <CalendarRoot
      v-if="view === 'day'"
      v-slot="{ weekDays, grid }"
      v-model="dateValue"
      v-model:placeholder="placeholder"
      :disabled
      :initial-focus="autofocus"
      :is-date-unavailable="unavailable"
      :locale
      :max-value="maxDateValue"
      :min-value="minDateValue"
      prevent-deselect
      :readonly
      :week-starts-on
      weekday-format="short"
    >
      <CalendarHeader class="bcds-calendar-header">
        <CalendarPrev class="bcds-calendar-nav">
          <font-awesome-icon icon="fa-solid fa-chevron-left" />
        </CalendarPrev>
        <CalendarHeading class="bcds-calendar-heading">
          <button
            :aria-label="t('components.datePicker.chooseMonth', { month: monthLabel })"
            class="bcds-calendar-view-button"
            type="button"
            @click="view = 'month'"
          >
            {{ monthLabel }}
          </button>
          <button
            :aria-label="t('components.datePicker.chooseYear', { year: placeholder.year })"
            class="bcds-calendar-view-button"
            type="button"
            @click="view = 'year'"
          >
            {{ placeholder.year }}
          </button>
        </CalendarHeading>
        <CalendarNext class="bcds-calendar-nav">
          <font-awesome-icon icon="fa-solid fa-chevron-right" />
        </CalendarNext>
      </CalendarHeader>
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="bcds-calendar-grid-table"
      >
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="bcds-calendar-head-cell"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="index"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <CalendarCellTrigger
                class="bcds-calendar-cell"
                :day="weekDate"
                :month="month.value"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </CalendarRoot>
    <!-- Picking a month or year only moves the calendar to it; the date is still chosen from the days. -->
    <MonthPickerRoot
      v-else-if="view === 'month'"
      v-slot="{ grid }"
      v-model:placeholder="placeholder"
      :disabled
      :locale
      :max-value="maxDateValue"
      :min-value="minDateValue"
      :model-value="dateValue"
      prevent-deselect
      @update:model-value="onMonthSelect"
    >
      <MonthPickerHeader class="bcds-calendar-header">
        <MonthPickerPrev class="bcds-calendar-nav">
          <font-awesome-icon icon="fa-solid fa-chevron-left" />
        </MonthPickerPrev>
        <MonthPickerHeading class="bcds-calendar-heading">
          <button
            :aria-label="t('components.datePicker.chooseYear', { year: placeholder.year })"
            class="bcds-calendar-view-button"
            type="button"
            @click="view = 'year'"
          >
            {{ placeholder.year }}
          </button>
        </MonthPickerHeading>
        <MonthPickerNext class="bcds-calendar-nav">
          <font-awesome-icon icon="fa-solid fa-chevron-right" />
        </MonthPickerNext>
      </MonthPickerHeader>
      <MonthPickerGrid class="bcds-calendar-grid-table bcds-calendar-period-grid">
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
                class="bcds-calendar-cell bcds-calendar-period"
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
      :disabled
      :locale
      :max-value="maxDateValue"
      :min-value="minDateValue"
      :model-value="dateValue"
      prevent-deselect
      @update:model-value="onYearSelect"
    >
      <YearPickerHeader class="bcds-calendar-header">
        <YearPickerPrev class="bcds-calendar-nav">
          <font-awesome-icon icon="fa-solid fa-chevron-left" />
        </YearPickerPrev>
        <YearPickerHeading class="bcds-calendar-heading" />
        <YearPickerNext class="bcds-calendar-nav">
          <font-awesome-icon icon="fa-solid fa-chevron-right" />
        </YearPickerNext>
      </YearPickerHeader>
      <YearPickerGrid class="bcds-calendar-grid-table bcds-calendar-period-grid">
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
                class="bcds-calendar-cell bcds-calendar-period"
                :year
              />
            </YearPickerCell>
          </YearPickerGridRow>
        </YearPickerGridBody>
      </YearPickerGrid>
    </YearPickerRoot>
  </div>
</template>

<style scoped>
@layer components {
  .bcds-calendar {
    display: inline-flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: var(--layout-padding-medium);
    border: var(--layout-border-width-small) solid var(--surface-color-border-default);
    border-radius: var(--layout-border-radius-medium);
    background-color: var(--surface-color-forms-default);
    font: var(--typography-regular-small-body);
  }

  .bcds-calendar-nav {
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

  .bcds-calendar-nav:hover {
    background: var(--surface-color-secondary-button-hover);
  }

  .bcds-calendar-nav:disabled {
    background: transparent;
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }

  .bcds-calendar-nav:focus-visible {
    outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  .bcds-calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--layout-padding-xsmall) var(--layout-padding-small);
  }

  .bcds-calendar-heading {
    display: flex;
    flex: 1;
    justify-content: center;
    gap: var(--layout-margin-xsmall);
    font: var(--typography-bold-small-body);
  }

  .bcds-calendar-view-button {
    height: var(--icons-size-large);
    padding: 0 var(--layout-padding-xsmall);
    border: none;
    border-radius: var(--layout-border-radius-small);
    background: transparent;
    color: var(--typography-color-primary);
    font: var(--typography-bold-small-body);
    cursor: pointer;
  }

  .bcds-calendar-view-button:hover {
    background: var(--surface-color-secondary-button-hover);
  }

  .bcds-calendar-view-button:focus-visible {
    outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  .bcds-calendar-grid-table {
    border-collapse: separate;
    border-spacing: var(--layout-margin-xsmall);
    text-align: center;
  }

  /* As wide as the day grid, so switching views doesn't resize the calendar */
  .bcds-calendar-period-grid {
    width: calc(7 * var(--icons-size-xlarge) + 8 * var(--layout-margin-xsmall));
  }

  /* Bold, as a table header is by default */
  .bcds-calendar-head-cell {
    font: var(--typography-bold-small-body);
  }

  .bcds-calendar-cell {
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

  .bcds-calendar-cell:hover {
    background: var(--surface-color-secondary-button-hover);
  }

  .bcds-calendar-cell:focus-visible {
    border-color: var(--surface-color-border-active);
    background: var(--surface-color-secondary-button-hover);
  }

  .bcds-calendar-cell[data-today] {
    font: var(--typography-bold-small-body);
  }

  .bcds-calendar-cell[data-selected] {
    background: var(--surface-color-primary-button-default);
    color: var(--typography-color-primary-invert);
  }

  .bcds-calendar-cell[data-selected]:hover {
    background: var(--surface-color-primary-button-hover);
  }

  .bcds-calendar-cell[data-selected]:focus-visible {
    outline: var(--layout-border-width-small) solid var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  /* A month or year fills its column */
  .bcds-calendar-cell.bcds-calendar-period {
    width: 100%;
    height: var(--layout-margin-xxlarge);
  }

  /* Days from the months either side are left out */
  .bcds-calendar-cell[data-outside-view] {
    visibility: hidden;
  }

  .bcds-calendar-cell[data-disabled] {
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }

  .bcds-calendar-cell[data-unavailable] {
    color: var(--typography-color-danger);
    text-decoration: line-through;
    cursor: not-allowed;
  }
}
</style>
