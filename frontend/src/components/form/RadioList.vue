<script setup lang="ts">
import { ErrorMessage, useField } from 'vee-validate';
import { onBeforeMount, watch } from 'vue';

import { RadioButton } from '@/lib/primevue';

// Interfaces
interface RadioOptionObject {
  label: string | number;
  value: string | number;
}

// Props
const {
  helpText = '',
  label = '',
  name,
  disabled = false,
  bold = true,
  options,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  disabled?: boolean;
  bold?: boolean;
  options: readonly (RadioOptionObject | string)[] | undefined;
  required?: boolean;
}>();

// Emits
const emit = defineEmits<{
  change: [value: string];
  click: [value: string];
}>();

// State
const { errorMessage, handleBlur, value, resetField } = useField<string>(name);

// Actions
function isRadioListOptionObject(option: RadioOptionObject | string): option is RadioOptionObject {
  return typeof option === 'object' && option !== null && 'label' in option && 'value' in option;
}

function getRadioListOptionLabel(option: RadioOptionObject | string): string {
  return isRadioListOptionObject(option) ? option.label.toString() : option;
}

function getRadioListOptionValue(option: RadioOptionObject | string): string {
  return isRadioListOptionObject(option) ? option.value.toString() : option;
}

watch(value, () => {
  emit('change', value.value);
});

onBeforeMount(() => {
  resetField({ touched: false });
});
</script>

<template>
  <div>
    <label
      v-if="label"
      :id="`${name}-label`"
      :class="{ 'font-bold': bold }"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-[var(--p-support-required-text)]"
      >
        *
      </span>
    </label>
    <div
      class="flex flex-col gap-4"
      role="radiogroup"
      :aria-labelledby="label ? `${name}-label` : undefined"
      :aria-required="required"
    >
      <div
        v-for="option in options"
        :key="getRadioListOptionValue(option)"
        class="flex flex-col items-start"
      >
        <div class="my-0">
          <RadioButton
            v-model="value"
            :aria-describedby="`${name}-help`"
            :aria-labelledby="`${name}-option-${getRadioListOptionValue(option)}`"
            :input-id="`${name}-${getRadioListOptionValue(option)}`"
            :name="name"
            :value="getRadioListOptionValue(option)"
            :invalid="!!errorMessage"
            :disabled="disabled"
            @blur="handleBlur"
            @click="emit('click', value)"
          />
          <label
            :id="`${name}-option-${getRadioListOptionValue(option)}`"
            :for="`${name}-${getRadioListOptionValue(option)}`"
            class="ml-2 mb-0"
          >
            {{ getRadioListOptionLabel(option) }}
          </label>
        </div>
      </div>
    </div>

    <small :id="`${name}-help`">{{ helpText }}</small>
    <div class="mt-2">
      <ErrorMessage
        :name="name"
        class="app-error-message"
      />
    </div>
  </div>
</template>
