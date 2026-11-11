<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  AlertBanner,
  AlertDialog,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Dialog,
  Drawer,
  InlineAlert,
  Menu,
  Modal,
  NumberField,
  ProgressBar,
  ProgressCircle,
  RadioGroup,
  Select,
  Separator,
  Switch,
  Tag,
  TextField,
  TimeField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@/components/bcds';
import Card from '@/components/common/Card.vue';
import SectionHeader from '@/components/form/SectionHeader.vue';
import { useConfirm } from '@/composables/useConfirm';
import { useToast } from '@/composables/useToast';
import { RouteName } from '@/utils/enums';

import type { MenuItemProps, MenuSectionProps, SelectSectionProps } from '@/components/bcds';
import type { MessageSchema } from '@/i18n';

type Text = MessageSchema['views']['components'];

// Constants
const ALERT_VARIANTS = ['info', 'success', 'warning', 'danger'] as const satisfies (keyof Text['alerts']['variants'])[];
const BANNER_VARIANTS = [
  'info',
  'success',
  'warning',
  'danger',
  'black'
] as const satisfies (keyof Text['banners']['variants'])[];
const PLACEMENTS = ['top', 'right', 'bottom', 'left'] as const satisfies (keyof Text['tooltips'])[];
const BUTTON_SIZES = ['xsmall', 'small', 'medium', 'large'] as const satisfies (keyof Text['sizes'])[];
const CALENDAR_VIEWS = ['day', 'week', 'month'] as const satisfies (keyof Text['buttons']['calendarView']['options'])[];
const CONTACT_METHODS = ['email', 'phone', 'mail'] as const satisfies (keyof Text['fields']['contact']['options'])[];
const SIZES = ['small', 'medium', 'large'] as const satisfies (keyof Text['sizes'])[];
const TAG_SIZES = ['xsmall', 'small', 'medium'] as const satisfies (keyof Text['sizes'])[];
const TAGS = [
  { color: 'blue', key: 'blue' },
  { color: 'bc-blue', key: 'bcBlue' },
  { color: 'bc-gold', key: 'bcGold' },
  { color: 'dark', key: 'dark' },
  { color: 'gray', key: 'gray' },
  { color: 'green', key: 'green' },
  { color: 'red', key: 'red' },
  { color: 'yellow', key: 'yellow' }
] as const satisfies { color: string; key: keyof Text['tags'] }[];
const TOASTS = ['info', 'success', 'warn', 'error'] as const satisfies (keyof Text['toasts'])[];
const TOPICS = ['news', 'events', 'jobs'] as const satisfies (keyof Text['fields']['topics']['options'])[];

// Composables
const { confirm } = useConfirm();
const { t } = useI18n();
const toast = useToast();

// State
const alertClosed = ref(false);
const bannerClosed = ref(false);
const dialogOpen = ref(false);
const drawerOpen = ref(false);
const modalOpen = ref(false);
const progress = ref(40);

const calendarView = ref<string | string[] | undefined>('week');
const choices = ref({ first: true, second: false });
const contactMethod = ref<string | number>();
const dateSmall = ref<Date | null>(null);
const dateTypedOnly = ref<Date | null>(null);
const meetingTime = ref<string | null>(null);
const number = ref<number | null>(4);
const preview = ref(false);
const search = ref('');
const topics = ref<(string | number)[]>(['news']);
const updates = ref(true);
const selectScroll = ref<(string | number)[]>(TAGS.map((tag) => tag.key));
const selectSections = ref<string | number | null>(null);
const selectSmall = ref<string | number | null>(null);
const selectWrap = ref<(string | number)[]>(['blue', 'green', 'yellow']);

// Checking select all checks both; it's indeterminate while only one is.
const allChosen = computed({
  get: () => choices.value.first && choices.value.second,
  set: (checked: boolean) => (choices.value = { first: checked, second: checked })
});
const someChosen = computed(() => !allChosen.value && (choices.value.first || choices.value.second));

const contactOptions = CONTACT_METHODS.map((method) => ({
  description: t(`views.components.fields.contact.options.${method}.description`),
  label: t(`views.components.fields.contact.options.${method}.label`),
  value: method
}));

const topicOptions = TOPICS.map((topic) => ({
  label: t(`views.components.fields.topics.options.${topic}`),
  value: topic
}));

const menuItems: MenuItemProps[] = (['view', 'copy', 'delete'] as const).map((item) => ({
  description: t(`views.components.menu.items.${item}.description`),
  icon: { copy: 'fa-solid fa-clipboard', delete: 'fa-solid fa-trash', view: 'fa-solid fa-eye' }[item],
  disabled: item === 'delete',
  label: t(`views.components.menu.items.${item}.label`),
  onAction: () =>
    toast.info(t('views.components.menu.selected', { item: t(`views.components.menu.items.${item}.label`) }))
}));

const selectItems = contactOptions.map(({ label, value }) => ({ id: value, label }));

const tagItems = TAGS.map(({ color, key }) => ({ color, id: key, label: t(`views.components.tags.${key}`) }));
const circularTagItems = tagItems.map((item) => ({ ...item, tagStyle: 'circular' as const }));

const selectSectionList: SelectSectionProps[] = [
  {
    header: t('views.components.menu.sections.actions'),
    id: 'actions',
    items: menuItems.map(({ description, icon, label }, index) => ({
      description,
      iconLeft: icon,
      id: index,
      destructive: icon === 'fa-solid fa-trash',
      label
    }))
  },
  { header: t('views.components.fields.contact.label'), id: 'contact', items: selectItems }
];

const menuSections: MenuSectionProps[] = [
  { header: t('views.components.menu.sections.actions'), id: 'actions', items: menuItems },
  {
    header: t('views.components.menu.sections.links'),
    id: 'links',
    items: [
      {
        description: t('views.components.menu.items.home.description'),
        label: t('views.components.menu.items.home.label'),
        to: { name: RouteName.HOME }
      },
      {
        description: t('views.components.menu.items.designSystem.description'),
        href: 'https://www2.gov.bc.ca/gov/content/digital/design-system',
        label: t('views.components.menu.items.designSystem.label')
      }
    ]
  }
];

// Actions
async function askToConfirm() {
  const accepted = await confirm({
    acceptLabel: t('views.components.dialogs.confirm.accept'),
    message: t('views.components.dialogs.confirm.message'),
    rejectLabel: t('ui.actions.cancel'),
    title: t('views.components.dialogs.confirm.title')
  });
  toast.info(t(`views.components.dialogs.confirm.${accepted ? 'accepted' : 'rejected'}`));
}

function changeProgress(step: number) {
  progress.value = Math.min(Math.max(progress.value + step, 0), 100);
}

function showToast(severity: (typeof TOASTS)[number]) {
  toast[severity](t(`views.components.toasts.${severity}.title`), t(`views.components.toasts.${severity}.detail`));
}
</script>

<template>
  <h1>{{ t('views.components.title') }}</h1>
  <p>{{ t('views.components.intro') }}</p>

  <section>
    <SectionHeader :title="t('views.components.sections.buttons')" />
    <div class="flex flex-wrap items-center gap-4">
      <Button :label="t('views.components.buttons.primary')" />
      <Button
        :label="t('views.components.buttons.secondary')"
        variant="secondary"
      />
      <Button
        :label="t('views.components.buttons.tertiary')"
        variant="tertiary"
      />
      <Button
        :label="t('views.components.buttons.link')"
        variant="link"
      />
      <Button
        danger
        :label="t('views.components.buttons.danger')"
      />
      <Button
        danger
        :label="t('views.components.buttons.secondaryDanger')"
        variant="secondary"
      />
      <Button
        icon="fa-solid fa-check"
        :label="t('views.components.buttons.withIcon')"
      />
      <Button
        icon="fa-solid fa-check"
        icon-only
        :label="t('views.components.buttons.iconOnly')"
        variant="tertiary"
      />
      <Button
        disabled
        :label="t('views.components.buttons.disabled')"
      />
    </div>
    <div class="mt-4 flex flex-wrap items-center gap-4">
      <Button
        v-for="size in BUTTON_SIZES"
        :key="size"
        :label="t(`views.components.sizes.${size}`)"
        :size
        variant="secondary"
      />
      <Button
        v-for="size in BUTTON_SIZES"
        :key="`icon-${size}`"
        icon="fa-solid fa-check"
        icon-only
        :label="t(`views.components.sizes.${size}`)"
        :size
        variant="secondary"
      />
    </div>
    <div class="mt-4 flex flex-wrap items-end gap-4">
      <ToggleButton
        v-model="preview"
        icon="fa-solid fa-eye"
        :label="t('views.components.buttons.preview')"
      />
      <div>
        <ToggleButtonGroup
          v-model="calendarView"
          disallow-empty-selection
          :label="t('views.components.buttons.calendarView.label')"
        >
          <ToggleButton
            v-for="view in CALENDAR_VIEWS"
            :key="view"
            :label="t(`views.components.buttons.calendarView.options.${view}`)"
            :value="view"
          />
        </ToggleButtonGroup>
      </div>
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.tags')" />
    <div class="flex flex-wrap gap-2">
      <Tag
        v-for="tag in TAGS"
        :key="tag.key"
        :color="tag.color"
      >
        {{ t(`views.components.tags.${tag.key}`) }}
      </Tag>
    </div>
    <div class="mt-4 flex flex-wrap items-center gap-2">
      <Tag
        v-for="size in TAG_SIZES"
        :key="size"
        :size
      >
        {{ t(`views.components.sizes.${size}`) }}
      </Tag>
      <Tag
        color="green"
        tag-style="circular"
      >
        {{ t('views.components.tags.circular') }}
      </Tag>
      <Tag
        color="green"
        icon="fa-solid fa-check"
      >
        {{ t('views.components.tags.withIcon') }}
      </Tag>
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.alerts')" />
    <div class="flex flex-col gap-4">
      <InlineAlert
        v-for="variant in ALERT_VARIANTS"
        :key="variant"
        :description="t(`views.components.alerts.variants.${variant}.description`)"
        :title="t(`views.components.alerts.variants.${variant}.title`)"
        :variant
      />
      <InlineAlert
        :description="t('views.components.alerts.withButtons.description')"
        :title="t('views.components.alerts.withButtons.title')"
      >
        <template #buttons>
          <Button
            :label="t('views.components.alerts.actions.later')"
            variant="secondary"
          />
          <Button :label="t('views.components.alerts.actions.review')" />
        </template>
      </InlineAlert>
      <InlineAlert
        v-if="!alertClosed"
        :description="t('views.components.alerts.closeable.description')"
        closeable
        :title="t('views.components.alerts.closeable.title')"
        @close="alertClosed = true"
      />
      <div v-else>
        <Button
          :label="t('views.components.alerts.reset')"
          variant="secondary"
          @click="alertClosed = false"
        />
      </div>
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.banners')" />
    <div class="flex flex-col gap-4">
      <AlertBanner
        v-for="variant in BANNER_VARIANTS"
        :key="variant"
        :closeable="false"
        :variant
      >
        {{ t(`views.components.banners.variants.${variant}`) }}
      </AlertBanner>
      <AlertBanner
        :closeable="false"
        size="small"
      >
        {{ t('views.components.banners.small') }}
      </AlertBanner>
      <AlertBanner
        v-if="!bannerClosed"
        @close="bannerClosed = true"
      >
        {{ t('views.components.banners.closeable') }}
      </AlertBanner>
      <div v-else>
        <Button
          :label="t('views.components.banners.reset')"
          variant="secondary"
          @click="bannerClosed = false"
        />
      </div>
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.dialogs')" />
    <div class="flex flex-wrap gap-4">
      <Button
        :label="t('views.components.dialogs.alert.open')"
        variant="secondary"
        @click="dialogOpen = true"
      />
      <Button
        :label="t('views.components.dialogs.confirm.open')"
        variant="secondary"
        @click="askToConfirm"
      />
      <Button
        :label="t('views.components.dialogs.modal.open')"
        variant="secondary"
        @click="modalOpen = true"
      />
    </div>
    <AlertDialog
      v-model:open="dialogOpen"
      :title="t('views.components.dialogs.alert.title')"
    >
      {{ t('views.components.dialogs.alert.message') }}
      <template #buttons>
        <Button
          :label="t('ui.actions.close')"
          @click="dialogOpen = false"
        />
      </template>
    </AlertDialog>
    <Modal v-model:open="modalOpen">
      <Dialog :title="t('views.components.dialogs.modal.title')">
        <p class="mt-0">{{ t('views.components.dialogs.modal.message') }}</p>
        <div class="flex justify-end">
          <Button
            :label="t('ui.actions.close')"
            @click="modalOpen = false"
          />
        </div>
      </Dialog>
    </Modal>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.toasts')" />
    <div class="flex flex-wrap gap-4">
      <Button
        v-for="severity in TOASTS"
        :key="severity"
        :label="t(`views.components.toasts.${severity}.button`)"
        variant="secondary"
        @click="showToast(severity)"
      />
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.progress')" />
    <div class="flex flex-col gap-6">
      <ProgressBar
        :value="progress"
        :value-label="t('views.components.progress.label')"
      />
      <div class="flex gap-4">
        <Button
          icon="fa-solid fa-minus"
          :label="t('views.components.progress.decrease')"
          variant="secondary"
          @click="changeProgress(-10)"
        />
        <Button
          icon="fa-solid fa-plus"
          :label="t('views.components.progress.increase')"
          variant="secondary"
          @click="changeProgress(10)"
        />
      </div>
      <ProgressBar
        :aria-label="t('ui.loading')"
        indeterminate
      />
      <div class="flex flex-wrap items-end gap-8">
        <ProgressCircle
          v-for="size in SIZES"
          :key="size"
          :size
          :value="progress"
          :value-label="t(`views.components.sizes.${size}`)"
        />
        <ProgressCircle
          :aria-label="t('ui.loading')"
          indeterminate
          size="large"
        />
      </div>
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.tooltips')" />
    <div class="flex flex-wrap gap-4">
      <Tooltip
        v-for="placement in PLACEMENTS"
        :key="placement"
        :placement
        :text="t(`views.components.tooltips.${placement}.text`)"
      >
        <Button
          :label="t(`views.components.tooltips.${placement}.button`)"
          variant="secondary"
        />
      </Tooltip>
      <Tooltip
        :delay="0"
        :text="t('views.components.tooltips.noDelay.text')"
      >
        <Button
          :label="t('views.components.tooltips.noDelay.button')"
          variant="secondary"
        />
      </Tooltip>
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.menu')" />
    <div class="flex flex-wrap gap-4">
      <Menu :items="menuItems">
        <Button
          icon="fa-solid fa-chevron-down"
          :label="t('views.components.menu.open')"
          variant="secondary"
        />
      </Menu>
      <Menu :sections="menuSections">
        <Button
          icon="fa-solid fa-chevron-down"
          :label="t('views.components.menu.openSections')"
          variant="secondary"
        />
      </Menu>
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.fields')" />
    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
      <div class="col-span-12 flex flex-col gap-2">
        <Checkbox
          v-model="allChosen"
          :indeterminate="someChosen"
          :label="t('views.components.fields.allChoices')"
        />
        <div class="flex flex-col gap-2 pl-6">
          <Checkbox
            v-model="choices.first"
            :label="t('views.components.fields.firstChoice')"
          />
          <Checkbox
            v-model="choices.second"
            :label="t('views.components.fields.secondChoice')"
          />
        </div>
      </div>
      <Switch
        v-model="updates"
        class="col-span-12"
        :label="t('views.components.fields.updates')"
      />
      <CheckboxGroup
        v-model="topics"
        class="col-span-12"
        :label="t('views.components.fields.topics.label')"
        :options="topicOptions"
        orientation="horizontal"
      />
      <RadioGroup
        v-model="contactMethod"
        class="col-span-12"
        flex-wrap="wrap"
        :label="t('views.components.fields.contact.label')"
        :options="contactOptions"
        orientation="horizontal"
      />
      <TextField
        v-model="search"
        class="col-span-12 md:col-span-4"
        icon-left="fa-solid fa-magnifying-glass"
        icon-right="fa-solid fa-circle-info"
        :label="t('views.components.fields.search.label')"
        :placeholder="t('views.components.fields.search.placeholder')"
        size="small"
      />
      <DatePicker
        v-model="dateSmall"
        class="col-span-12 md:col-span-4"
        :label="t('views.components.fields.dateSmall')"
        size="small"
      />
      <Select
        v-model="selectSmall"
        class="col-span-12 md:col-span-4"
        :items="selectItems"
        :label="t('views.components.fields.selectSmall')"
        size="small"
      />
      <NumberField
        v-model="number"
        class="col-span-12 md:col-span-4"
        :label="t('views.components.fields.number')"
        :max-value="10"
        :min-value="0"
        :step="2"
      />
      <TimeField
        v-model="meetingTime"
        class="col-span-12 md:col-span-4"
        :label="t('views.components.fields.meetingTime')"
      />
      <DatePicker
        v-model="dateTypedOnly"
        class="col-span-12 md:col-span-4"
        calendar-disabled
        :label="t('views.components.fields.dateTypedOnly')"
      />
      <Select
        v-model="selectSections"
        class="col-span-12 md:col-span-4"
        :label="t('views.components.fields.selectSections')"
        :sections="selectSectionList"
      />
      <Select
        v-model="selectWrap"
        class="col-span-12 md:col-span-6"
        :items="tagItems"
        :label="t('views.components.fields.selectWrap')"
        selection-mode="multiple"
      />
      <Select
        v-model="selectScroll"
        class="col-span-12 md:col-span-6"
        :items="circularTagItems"
        :label="t('views.components.fields.selectScroll')"
        overflow="scroll"
        selection-mode="multiple"
      />
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.separators')" />
    <div class="flex flex-col gap-2">
      <template
        v-for="size in SIZES"
        :key="size"
      >
        <span>{{ t(`views.components.sizes.${size}`) }}</span>
        <Separator :size />
      </template>
      <span>{{ t('views.components.separators.vertical') }}</span>
      <div class="flex h-10 items-center">
        <span>{{ t('views.components.separators.first') }}</span>
        <Separator orientation="vertical" />
        <span>{{ t('views.components.separators.second') }}</span>
        <Separator orientation="vertical" />
        <span>{{ t('views.components.separators.third') }}</span>
      </div>
    </div>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.card')" />
    <Card class="max-w-xl">
      <template #title>{{ t('views.components.card.title') }}</template>
      <template #subtitle>{{ t('views.components.card.subtitle') }}</template>
      <template #content>{{ t('views.components.card.content') }}</template>
      <template #footer>
        <Button
          :label="t('views.components.card.action')"
          variant="secondary"
        />
      </template>
    </Card>
  </section>

  <section>
    <SectionHeader :title="t('views.components.sections.drawer')" />
    <Button
      :label="t('views.components.drawer.open')"
      variant="secondary"
      @click="drawerOpen = true"
    />
    <Drawer
      v-model:open="drawerOpen"
      position="left"
      :title="t('views.components.drawer.title')"
    >
      <div class="flex flex-col gap-4 p-4">
        <p>{{ t('views.components.drawer.content') }}</p>
        <Button
          :label="t('ui.actions.close')"
          variant="secondary"
          @click="drawerOpen = false"
        />
      </div>
    </Drawer>
  </section>
</template>

<style scoped>
section {
  margin-bottom: var(--layout-margin-xlarge);
}
</style>
