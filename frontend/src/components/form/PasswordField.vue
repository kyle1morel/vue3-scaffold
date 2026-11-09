<script setup lang="ts">
import { useField } from 'vee-validate';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BcdsButton from '@/components/bcds/Button.vue';
import BcdsTextField from '@/components/bcds/TextField.vue';

// BC has no password component, so this is its TextField as a password, plus the show/hide button BC leaves to apps.

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  name,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  name: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
}>();

// Composables
const { t } = useI18n();

// State
const { errorMessage, handleBlur, value } = useField<string | undefined>(() => name);
const shown = ref(false);
</script>

<template>
  <BcdsTextField
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :name
    :placeholder
    :readonly
    :required
    :type="shown ? 'text' : 'password'"
    @blur="handleBlur"
  >
    <template #iconRight>
      <BcdsButton
        :aria-pressed="shown"
        :disabled
        :icon="shown ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
        icon-only
        :label="shown ? t('components.passwordField.hide') : t('components.passwordField.show')"
        size="xsmall"
        variant="tertiary"
        @click="shown = !shown"
      />
    </template>
  </BcdsTextField>
</template>
