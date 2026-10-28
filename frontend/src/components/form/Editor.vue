<script setup lang="ts">
import { ErrorMessage, useField } from 'vee-validate';

import { Editor } from '@/lib/primevue';

// Props
const {
  disabled = false,
  helpText = '',
  name,
  height = '160px'
} = defineProps<{
  disabled?: boolean;
  helpText?: string;
  name: string;
  height?: string;
}>();

const { errorMessage, handleBlur, value } = useField<string>(name);
</script>

<template>
  <div>
    <Editor
      v-model="value"
      :editor-style="`height: ${height}`"
      :readonly="disabled"
      :pt="{ toolbar: { class: { hidden: disabled } } }"
      @blur="handleBlur"
    />

    <small :id="`${name}-help`">{{ helpText }}</small>
    <div>
      <ErrorMessage
        :aria-describedby="`${name}-help`"
        :name="name"
        class="w-full"
        :class="{ 'p-invalid': errorMessage }"
      />
    </div>
  </div>
</template>
