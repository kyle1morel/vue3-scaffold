<script lang="ts">
import type { InjectionKey } from 'vue';

// The TagList inside shows the remove buttons and reports removals through its TagGroup.
export const TAG_GROUP: InjectionKey<{ disabled: boolean; remove: (id: string) => void; removable: boolean }> =
  Symbol('TagGroup');
</script>

<script setup lang="ts">
import { provide } from 'vue';

import FieldWrapper from './FieldWrapper.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  removable = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  // Gives each tag a remove button
  removable?: boolean;
}>();

// Emits
const emit = defineEmits<{ remove: [id: string] }>();

defineSlots<{ default(): unknown }>();

// Provide
provide(TAG_GROUP, {
  get disabled() {
    return disabled;
  },
  remove: (id) => emit('remove', id),
  get removable() {
    return removable;
  }
});
</script>

<template>
  <!-- The label names the group and the description and error describe it, as no single control can take them. -->
  <FieldWrapper
    v-slot="{ inputAttrs, labelId }"
    v-bind="$attrs"
    class="bcds-tag-group"
    :description
    error-icon
    :error-message
    :label
    non-labelable
  >
    <div
      v-bind="inputAttrs"
      :aria-labelledby="labelId"
      role="group"
    >
      <slot />
    </div>
  </FieldWrapper>
</template>

<style scoped>
@layer components {
  .bcds-tag-group {
    color: var(--typography-color-primary);
    font: var(--typography-regular-small-body);
  }
}
</style>
