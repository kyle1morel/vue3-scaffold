<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { computed, useId } from 'vue';
import { useI18n } from 'vue-i18n';

// Props
const {
  formatOptions = { style: 'percent' },
  indeterminate = false,
  maxValue = 100,
  minValue = 0,
  size = 'medium',
  value = 0,
  valueLabel = undefined
} = defineProps<{
  // How the value is shown; a percent style shows the share done, and any other shows the value itself.
  formatOptions?: Intl.NumberFormatOptions;
  indeterminate?: boolean;
  maxValue?: number;
  minValue?: number;
  size?: 'large' | 'medium' | 'small';
  value?: number;
  valueLabel?: string;
}>();

// Composables
const { locale } = useI18n();

// State
const labelId = useId();

// Reka counts from 0 and treats a value outside 0 to max as indeterminate, so the value is shifted and clamped.
const range = computed(() => maxValue - minValue);
const progress = computed(() => Math.min(Math.max(value - minValue, 0), range.value));
const valueText = computed(() =>
  new Intl.NumberFormat(locale.value, formatOptions).format(
    formatOptions.style === 'percent' ? progress.value / range.value : progress.value + minValue
  )
);

// Actions
// The label or the caller's aria-label names the bar, not Reka's default of the percentage.
const noLabel = () => undefined;
const getValueText = () => (indeterminate ? undefined : valueText.value);
</script>

<template>
  <ProgressRoot
    class="bcds-progress-bar"
    :aria-labelledby="valueLabel ? labelId : undefined"
    :get-value-label="noLabel"
    :get-value-text="getValueText"
    :max="range"
    :model-value="indeterminate ? null : progress"
  >
    <div
      v-if="valueLabel"
      class="bcds-progress-bar-label"
    >
      <span :id="labelId">{{ valueLabel }}</span>
      <span
        v-if="!indeterminate"
        class="bcds-progress-bar-value"
      >
        {{ valueText }}
      </span>
    </div>
    <div
      class="bcds-progress-bar-track"
      :class="`bcds-progress-bar-${size}`"
    >
      <ProgressIndicator
        class="bcds-progress-bar-fill"
        :style="{ '--fraction': progress / range }"
      />
    </div>
  </ProgressRoot>
</template>

<style scoped>
@layer components {
  .bcds-progress-bar {
    display: flex;
    flex-direction: column;
    gap: var(--layout-padding-xsmall);
    color: var(--typography-color-primary);
    font: var(--typography-regular-small-body);
  }

  .bcds-progress-bar-label {
    display: flex;
    justify-content: space-between;
    gap: var(--layout-margin-medium);
  }

  .bcds-progress-bar-value {
    color: var(--typography-color-secondary);
  }

  /* The height is inside the border */
  .bcds-progress-bar-track {
    position: relative;
    box-sizing: content-box;
    overflow: hidden;
    border: var(--layout-border-width-small) solid var(--surface-color-border-default);
    border-radius: var(--layout-border-radius-circular);
    background: var(--surface-color-border-default);
  }

  .bcds-progress-bar-fill {
    position: absolute;
    inset: 0;
    border-radius: var(--layout-border-radius-circular);
    background: var(--surface-color-primary-default);
    transform: scaleX(var(--fraction));
    transform-origin: left;
    transition: transform 200ms linear;
  }

  .bcds-progress-bar-small {
    height: var(--layout-padding-hair);
  }

  .bcds-progress-bar-medium {
    height: var(--layout-padding-xsmall);
  }

  .bcds-progress-bar-large {
    height: var(--layout-padding-small);
  }

  .bcds-progress-bar-fill[data-state='indeterminate'] {
    transform: scaleX(1);
    animation: indeterminate 1.5s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .bcds-progress-bar-fill[data-state='indeterminate'] {
      animation: pulse 2s ease-in-out infinite;
    }
  }

  @keyframes indeterminate {
    0% {
      transform: translateX(-100%) scaleX(0.4);
    }

    50% {
      transform: translateX(0%) scaleX(0.4);
    }

    100% {
      transform: translateX(100%) scaleX(0.4);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.4;
    }
  }
}
</style>
