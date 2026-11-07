<script setup lang="ts">
import InputMask from 'primevue/inputmask';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  iconLeft = undefined,
  iconRight = undefined,
  label = undefined,
  mask = undefined,
  name = undefined,
  placeholder = undefined,
  readonly = false,
  required = false,
  size = 'medium'
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // FontAwesome icons shown inside the box, such as fa-solid fa-magnifying-glass
  iconLeft?: string;
  iconRight?: string;
  label?: string;
  // Formats the text as it's typed, such as (999) 999-9999
  mask?: string;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  size?: 'medium' | 'small';
}>();

const value = defineModel<string>();
</script>

<template>
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    :description
    :error-message
    :label
    :required
  >
    <div
      class="app-input"
      :class="[size, { invalid, readonly }]"
      :data-disabled="disabled || undefined"
    >
      <font-awesome-icon
        v-if="iconLeft"
        :icon="iconLeft"
      />
      <!-- Unstyled, so the mask's input looks like the plain one -->
      <InputMask
        v-if="mask"
        :id
        v-model="value"
        :disabled
        :invalid
        :mask
        :name
        :placeholder
        :pt="{ root: { ...inputAttrs, 'aria-invalid': invalid || undefined } }"
        :readonly
        unstyled
      />
      <input
        v-else
        :id
        v-model="value"
        v-bind="inputAttrs"
        :aria-invalid="invalid || undefined"
        :disabled
        :name
        :placeholder
        :readonly
      />
      <font-awesome-icon
        v-if="invalid"
        class="text-[var(--icons-color-danger)]"
        icon="fa-solid fa-triangle-exclamation"
      />
      <font-awesome-icon
        v-if="iconRight"
        :icon="iconRight"
      />
    </div>
  </FieldWrapper>
</template>
