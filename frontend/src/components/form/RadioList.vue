<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

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
  readonly = false,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  disabled?: boolean;
  options: readonly (RadioOption | string)[];
  readonly?: boolean;
  required?: boolean;
}>();

// Emits
const emit = defineEmits<{ change: [value: string | number] }>();

// Composables
const { t } = useI18n();

// State
const { errorMessage, handleBlur, value } = useField<string | number | undefined>(() => name);

const radioOptions = computed(() =>
  options.map((option) => (typeof option === 'string' ? { label: option, value: option } : option))
);

// Actions
// PrimeVue's readonly only skips the update, so the click is cancelled to stop the native radio changing
function preventChange(event: Event) {
  if (readonly) event.preventDefault();
}
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
        class="app-field-label"
      >
        {{ label }}
        <span
          v-if="required"
          class="app-field-required"
        >
          {{ t('components.formField.required') }}
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
            :pt="{ input: { required: required || undefined, onClick: preventChange } }"
            :readonly
            :value="option.value"
            @blur="handleBlur"
            @change="emit('change', option.value)"
          />
          <label
            class="ml-2 mb-0"
            :class="{ 'cursor-not-allowed': readonly }"
            :for="`${id}-${index}`"
          >
            {{ option.label }}
          </label>
        </div>
      </div>
    </fieldset>
  </FormField>
</template>
