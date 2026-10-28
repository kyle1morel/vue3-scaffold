<script setup lang="ts">
import { useForm } from 'vee-validate';
import { ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { z } from 'zod';

import StatusPill from '@/components/common/StatusPill.vue';
import {
  AutoComplete,
  CancelButton,
  Checkbox,
  DatePicker,
  EditableSelect,
  Editor,
  FormAutosave,
  FormNavigationGuard,
  InputMask,
  InputNumber,
  InputText,
  Password,
  RadioList,
  SectionHeader,
  Select,
  TextArea
} from '@/components/form';
import { Button, useToast } from '@/lib/primevue';
import { scrollToFirstError } from '@/utils/utils';
import {
  notInFutureSchema,
  numberRangeSchema,
  optionalTextSchema,
  requiredMessage,
  requiredOneOf,
  requiredTextSchema,
  toTypedSchema
} from '@/utils/zodSchema';

import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete';
import type { MessageSchema } from '@/i18n';

// Constants
const CITIES = ['Kamloops', 'Kelowna', 'Nanaimo', 'Prince George', 'Vancouver', 'Victoria'] as const;
const CONTACT_METHODS = ['email', 'phone'] as const;
const PROVINCES = ['AB', 'BC', 'SK'] as const;

// Composables
const { t } = useI18n();
const toast = useToast();

// Typed from the locale file, so a misspelled field name fails to compile
const field = (name: keyof MessageSchema['views']['demoForm']['fields']) => t(`views.demoForm.fields.${name}`);

const schema = z.object({
  firstName: requiredTextSchema(field('firstName'), 255),
  email: z.email(t('views.demoForm.errors.email')),
  phone: optionalTextSchema(field('phone')),
  password: z
    .string(requiredMessage(field('password')))
    .min(8, t('validation.minLength', { label: field('password'), min: 8 })),
  province: requiredOneOf(field('province'), PROVINCES),
  contactMethod: requiredOneOf(field('contactMethod'), CONTACT_METHODS),
  startDate: notInFutureSchema(field('startDate')),
  quantity: numberRangeSchema(field('quantity'), 1, 100),
  city: optionalTextSchema(field('city')),
  category: optionalTextSchema(field('category'), 100),
  comments: optionalTextSchema(field('comments'), 1000),
  notes: optionalTextSchema(field('notes')),
  agree: z.boolean().refine((agreed) => agreed, t('views.demoForm.errors.agree'))
});

// The Checkbox component sets a missing value to false, which would otherwise mark the form dirty on load
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: { agree: false }
});

// State
const autoSave = useTemplateRef('autoSave');
const citySuggestions = ref<string[]>([]);
const lastSaved = ref<Date>();

// Picked categories save their value; typed-in categories save the text as entered
const categories = [
  { label: t('views.demoForm.options.categories.feedback'), value: 'feedback' },
  { label: t('views.demoForm.options.categories.question'), value: 'question' },
  { label: t('views.demoForm.options.categories.request'), value: 'request' }
];
const contactMethods = [
  { label: t('views.demoForm.options.contactMethods.email'), value: 'email' },
  { label: t('views.demoForm.options.contactMethods.phone'), value: 'phone' }
];
const provinces = [
  { label: t('views.demoForm.options.provinces.alberta'), value: 'AB' },
  { label: t('views.demoForm.options.provinces.britishColumbia'), value: 'BC' },
  { label: t('views.demoForm.options.provinces.saskatchewan'), value: 'SK' }
];

// Actions
function filterCities(event: AutoCompleteCompleteEvent) {
  citySuggestions.value = CITIES.filter((city) => city.toLowerCase().includes(event.query.toLowerCase()));
}

// Front end only, so a draft save just records the time
function saveDraft() {
  lastSaved.value = new Date();
}

const onSubmit = handleSubmit(
  (submitted) => {
    // Nothing is sent anywhere, so log the parsed values for inspection
    console.log(submitted); // eslint-disable-line no-console
    toast.success(t('views.demoForm.submitted.title'), t('views.demoForm.submitted.detail'));
    // Resetting to the submitted values clears the dirty state, so the navigation guard lets the user leave
    resetForm({ values: submitted });
  },
  ({ errors }) => scrollToFirstError(errors as Record<string, string>)
);
</script>

<template>
  <div class="flex items-center gap-4">
    <h2>{{ t('views.demoForm.title') }}</h2>
    <StatusPill
      v-if="meta.dirty"
      :status="t('views.demoForm.status.unsaved')"
      bg-color="var(--p-support-warning-surface)"
      border-color="var(--p-support-warning-border)"
    />
    <StatusPill
      v-else-if="lastSaved"
      :status="t('views.demoForm.status.saved', { time: lastSaved.toLocaleTimeString() })"
      bg-color="var(--p-support-success-surface)"
      border-color="var(--p-support-success-border)"
    />
  </div>
  <p>{{ t('views.demoForm.intro') }}</p>

  <form
    class="grid grid-cols-12 gap-x-6 gap-y-2"
    novalidate
    @submit="onSubmit"
  >
    <FormNavigationGuard :auto-save-ref="autoSave" />
    <FormAutosave
      ref="autoSave"
      :callback="saveDraft"
      :delay="5000"
    />

    <SectionHeader :title="t('views.demoForm.sections.contact')" />
    <InputText
      class="col-span-12 md:col-span-6"
      name="firstName"
      :label="field('firstName')"
      :tooltip="t('views.demoForm.help.firstName')"
      required
    />
    <InputText
      class="col-span-12 md:col-span-6"
      name="email"
      :label="field('email')"
      required
    />
    <InputMask
      class="col-span-12 md:col-span-6"
      name="phone"
      :label="field('phone')"
      mask="(999) 999-9999"
      :placeholder="t('views.demoForm.placeholders.phone')"
    />
    <Password
      class="col-span-12 md:col-span-6"
      name="password"
      :label="field('password')"
      :help-text="t('views.demoForm.help.password')"
      required
    />
    <Select
      class="col-span-12 md:col-span-6"
      name="province"
      :label="field('province')"
      :options="provinces"
      option-label="label"
      option-value="value"
      :placeholder="t('views.demoForm.placeholders.province')"
      required
    />
    <RadioList
      class="col-span-12 md:col-span-6"
      name="contactMethod"
      :label="field('contactMethod')"
      :options="contactMethods"
      required
    />

    <SectionHeader :title="t('views.demoForm.sections.details')" />
    <DatePicker
      class="col-span-12 md:col-span-6"
      name="startDate"
      :label="field('startDate')"
      :max-date="new Date()"
    />
    <InputNumber
      class="col-span-12 md:col-span-6"
      name="quantity"
      :label="field('quantity')"
      :help-text="t('views.demoForm.help.quantity')"
    />
    <AutoComplete
      class="col-span-12 md:col-span-6"
      name="city"
      :label="field('city')"
      :placeholder="t('views.demoForm.placeholders.city')"
      :suggestions="citySuggestions"
      @complete="filterCities"
    />
    <EditableSelect
      class="col-span-12 md:col-span-6"
      name="category"
      :label="field('category')"
      :options="categories"
      get-option-label="label"
      option-value="value"
      :placeholder="t('views.demoForm.placeholders.category')"
    />
    <TextArea
      class="col-span-12"
      name="comments"
      :label="field('comments')"
      :tooltip="t('views.demoForm.help.comments')"
    />

    <SectionHeader :title="t('views.demoForm.sections.notes')" />
    <Editor
      class="col-span-12"
      name="notes"
      :help-text="t('views.demoForm.help.notes')"
    />

    <Checkbox
      class="col-span-12 mt-4"
      name="agree"
      :label="field('agree')"
    />
    <div class="col-span-12 flex mt-4">
      <Button
        type="submit"
        :label="t('ui.actions.submit')"
        icon="pi pi-check"
      />
      <CancelButton @clicked="resetForm()" />
    </div>
  </form>
</template>
