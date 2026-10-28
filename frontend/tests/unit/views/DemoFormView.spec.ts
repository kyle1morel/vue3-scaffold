import { flushPromises } from '@vue/test-utils';
import { AxiosError } from 'axios';
import PrimeDatePicker from 'primevue/datepicker';
import PrimeSelect from 'primevue/select';

import { createSubmission, getSubmission } from '@/services/submissionService';
import { RouteName } from '@/utils/enums/application';
import DemoFormView from '@/views/DemoFormView.vue';

import { mockRouter, resetMockRouter } from '../../mockRouter';
import { mountComponent } from '../../mountComponent';

import type { VueWrapper } from '@vue/test-utils';
import type { Submission } from '@/types';

// Mocks

const mockToast = { error: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn() };

vi.mock('@/lib/primevue/useToast', () => ({
  useToast: () => mockToast
}));

vi.mock('@/services/submissionService', () => ({
  createSubmission: vi.fn(),
  getSubmission: vi.fn()
}));

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
  useRouter: () => mockRouter
}));

// Fixtures

const testSections = ['Contact', 'Details', 'Notes'];

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
  notes: '<p>Some notes</p>',
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
  await wrapper.find('input#firstName').setValue('Jane');
  await wrapper.find('input#email').setValue('jane.doe@example.com');
  await wrapper.find('input[type="password"]').setValue('secret-password');
  wrapper
    .findAllComponents(PrimeSelect)
    .find((c) => c.classes('p-select'))!
    .vm.$emit('update:modelValue', 'BC');
  await wrapper.find('input[type="radio"][value="email"]').setValue(true);
  wrapper
    .findAllComponents(PrimeDatePicker)
    .find((c) => c.classes('p-datepicker'))!
    .vm.$emit('update:modelValue', new Date(2026, 0, 15));
  await wrapper.find('input[type="checkbox"]').setValue(true);
}

// Mount

function mountDemoFormView() {
  // Quill doesn't run in happy-dom
  const { wrapper } = mountComponent(DemoFormView, { stubs: { Editor: true } });

  return { wrapper };
}

async function mountReadOnlyDemoFormView() {
  const { wrapper } = mountComponent(DemoFormView, {
    props: { submissionId: testSubmission.id },
    stubs: { Editor: true, Spinner: true }
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

      // The zod schema validates asynchronously
      await vi.waitFor(() => expect(wrapper.text()).toContain('First name is a required field'));
      expect(wrapper.text()).toContain('Province is a required field');
      expect(wrapper.text()).toContain('You must accept the terms');
      expect(createSubmission).not.toHaveBeenCalled();
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
        comments: undefined,
        notes: undefined
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
      expect((wrapper.find('input#firstName').element as HTMLInputElement).value).toBe('Jane');
    });
  });

  describe('read only', () => {
    it('loads the submission into the form', async () => {
      vi.mocked(getSubmission).mockResolvedValue(testSubmission);

      const { wrapper } = await mountReadOnlyDemoFormView();

      expect(getSubmission).toHaveBeenCalledWith(testSubmission.id);
      expect((wrapper.find('input#firstName').element as HTMLInputElement).value).toBe('Jane');
      expect((wrapper.find('input#email').element as HTMLInputElement).value).toBe('jane.doe@example.com');
      expect(wrapper.find('input[type="radio"][value="email"]').element).toHaveProperty('checked', true);
      expect(wrapper.find('input[type="checkbox"]').element).toHaveProperty('checked', true);
      const select = wrapper.findAllComponents(PrimeSelect).find((c) => c.classes('p-select'))!;
      expect(select.props('modelValue')).toBe('BC');
      const datePicker = wrapper.findAllComponents(PrimeDatePicker).find((c) => c.classes('p-datepicker'))!;
      const startDate = datePicker.props('modelValue') as Date;
      expect([startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]).toEqual([2026, 0, 15]);
    });

    it('disables every field', async () => {
      vi.mocked(getSubmission).mockResolvedValue(testSubmission);

      const { wrapper } = await mountReadOnlyDemoFormView();

      const enabled = wrapper.findAll('input, textarea').filter((el) => el.attributes('disabled') === undefined);
      expect(enabled.map((el) => el.attributes('id') ?? el.attributes('name'))).toEqual([]);
    });

    it('hides the password, submit and cancel, and links back to the submissions', async () => {
      vi.mocked(getSubmission).mockResolvedValue(testSubmission);

      const { wrapper } = await mountReadOnlyDemoFormView();

      expect(wrapper.find('input[type="password"]').exists()).toBe(false);
      expect(wrapper.find('button[type="submit"]').exists()).toBe(false);
      expect(wrapper.text()).toContain('Submitted January 20 2026');
      expect(wrapper.findComponent({ name: 'RouterLinkStub' }).props('to')).toEqual({ name: RouteName.SUBMISSIONS });
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
});
