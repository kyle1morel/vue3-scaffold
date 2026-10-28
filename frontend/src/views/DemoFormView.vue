<script setup lang="ts">
import { isAxiosError } from 'axios';
import { format, parseISO } from 'date-fns';
import { useForm } from 'vee-validate';
import { onMounted, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
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
import { Spinner } from '@/components/layout';
import { Button, Message, useToast } from '@/lib/primevue';
import { createSubmission, getSubmission } from '@/services';
import { RouteName } from '@/utils/enums/application';
import { formatDateLong } from '@/utils/formatters';
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
import type { Submission } from '@/types';

// Props
// A submission id shows that saved submission in the form, read only
const { submissionId = undefined } = defineProps<{
  submissionId?: string;
}>();

// Constants
const CITIES = ['Kamloops', 'Kelowna', 'Nanaimo', 'Prince George', 'Vancouver', 'Victoria'] as const;
const CONTACT_METHODS = ['email', 'phone'] as const;
const PROVINCES = ['AB', 'BC', 'SK'] as const;

// Composables
const router = useRouter();
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
  city: optionalTextSchema(field('city'), 255),
  category: optionalTextSchema(field('category'), 100),
  comments: optionalTextSchema(field('comments'), 1000),
  notes: optionalTextSchema(field('notes'), 10000),
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
const loadError = ref<string>();
const readOnly = !!submissionId;
const submission = ref<Submission>();

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

// Only submitting saves to the API, so a draft save just records the time
function saveDraft() {
  lastSaved.value = new Date();
}

async function loadSubmission(id: string) {
  try {
    submission.value = await getSubmission(id);
  } catch (e) {
    loadError.value =
      isAxiosError(e) && e.response?.status === 404
        ? t('views.demoForm.errors.notFound')
        : t('views.demoForm.errors.load');
    return;
  }

  const s = submission.value;
  // The password isn't saved, and the terms were accepted to submit
  resetForm({
    values: {
      firstName: s.firstName,
      email: s.email,
      phone: s.phone,
      province: s.province,
      contactMethod: s.contactMethod,
      // A date-only value arrives as midnight UTC, so parse its date part as a local date
      startDate: s.startDate ? parseISO(s.startDate.slice(0, 10)) : null,
      quantity: s.quantity,
      city: s.city,
      category: s.category,
      comments: s.comments,
      notes: s.notes,
      agree: true
    }
  });
}

onMounted(() => {
  if (submissionId) loadSubmission(submissionId);
});

const onSubmit = handleSubmit(
  async (values) => {
    try {
      // The password and terms only demonstrate their components, so they aren't saved
      await createSubmission({
        firstName: values.firstName,
        email: values.email,
        phone: values.phone,
        province: values.province,
        contactMethod: values.contactMethod,
        startDate: values.startDate ? format(values.startDate, 'yyyy-MM-dd') : null,
        quantity: values.quantity,
        city: values.city,
        category: values.category,
        comments: values.comments,
        notes: values.notes
      });
    } catch {
      toast.error(t('views.demoForm.errors.save'));
      return;
    }

    toast.success(t('views.demoForm.submitted.title'), t('views.demoForm.submitted.detail'));
    // Clears the dirty state, so the navigation guard lets the user leave
    resetForm();
    router.push({ name: RouteName.SUBMISSIONS });
  },
  ({ errors }) => scrollToFirstError(errors as Record<string, string>)
);
</script>

<template>
  <div class="flex items-center gap-4">
    <h2>{{ t('views.demoForm.title') }}</h2>
    <template v-if="!readOnly">
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
    </template>
  </div>

  <Message
    v-if="loadError"
    severity="error"
  >
    {{ loadError }}
  </Message>
  <Spinner v-else-if="readOnly && !submission" />
  <template v-else>
    <p v-if="submission">{{ t('views.demoForm.submittedOn', { date: formatDateLong(submission.createdAt) }) }}</p>
    <p v-else>{{ t('views.demoForm.intro') }}</p>
  </template>

  <form
    v-if="!readOnly || submission"
    class="grid grid-cols-12 gap-x-6 gap-y-2"
    novalidate
    @submit="onSubmit"
  >
    <template v-if="!readOnly">
      <FormNavigationGuard :auto-save-ref="autoSave" />
      <FormAutosave
        ref="autoSave"
        :callback="saveDraft"
        :delay="5000"
      />
    </template>

    <SectionHeader :title="t('views.demoForm.sections.contact')" />
    <InputText
      class="col-span-12 md:col-span-6"
      name="firstName"
      :disabled="readOnly"
      :label="field('firstName')"
      :tooltip="t('views.demoForm.help.firstName')"
      required
    />
    <InputText
      class="col-span-12 md:col-span-6"
      name="email"
      :disabled="readOnly"
      :label="field('email')"
      required
    />
    <InputMask
      class="col-span-12 md:col-span-6"
      name="phone"
      :disabled="readOnly"
      :label="field('phone')"
      mask="(999) 999-9999"
      :placeholder="t('views.demoForm.placeholders.phone')"
    />
    <Password
      v-if="!readOnly"
      class="col-span-12 md:col-span-6"
      name="password"
      :label="field('password')"
      :help-text="t('views.demoForm.help.password')"
      required
    />
    <Select
      class="col-span-12 md:col-span-6"
      name="province"
      :disabled="readOnly"
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
      :disabled="readOnly"
      :label="field('contactMethod')"
      :options="contactMethods"
      required
    />

    <SectionHeader :title="t('views.demoForm.sections.details')" />
    <DatePicker
      class="col-span-12 md:col-span-6"
      name="startDate"
      :disabled="readOnly"
      :label="field('startDate')"
      :max-date="new Date()"
    />
    <InputNumber
      class="col-span-12 md:col-span-6"
      name="quantity"
      :disabled="readOnly"
      :label="field('quantity')"
      :help-text="t('views.demoForm.help.quantity')"
    />
    <AutoComplete
      class="col-span-12 md:col-span-6"
      name="city"
      :disabled="readOnly"
      :label="field('city')"
      :placeholder="t('views.demoForm.placeholders.city')"
      :suggestions="citySuggestions"
      @complete="filterCities"
    />
    <EditableSelect
      class="col-span-12 md:col-span-6"
      name="category"
      :disabled="readOnly"
      :label="field('category')"
      :options="categories"
      get-option-label="label"
      option-value="value"
      :placeholder="t('views.demoForm.placeholders.category')"
    />
    <TextArea
      class="col-span-12"
      name="comments"
      :disabled="readOnly"
      :label="field('comments')"
      :tooltip="t('views.demoForm.help.comments')"
    />

    <SectionHeader :title="t('views.demoForm.sections.notes')" />
    <Editor
      class="col-span-12"
      name="notes"
      :disabled="readOnly"
      :help-text="t('views.demoForm.help.notes')"
    />

    <Checkbox
      class="col-span-12 mt-4"
      name="agree"
      :disabled="readOnly"
      :label="field('agree')"
    />
    <div
      v-if="!readOnly"
      class="col-span-12 flex mt-4"
    >
      <Button
        type="submit"
        :label="t('ui.actions.submit')"
        icon="pi pi-check"
      />
      <CancelButton @clicked="resetForm()" />
    </div>
  </form>

  <Button
    v-if="readOnly"
    class="mt-6"
    as="router-link"
    :to="{ name: RouteName.SUBMISSIONS }"
    :label="t('views.demoForm.back')"
    icon="pi pi-arrow-left"
    outlined
  />
</template>
