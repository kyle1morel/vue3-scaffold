<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref } from 'vue';

import { Editor } from '@/lib/primevue';

import FormField from './FormField.vue';

import type { EditorSelectionChangeEvent } from 'primevue/editor';
import type { DirectiveBinding } from 'vue';

// Props
const {
  disabled = false,
  helpText = undefined,
  label = undefined,
  name,
  height = '160px',
  required = false
} = defineProps<{
  disabled?: boolean;
  helpText?: string;
  label?: string;
  name: string;
  height?: string;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<string | undefined>(() => name);
const loaded = ref(false);

// Actions
// Quill builds its editable element itself, out of reach of pt, so the field's attributes are copied onto it
function setEditableAttrs(el: HTMLElement, { value }: DirectiveBinding<Record<string, unknown> | false>) {
  const editable = el.querySelector('.ql-editor');
  if (!editable || !value) return;

  for (const [key, val] of Object.entries(value)) {
    if (val === undefined) editable.removeAttribute(key);
    else editable.setAttribute(key, String(val));
  }
}

const vEditableAttrs = { mounted: setEditableAttrs, updated: setEditableAttrs };
</script>

<template>
  <FormField
    v-slot="{ inputAttrs, invalid, labelId, listeners }"
    :error="errorMessage"
    :help-text
    :label
    non-labelable
    :required
  >
    <!-- The name lets focusFirstError find the editable element -->
    <div
      v-editable-attrs="
        loaded && {
          ...inputAttrs,
          'aria-invalid': invalid || undefined,
          'aria-labelledby': labelId,
          'aria-multiline': 'true',
          name,
          role: 'textbox'
        }
      "
    >
      <!-- Editor emits no blur, so a cleared selection marks it touched -->
      <Editor
        v-model="value"
        v-bind="listeners"
        :editor-style="`height: ${height}`"
        :pt="{ toolbar: { class: { hidden: disabled } } }"
        :readonly="disabled"
        @load="loaded = true"
        @selection-change="(e: EditorSelectionChangeEvent) => !e.range && handleBlur()"
      />
    </div>
  </FormField>
</template>
