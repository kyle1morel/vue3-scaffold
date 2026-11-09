<script setup lang="ts">
import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  maxLength = undefined,
  name = undefined,
  placeholder = undefined,
  readonly = false,
  required = false,
  rows = 5
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  // Stops typing at this many characters, with a count of them under the box
  maxLength?: number;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
}>();

const value = defineModel<string>();
</script>

<template>
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    :description
    error-icon
    :error-message
    :counter="maxLength ? `${value?.length ?? 0}/${maxLength}` : undefined"
    :label
    :required
  >
    <div
      class="app-input bcds-text-area"
      :class="{ 'app-input-invalid': invalid, 'app-input-readonly': readonly }"
      :data-disabled="disabled || undefined"
    >
      <textarea
        :id
        v-model="value"
        v-bind="inputAttrs"
        :aria-invalid="invalid || undefined"
        :disabled
        :maxlength="maxLength"
        :name
        :placeholder
        :readonly
        :rows
      />
    </div>
  </FieldWrapper>
</template>

<style scoped>
@layer components {
  /* The shared box is sized for one line; this one grows with its rows. */
  .bcds-text-area {
    height: auto;
    align-items: stretch;
  }

  .bcds-text-area textarea {
    resize: vertical;
  }
}
</style>
