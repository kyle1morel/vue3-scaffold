<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { computed, useId } from 'vue';
import { useI18n } from 'vue-i18n';

// Props
const {
  isIndeterminate = false,
  maxValue = 100,
  minValue = 0,
  size = 'medium',
  value = 0,
  valueLabel = undefined
} = defineProps<{
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
  new Intl.NumberFormat(locale.value, { style: 'percent' }).format(progress.value / range.value)
);

// Actions
// The label or the caller's aria-label names the bar, not Reka's default of the percentage
const noLabel = () => undefined;
const getValueText = () => (isIndeterminate ? undefined : valueText.value);
</script>

<template>
  <ProgressRoot
    class="progress-bar"
    :aria-labelledby="valueLabel ? labelId : undefined"
    :get-value-label="noLabel"
    :get-value-text="getValueText"
    :max="range"
    :model-value="isIndeterminate ? null : progress"
  >
    <div
      v-if="valueLabel"
      class="label"
    >
      <span :id="labelId">{{ valueLabel }}</span>
      <span
        v-if="!isIndeterminate"
        class="value"
      >
        {{ valueText }}
      </span>
    </div>
    <div
      class="track"
      :class="size"
    >
      <ProgressIndicator
        class="fill"
        :style="{ '--fraction': progress / range }"
      />
    </div>
  </ProgressRoot>
</template>

<style scoped>
.progress-bar {
  display: flex;
  flex-direction: column;
  gap: var(--layout-padding-xsmall);
  color: var(--typography-color-primary);
  font: var(--typography-regular-small-body);
}

.label {
  display: flex;
  justify-content: space-between;
  gap: var(--layout-margin-medium);
}

.value {
  color: var(--typography-color-secondary);
}

/* The height is inside the border */
.track {
  position: relative;
  box-sizing: content-box;
  overflow: hidden;
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-circular);
  background: var(--surface-color-border-default);
}

.fill {
  position: absolute;
  inset: 0;
  border-radius: var(--layout-border-radius-circular);
  background: var(--surface-color-primary-default);
  transform: scaleX(var(--fraction));
  transform-origin: left;
  transition: transform 200ms linear;
}

.small {
  height: var(--layout-padding-hair);
}

.medium {
  height: var(--layout-padding-xsmall);
}

.large {
  height: var(--layout-padding-small);
}

.fill[data-state='indeterminate'] {
  transform: scaleX(1);
  animation: indeterminate 1.5s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .fill[data-state='indeterminate'] {
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
</style>
