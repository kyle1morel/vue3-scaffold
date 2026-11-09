<script setup lang="ts">
import { ProgressRoot } from 'reka-ui';
import { computed, useId } from 'vue';
import { useI18n } from 'vue-i18n';

// Props
const {
  formatOptions = { style: 'percent' },
  isIndeterminate = false,
  maxValue = 100,
  minValue = 0,
  size = 'medium',
  value = 0,
  valueLabel = undefined
} = defineProps<{
  // How the value is shown; a percent style shows the share done, and any other shows the value itself
  formatOptions?: Intl.NumberFormatOptions;
  isIndeterminate?: boolean;
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

// Reka counts from 0 and treats a value outside 0 to max as indeterminate, so the value is shifted and clamped
const range = computed(() => maxValue - minValue);
const progress = computed(() => Math.min(Math.max(value - minValue, 0), range.value));
const valueText = computed(() =>
  new Intl.NumberFormat(locale.value, formatOptions).format(
    formatOptions.style === 'percent' ? progress.value / range.value : progress.value + minValue
  )
);
// The fill's path is 100 long, so an indeterminate circle shows a quarter of it spinning
const dashOffset = computed(() => 100 - (isIndeterminate ? 25 : (progress.value / range.value) * 100));

// Actions
// The label or the caller's aria-label names the circle, not Reka's default of the percentage
const noLabel = () => undefined;
const getValueText = () => (isIndeterminate ? undefined : valueText.value);
</script>

<template>
  <ProgressRoot
    class="bcds-progress-circle"
    :aria-labelledby="valueLabel ? labelId : undefined"
    :get-value-label="noLabel"
    :get-value-text="getValueText"
    :max="range"
    :model-value="isIndeterminate ? null : progress"
  >
    <svg
      aria-hidden="true"
      class="bcds-progress-circle-circle"
      :class="`bcds-progress-circle-${size}`"
    >
      <circle class="bcds-progress-circle-track" />
      <circle
        class="bcds-progress-circle-fill"
        pathLength="100"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div
      v-if="valueLabel"
      class="bcds-progress-circle-label"
    >
      <span :id="labelId">{{ valueLabel }}</span>
      <span
        v-if="!isIndeterminate"
        class="bcds-progress-circle-value"
      >
        {{ valueText }}
      </span>
    </div>
  </ProgressRoot>
</template>

<style scoped>
@layer components {
  .bcds-progress-circle {
    display: flex;
    flex-direction: column;
    gap: var(--layout-padding-xsmall);
    color: var(--typography-color-primary);
    font: var(--typography-regular-small-body);
  }

  .bcds-progress-circle-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--layout-margin-hair);
  }

  .bcds-progress-circle-value {
    color: var(--typography-color-secondary);
  }

  .bcds-progress-circle-circle {
    align-self: center;
    fill: none;
    --stroke: var(--layout-border-width-medium);
    stroke-width: var(--stroke);
  }

  .bcds-progress-circle-track,
  .bcds-progress-circle-fill {
    cx: 50%;
    cy: 50%;
    r: calc(50% - var(--stroke) / 2);
  }

  .bcds-progress-circle-track {
    stroke: var(--theme-gray-30);
  }

  .bcds-progress-circle-fill {
    stroke: var(--theme-primary-blue);
    stroke-dasharray: 100 200;
    stroke-linecap: round;
    rotate: -90deg;
    transform-origin: center;
    transition: 200ms linear;
  }

  .bcds-progress-circle-small {
    width: var(--icons-size-medium);
    height: var(--icons-size-medium);
  }

  .bcds-progress-circle-medium {
    width: var(--icons-size-large);
    height: var(--icons-size-large);
  }

  .bcds-progress-circle-large {
    width: var(--icons-size-xlarge);
    height: var(--icons-size-xlarge);
    --stroke: var(--layout-border-width-large);
  }

  .bcds-progress-circle[data-state='indeterminate'] .bcds-progress-circle-fill {
    animation: spin 1.5s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .bcds-progress-circle[data-state='indeterminate'] .bcds-progress-circle-fill {
      animation: pulse 2s ease-in-out infinite;
      stroke-dashoffset: 0;
    }
  }

  @keyframes spin {
    from {
      rotate: -90deg;
    }

    to {
      rotate: 270deg;
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
