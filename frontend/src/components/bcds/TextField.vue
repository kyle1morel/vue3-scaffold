<script setup lang="ts">
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
  name = undefined,
  placeholder = undefined,
  readonly = false,
  required = false,
  size = 'medium',
  type = 'text'
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // FontAwesome icons shown inside the box, such as fa-solid fa-magnifying-glass
  iconLeft?: string;
  iconRight?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  size?: 'medium' | 'small';
  type?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
}>();

// Any element, so a caller can put a button there
defineSlots<{ iconRight?(): unknown }>();

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
      :class="{ 'app-input-small': size === 'small', 'app-input-invalid': invalid, 'app-input-readonly': readonly }"
      :data-disabled="disabled || undefined"
    >
      <font-awesome-icon
        v-if="iconLeft"
        :icon="iconLeft"
      />
      <input
        :id
        v-model="value"
        v-bind="inputAttrs"
        :aria-invalid="invalid || undefined"
        :disabled
        :name
        :placeholder
        :readonly
        :type
      />
      <font-awesome-icon
        v-if="invalid"
        class="text-[var(--icons-color-danger)]"
        icon="fa-solid fa-triangle-exclamation"
      />
      <slot name="iconRight">
        <font-awesome-icon
          v-if="iconRight"
          :icon="iconRight"
        />
      </slot>
    </div>
  </FieldWrapper>
</template>
