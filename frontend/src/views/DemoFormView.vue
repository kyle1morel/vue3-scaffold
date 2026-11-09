<script setup lang="ts">
import { isAxiosError } from 'axios';
import { format, parseISO } from 'date-fns';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { z } from 'zod';

import { Button, InlineAlert, Tag } from '@/components/bcds';
import Card from '@/components/common/Card.vue';
import {
  CancelButton,
  Checkbox,
  ComboBox,
  DatePicker,
  MaskedField,
  NumberField,
  PasswordField,
  RadioGroup,
  SectionHeader,
  Select,
  TextArea,
  TextField
} from '@/components/form';
import { Spinner } from '@/components/layout';
import { useBreadcrumb } from '@/composables/useBreadcrumb';
import { useFormNavigationGuard } from '@/composables/useFormNavigationGuard';
import { useToast } from '@/composables/useToast';
import { createSubmission, getSubmission } from '@/services';
import { RouteName } from '@/utils/enums';
import { formatDateLong } from '@/utils/formatters';
import { focusFirstError, rethrowAs } from '@/utils/utils';
import {
  blankOrOneOfSchema,
  notInFutureSchema,
  numberRangeSchema,
  optionalTextSchema,
  requiredMessage,
  requiredOneOf,
  requiredTextSchema,
  toTypedSchema
} from '@/utils/zodSchema';

import type { MessageSchema } from '@/i18n';
import type { Submission } from '@/types';

// Props
// A submission id shows that saved submission in the form, read only.
const { submissionId = undefined } = defineProps<{
  submissionId?: string;
}>();

// Constants
const CATEGORIES = ['feedback', 'question', 'request'] as const;
const CITIES = ['Kamloops', 'Kelowna', 'Nanaimo', 'Prince George', 'Vancouver', 'Victoria'] as const;
const CONTACT_METHODS = ['email', 'phone'] as const;
// What the phone field's mask makes a full number
const PHONE = /^\(\d{3}\) \d{3}-\d{4}$/;
const PROVINCES = ['AB', 'BC', 'SK'] as const;

// Composables
const router = useRouter();
const { t } = useI18n();
const toast = useToast();

// Typed from the locale file, so a misspelled field name fails to compile.
const field = (name: keyof MessageSchema['views']['demoForm']['fields']) => t(`views.demoForm.fields.${name}`);

const schema = z.object({
  firstName: requiredTextSchema(field('firstName'), 255),
  email: z.email(t('views.demoForm.errors.email')),
  phone: optionalTextSchema(field('phone')).refine(
    (phone) => !phone || PHONE.test(phone),
    t('views.demoForm.errors.phone')
  ),
  password: z
    .string(requiredMessage(field('password')))
    .min(8, t('validation.minLength', { label: field('password'), min: 8 })),
  province: requiredOneOf(field('province'), PROVINCES),
  contactMethod: requiredOneOf(field('contactMethod'), CONTACT_METHODS),
  startDate: notInFutureSchema(field('startDate')),
  quantity: numberRangeSchema(field('quantity'), 1, 100),
  city: optionalTextSchema(field('city'), 255),
  category: blankOrOneOfSchema(field('category'), CATEGORIES),
  comments: optionalTextSchema(field('comments'), 1000),
  agree: z.boolean().refine((agreed) => agreed, t('views.demoForm.errors.agree'))
});

// Unticked terms start as false, not missing, so they fail with the terms message rather than a type error.
const { handleSubmit, meta, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: { agree: false }
});

// State
const citySuggestions = ref<string[]>([]);
const loadError = ref<string>();
const readOnly = !!submissionId;
// A read-only form has nothing to lose, even when its fields unmount while the next submission loads.
useFormNavigationGuard(() => !readOnly && meta.value.dirty);
const submission = ref<Submission>();
// A saved submission's crumb is the submitter's name, with no trail while it loads and the route's label if it can't.
useBreadcrumb(() => submission.value?.firstName ?? (readOnly && !loadError.value ? null : undefined));

const categories = [
  { id: 'feedback', label: t('views.demoForm.options.categories.feedback') },
  { id: 'question', label: t('views.demoForm.options.categories.question') },
  { id: 'request', label: t('views.demoForm.options.categories.request') }
];
const contactMethods = [
  { label: t('views.demoForm.options.contactMethods.email'), value: 'email' },
  { label: t('views.demoForm.options.contactMethods.phone'), value: 'phone' }
];
const provinces = [
  { id: 'AB', label: t('views.demoForm.options.provinces.alberta') },
  { id: 'BC', label: t('views.demoForm.options.provinces.britishColumbia') },
  { id: 'SK', label: t('views.demoForm.options.provinces.saskatchewan') }
];

// Actions
function filterCities(query: string) {
  citySuggestions.value = CITIES.filter((city) => city.toLowerCase().includes(query.toLowerCase()));
}

async function loadSubmission(id: string) {
  try {
    const loaded = await getSubmission(id);
    // A slower response for an earlier id mustn't replace the current one.
    if (id !== submissionId) return;
    submission.value = loaded;
  } catch (e) {
    if (id !== submissionId) return;
    loadError.value =
      isAxiosError(e) && e.response?.status === 404
        ? t('views.demoForm.errors.notFound')
        : t('views.demoForm.errors.load');
    return;
  }

  const s = submission.value;
  // The password isn't saved, and the terms were accepted to submit.
  resetForm({
    values: {
      firstName: s.firstName,
      email: s.email,
      phone: s.phone,
      province: s.province,
      contactMethod: s.contactMethod,
      // A date-only value arrives as midnight UTC, so parse its date part as a local date.
      startDate: s.startDate ? parseISO(s.startDate.slice(0, 10)) : null,
      quantity: s.quantity,
      city: s.city,
      category: s.category,
      comments: s.comments,
      agree: true
    }
  });
}

// The view stays mounted when the route only changes its id, so each new id loads afresh.
watch(
  () => submissionId,
  (id) => {
    submission.value = undefined;
    loadError.value = undefined;
    if (id) loadSubmission(id);
  },
  { immediate: true }
);

const onSubmit = handleSubmit(
  async (values) => {
    // The password and terms only demonstrate their components, so they aren't saved.
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
      comments: values.comments
    }).catch(rethrowAs(t('views.demoForm.errors.save')));

    toast.success(t('views.demoForm.submitted.title'), t('views.demoForm.submitted.detail'));
    // Clears the dirty state, so the navigation guard lets the user leave.
    resetForm();
    router.push({ name: RouteName.SUBMISSIONS });
  },
  ({ errors }) => focusFirstError(errors as Record<string, string>)
);
</script>

<template>
  <div class="flex items-center gap-4">
    <h1>{{ t('views.demoForm.title') }}</h1>
    <Tag
      v-if="readOnly"
      color="green"
    >
      {{ t('views.demoForm.status.submitted') }}
    </Tag>
    <Tag
      v-else-if="meta.dirty"
      color="yellow"
    >
      {{ t('views.demoForm.status.unsaved') }}
    </Tag>
    <Tag v-else>{{ t('views.demoForm.status.new') }}</Tag>
  </div>

  <InlineAlert
    v-if="loadError"
    :description="loadError"
    role="alert"
    variant="danger"
  />
  <Spinner v-else-if="readOnly && !submission" />
  <template v-else>
    <p v-if="submission">{{ t('views.demoForm.submittedOn', { date: formatDateLong(submission.createdAt) }) }}</p>
    <p v-else>{{ t('views.demoForm.intro') }}</p>
  </template>

  <Card v-if="!readOnly || submission">
    <template #content>
      <form
        class="grid grid-cols-12 gap-x-6 gap-y-2"
        novalidate
        @submit="onSubmit"
      >
        <SectionHeader
          class="col-span-12"
          :title="t('views.demoForm.sections.contact')"
        />
        <TextField
          class="col-span-12 md:col-span-6"
          name="firstName"
          :readonly="readOnly"
          :label="field('firstName')"
          :description="t('views.demoForm.help.firstName')"
          required
        />
        <TextField
          class="col-span-12 md:col-span-6"
          name="email"
          :readonly="readOnly"
          :label="field('email')"
          required
        />
        <MaskedField
          class="col-span-12 md:col-span-6"
          name="phone"
          :readonly="readOnly"
          :label="field('phone')"
          mask="(###) ###-####"
          type="tel"
          :placeholder="t('views.demoForm.placeholders.phone')"
        />
        <PasswordField
          v-if="!readOnly"
          class="col-span-12 md:col-span-6"
          name="password"
          :label="field('password')"
          :description="t('views.demoForm.help.password')"
          required
        />
        <Select
          class="col-span-12 md:col-span-6"
          name="province"
          :readonly="readOnly"
          :label="field('province')"
          :items="provinces"
          :placeholder="t('views.demoForm.placeholders.province')"
          required
        />
        <RadioGroup
          class="col-span-12 md:col-span-6"
          name="contactMethod"
          :readonly="readOnly"
          :label="field('contactMethod')"
          :options="contactMethods"
          required
        />

        <SectionHeader
          class="col-span-12"
          :title="t('views.demoForm.sections.details')"
        />
        <DatePicker
          class="col-span-12 md:col-span-6"
          name="startDate"
          :readonly="readOnly"
          :label="field('startDate')"
          :max-value="new Date()"
        />
        <NumberField
          class="col-span-12 md:col-span-6"
          name="quantity"
          :readonly="readOnly"
          :label="field('quantity')"
          :format-options="{ maximumFractionDigits: 0 }"
          :description="t('views.demoForm.help.quantity')"
        />
        <ComboBox
          class="col-span-12 md:col-span-6"
          allows-custom-value
          name="city"
          :readonly="readOnly"
          :label="field('city')"
          :placeholder="t('views.demoForm.placeholders.city')"
          :suggestions="citySuggestions"
          @complete="filterCities"
        />
        <Select
          class="col-span-12 md:col-span-6"
          name="category"
          :readonly="readOnly"
          :label="field('category')"
          :items="categories"
          :placeholder="t('views.demoForm.placeholders.category')"
        />
        <TextArea
          class="col-span-12"
          name="comments"
          :readonly="readOnly"
          :label="field('comments')"
          :description="t('views.demoForm.help.comments')"
        />

        <Checkbox
          class="col-span-12 mt-4"
          name="agree"
          :readonly="readOnly"
          :label="field('agree')"
          required
        />
        <div
          v-if="!readOnly"
          class="col-span-12 flex gap-2 mt-4"
        >
          <Button
            icon="fa-solid fa-check"
            :label="t('ui.actions.submit')"
            type="submit"
          />
          <CancelButton @click="resetForm()" />
        </div>
      </form>
    </template>
  </Card>
</template>
