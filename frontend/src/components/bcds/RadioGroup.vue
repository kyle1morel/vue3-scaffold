<script setup lang="ts">
import RadioButton from 'primevue/radiobutton';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  name = undefined,
  options,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  name?: string;
  // A plain string is both the label and the value
  options: readonly ({ label: string | number; value: string | number } | string)[];
  readonly?: boolean;
  required?: boolean;
}>();

// Emits
// Blur doesn't bubble to the fieldset, so each radio reports its own
const emit = defineEmits<{ blur: [event: Event] }>();

const value = defineModel<string | number>();

// Composables
const { t } = useI18n();

// State
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
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    :description
    :error-message
  >
    <fieldset v-bind="inputAttrs">
      <legend
        v-if="label"
        class="app-field-label"
      >
        {{ label }}
        <span
          v-if="required"
          class="app-field-required"
        >
          {{ t('components.fieldWrapper.required') }}
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
            @blur="(e: Event) => emit('blur', e)"
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
  </FieldWrapper>
</template>
