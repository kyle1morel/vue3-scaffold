<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';

import { RadioButton } from '@/lib/primevue';

import FormField from './FormField.vue';

// Interfaces
interface RadioOption {
  label: string | number;
  value: string | number;
}

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  disabled = false,
  options,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  disabled?: boolean;
  options: readonly (RadioOption | string)[];
  required?: boolean;
}>();

// Emits
const emit = defineEmits<{ change: [value: string | number] }>();

// State
const { errorMessage, handleBlur, value } = useField<string | number | undefined>(() => name);

const radioOptions = computed(() =>
  options.map((option) => (typeof option === 'string' ? { label: option, value: option } : option))
);
</script>

<template>
  <!-- The legend names the group; aria-required isn't valid on a fieldset, so each radio is marked required instead -->
  <FormField
    v-slot="{ id, inputAttrs, invalid, listeners }"
    :error="errorMessage"
    :help-text
  >
    <fieldset v-bind="{ ...listeners, ...inputAttrs }">
      <legend
        v-if="label"
        class="font-bold"
      >
        {{ label }}
        <span
          v-if="required"
          aria-hidden="true"
          class="text-[var(--p-support-required-text)]"
        >
          *
        </span>
      </legend>
      <div class="flex flex-col gap-4">
        <div
          v-for="(option, index) in radioOptions"
          :key="option.value"
          class="flex items-center"
        >
          <RadioButton
            v-model="value"
            :disabled
            :input-id="`${id}-${index}`"
            :invalid
            :name
            :pt="{ input: { required: required || undefined } }"
            :value="option.value"
            @blur="handleBlur"
            @change="emit('change', option.value)"
          />
          <label
            class="ml-2 mb-0"
            :for="`${id}-${index}`"
          >
            {{ option.label }}
          </label>
        </div>
      </div>
    </fieldset>
  </FormField>
</template>
