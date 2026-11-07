<script setup lang="ts">
import Editor from 'primevue/editor';
import { ref } from 'vue';

import FieldWrapper from './FieldWrapper.vue';

import type { EditorSelectionChangeEvent } from 'primevue/editor';
import type { DirectiveBinding } from 'vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  height = '160px',
  label = undefined,
  name = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  height?: string;
  label?: string;
  name?: string;
  readonly?: boolean;
  required?: boolean;
}>();

// Emits
// Quill has no blur event, so a cleared selection stands in for one
const emit = defineEmits<{ blur: [] }>();

const value = defineModel<string>();

// State
const loaded = ref(false);

// Actions
// Quill builds its editable element itself, out of reach of pt, so the field's attributes are copied onto it;
// listeners can't be set as attributes, so they're skipped
function setEditableAttrs(el: HTMLElement, { value }: DirectiveBinding<Record<string, unknown> | false>) {
  const editable = el.querySelector('.ql-editor');
  if (!editable || !value) return;

  for (const [key, val] of Object.entries(value)) {
    if (typeof val === 'function') continue;
    if (val === undefined) editable.removeAttribute(key);
    else editable.setAttribute(key, String(val));
  }
}

const vEditableAttrs = { mounted: setEditableAttrs, updated: setEditableAttrs };
</script>

<template>
  <FieldWrapper
    v-slot="{ inputAttrs, invalid, labelId }"
    v-bind="$attrs"
    :description
    error-icon
    :error-message
    :label
    non-labelable
    :required
  >
    <!-- The name lets focusFirstError find the editable element; Quill drops contenteditable when read only, so a
         read-only editor needs its own tab stop -->
    <div
      v-editable-attrs="
        loaded && {
          ...inputAttrs,
          'aria-invalid': invalid || undefined,
          'aria-labelledby': labelId,
          'aria-multiline': 'true',
          'aria-readonly': readonly || undefined,
          name,
          role: 'textbox',
          tabindex: readonly ? 0 : undefined
        }
      "
    >
      <Editor
        v-model="value"
        :editor-style="`height: ${height}`"
        :pt="{ toolbar: { class: { hidden: disabled || readonly } } }"
        :readonly="disabled || readonly"
        @load="loaded = true"
        @selection-change="(e: EditorSelectionChangeEvent) => !e.range && emit('blur')"
      />
    </div>
  </FieldWrapper>
</template>
