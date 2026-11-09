import { flushPromises } from '@vue/test-utils';
import { AxiosError } from 'axios';

import BcdsDatePicker from '@/components/bcds/DatePicker.vue';
import BcdsSelect from '@/components/bcds/Select.vue';
import { createSubmission, getSubmission } from '@/services/submission';
import { RouteName } from '@/utils/enums';
import { showError } from '@/utils/utils';
import DemoFormView from '@/views/DemoFormView.vue';

import { expectNoAxeViolations } from '../../expectNoAxeViolations';
import { mockRouter, resetMockRouter } from '../../mockRouter';
import { mountComponent } from '../../mountComponent';

import type { VueWrapper } from '@vue/test-utils';
import type { Submission } from '@/types';

// Mocks

const mockToast = { error: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn() };

vi.mock('@/composables/useToast', () => ({
  useToast: () => mockToast
}));

vi.mock('@/services/submission', () => ({
  createSubmission: vi.fn(),
  getSubmission: vi.fn()
}));

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
  onBeforeRouteUpdate: vi.fn(),
  useRouter: () => mockRouter
}));

// Fixtures

const testSections = ['Contact', 'Details'];

const testSubmission: Submission = {
  id: '0b6a1f3e-6d2c-4f0e-9a51-3c8e2d7b4a10',
  firstName: 'Jane',
  email: 'jane.doe@example.com',
  phone: '(250) 555-1234',
  province: 'BC',
  contactMethod: 'email',
  startDate: '2026-01-15T00:00:00.000Z',
  quantity: 3,
  city: 'Victoria',
  category: 'question',
  comments: 'Some comments',
  createdAt: '2026-01-20T18:30:00.000Z',
  createdBy: null,
  updatedAt: null,
  updatedBy: null,
  deletedAt: null,
  deletedBy: null
};

function testAxiosError(status: number) {
  return new AxiosError('Request failed', undefined, undefined, undefined, { status } as never);
}

// Fills the required fields plus a start date, through each component's own input
async function fillValidForm(wrapper: VueWrapper) {
  await wrapper.find('input[name="firstName"]').setValue('Jane');
  await wrapper.find('input[name="email"]').setValue('jane.doe@example.com');
  await wrapper.find('input[type="password"]').setValue('secret-password');
  wrapper
    .findAllComponents(BcdsSelect)
    .find((c) => c.props('name') === 'province')!
    .vm.$emit('update:modelValue', 'BC');
  await radio(wrapper, 'Email').trigger('click');
  wrapper.findComponent(BcdsDatePicker).vm.$emit('update:modelValue', new Date(2026, 0, 15));
  await wrapper.find('[role="checkbox"]').trigger('click');
}

// The radio a label names, found the way a user would, through its label
function radio(wrapper: VueWrapper, label: string) {
  const id = wrapper
    .findAll('label')
    .find((el) => el.text() === label)!
    .attributes('for');

  return wrapper.find(`[role="radio"][id="${id}"]`);
}

// Mount

function mountDemoFormView() {
  // Quill doesn't run in happy-dom.
  const { wrapper } = mountComponent(DemoFormView, { errorHandler: showError });

  return { wrapper };
}

async function mountReadOnlyDemoFormView() {
  const { wrapper } = mountComponent(DemoFormView, {
    props: { submissionId: testSubmission.id },
    stubs: { Spinner: true }
  });
  await flushPromises();

  return { wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
  resetMockRouter();
});

// Tests

describe('DemoFormView', () => {
  describe('rendering', () => {
    it('renders every section', () => {
      const { wrapper } = mountDemoFormView();

      for (const section of testSections) expect(wrapper.text()).toContain(section);
    });
  });

  describe('validation', () => {
    it('shows the required errors when submitted empty', async () => {
      const { wrapper } = mountDemoFormView();

      await wrapper.find('form').trigger('submit');

      // The zod schema validates asynchronously.
      await vi.waitFor(() => expect(wrapper.text()).toContain('First name is a required field'));
      expect(wrapper.text()).toContain('Province is a required field');
      expect(wrapper.text()).toContain('You must accept the terms');
      expect(createSubmission).not.toHaveBeenCalled();
    });

    it('rejects a phone number the mask has only partly filled', async () => {
      const { wrapper } = mountDemoFormView();

      await wrapper.find('input[name="phone"]').setValue('25055');
      await wrapper.find('form').trigger('submit');

      await vi.waitFor(() => expect(wrapper.text()).toContain('Phone must be a full number, such as (250) 555-0100'));
    });
  });

  describe('submit', () => {
    it('saves the form without the password or terms and goes to the submissions', async () => {
      vi.mocked(createSubmission).mockResolvedValue({} as never);
      const { wrapper } = mountDemoFormView();
      await fillValidForm(wrapper);

      await wrapper.find('form').trigger('submit');

      await vi.waitFor(() => expect(createSubmission).toHaveBeenCalledOnce());
      expect(createSubmission).toHaveBeenCalledWith({
        firstName: 'Jane',
        email: 'jane.doe@example.com',
        phone: undefined,
        province: 'BC',
        contactMethod: 'email',
        startDate: '2026-01-15',
        quantity: undefined,
        city: undefined,
        category: undefined,
        comments: undefined
      });
      await vi.waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith({ name: RouteName.SUBMISSIONS }));
      expect(mockToast.success).toHaveBeenCalledWith('Form submitted', 'Your submission was saved');
    });

    it('shows an error and stays on the form when the save fails', async () => {
      vi.mocked(createSubmission).mockRejectedValue(new Error('save failed'));
      const { wrapper } = mountDemoFormView();
      await fillValidForm(wrapper);

      await wrapper.find('form').trigger('submit');

      await vi.waitFor(() => expect(createSubmission).toHaveBeenCalledOnce());
      await flushPromises();
      expect(mockToast.error).toHaveBeenCalledWith('Unable to save the submission. Please try again.');
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect((wrapper.find('input[name="firstName"]').element as HTMLInputElement).value).toBe('Jane');
    });
  });

  describe('read only', () => {
    it('loads the submission into the form', async () => {
      vi.mocked(getSubmission).mockResolvedValue(testSubmission);

      const { wrapper } = await mountReadOnlyDemoFormView();

      expect(getSubmission).toHaveBeenCalledWith(testSubmission.id);
      expect((wrapper.find('input[name="firstName"]').element as HTMLInputElement).value).toBe('Jane');
      expect((wrapper.find('input[name="email"]').element as HTMLInputElement).value).toBe('jane.doe@example.com');
      expect(radio(wrapper, 'Email').attributes('aria-checked')).toBe('true');
      expect(wrapper.find('[role="checkbox"]').attributes('aria-checked')).toBe('true');
      expect((wrapper.find('input[name="province"]').element as HTMLInputElement).value).toBe('British Columbia');
      const startDate = wrapper.findComponent(BcdsDatePicker).props('modelValue') as Date;
      expect([startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]).toEqual([2026, 0, 15]);
    });

    it('makes every field read only rather than disabled', async () => {
      vi.mocked(getSubmission).mockResolvedValue(testSubmission);

      const { wrapper } = await mountReadOnlyDemoFormView();

      // Reka's hidden inputs only carry values for a native form submit, out of the user's reach.
      const fields = wrapper.findAll('input:not([aria-hidden="true"]), textarea');
      const editable = fields.filter((el) => el.attributes('readonly') === undefined);
      const disabled = fields.filter((el) => el.attributes('disabled') !== undefined);
      expect(editable.map((el) => el.attributes('name'))).toEqual([]);
      expect(disabled.map((el) => el.attributes('name'))).toEqual([]);
      // Controls that aren't inputs say they're read only to assistive tech instead.
      const controls = wrapper.findAll('[role="radiogroup"], [role="checkbox"], [role="spinbutton"]:not(input)');
      const unmarked = controls.filter((el) => el.attributes('aria-readonly') !== 'true');
      expect(unmarked.map((el) => el.attributes('aria-label') ?? el.attributes('role'))).toEqual([]);
    });

    it('hides the password, submit and cancel', async () => {
      vi.mocked(getSubmission).mockResolvedValue(testSubmission);

      const { wrapper } = await mountReadOnlyDemoFormView();

      expect(wrapper.find('input[type="password"]').exists()).toBe(false);
      expect(wrapper.find('button[type="submit"]').exists()).toBe(false);
      expect(wrapper.text()).toContain('Submitted January 20 2026');
    });

    it('shows the not found message instead of the form when the submission is missing or deleted', async () => {
      vi.mocked(getSubmission).mockRejectedValue(testAxiosError(404));

      const { wrapper } = await mountReadOnlyDemoFormView();

      expect(wrapper.text()).toContain('has been deleted.');
      expect(wrapper.find('form').exists()).toBe(false);
    });

    it('shows the load error for any other failure', async () => {
      vi.mocked(getSubmission).mockRejectedValue(testAxiosError(500));

      const { wrapper } = await mountReadOnlyDemoFormView();

      expect(wrapper.text()).toContain('Unable to load the submission. Please try again.');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations when empty', async () => {
      const { wrapper } = mountDemoFormView();

      await expectNoAxeViolations(wrapper.element);
    });

    it('has no axe violations when showing validation errors', async () => {
      const { wrapper } = mountDemoFormView();
      await wrapper.find('form').trigger('submit');
      await vi.waitFor(() => expect(wrapper.text()).toContain('First name is a required field'));

      await expectNoAxeViolations(wrapper.element);
    });

    it('has no axe violations when read only', async () => {
      vi.mocked(getSubmission).mockResolvedValue(testSubmission);
      const { wrapper } = await mountReadOnlyDemoFormView();

      await expectNoAxeViolations(wrapper.element);
    });
  });
});
