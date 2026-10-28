import { flushPromises } from '@vue/test-utils';
import PrimeDataTable from 'primevue/datatable';

import { deleteSubmission, listSubmissions } from '@/services/submissionService';
import { RouteName } from '@/utils/enums/application';
import SubmissionsView from '@/views/SubmissionsView.vue';

import { mountComponent } from '../../mountComponent';

import type { ConfirmationOptions } from 'primevue/confirmationoptions';
import type { Submission } from '@/types';

// Mocks

const mockConfirm = { require: vi.fn(), close: vi.fn() };
const mockToast = { error: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn() };

vi.mock('@/lib/primevue/useToast', () => ({
  useToast: () => mockToast
}));

vi.mock('@/services/submissionService', () => ({
  deleteSubmission: vi.fn(),
  listSubmissions: vi.fn()
}));

vi.mock('primevue/useconfirm', () => ({
  useConfirm: () => mockConfirm
}));

// Fixtures

const testSubmission = {
  id: '0b6a1f3e-6d2c-4f0e-9a51-3c8e2d7b4a10',
  firstName: 'Jane',
  email: 'jane.doe@example.com',
  province: 'BC',
  city: 'Victoria',
  quantity: 3,
  createdAt: '2026-01-15T18:30:00.000Z'
} as Submission;

// Clicks the row's delete button and accepts the confirm dialog it opens
async function deleteAndAccept(wrapper: Awaited<ReturnType<typeof mountSubmissionsView>>['wrapper']) {
  await wrapper.find('button[aria-label="Delete the submission from Jane"]').trigger('click');
  const options = mockConfirm.require.mock.calls[0]![0] as ConfirmationOptions;
  await options.accept!();
  await flushPromises();
}

// Mount

async function mountSubmissionsView() {
  const { wrapper } = mountComponent(SubmissionsView);
  await flushPromises();

  return { wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('SubmissionsView', () => {
  describe('loading', () => {
    it('loads the first page of 10 on mount', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [testSubmission], total: 1 });

      await mountSubmissionsView();

      expect(listSubmissions).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    });

    it('loads the 1-based page the table asks for, at its page size', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [testSubmission], total: 60 });
      const { wrapper } = await mountSubmissionsView();

      wrapper.findComponent(PrimeDataTable).vm.$emit('page', { page: 2, rows: 25, first: 50 });
      await flushPromises();

      expect(listSubmissions).toHaveBeenLastCalledWith({ page: 3, pageSize: 25 });
    });

    it('shows an error toast when loading fails', async () => {
      vi.mocked(listSubmissions).mockRejectedValue(new Error('load failed'));

      const { wrapper } = await mountSubmissionsView();

      expect(mockToast.error).toHaveBeenCalledWith('Unable to load submissions. Please try again.');
      expect(wrapper.findComponent(PrimeDataTable).props('loading')).toBe(false);
    });
  });

  describe('rendering', () => {
    it('renders a row per submission', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [testSubmission], total: 1 });

      const { wrapper } = await mountSubmissionsView();

      const row = wrapper.find('tbody tr');
      expect(row.text()).toContain('Jane');
      expect(row.text()).toContain('jane.doe@example.com');
      expect(row.text()).toContain('Victoria');
      expect(row.text()).toContain('2026 Jan 15');
    });

    it('passes the total to the paginator', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [testSubmission], total: 42 });

      const { wrapper } = await mountSubmissionsView();

      expect(wrapper.findComponent(PrimeDataTable).props('totalRecords')).toBe(42);
    });

    it('shows the empty message when there are no submissions', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [], total: 0 });

      const { wrapper } = await mountSubmissionsView();

      expect(wrapper.text()).toContain('No submissions yet.');
    });

    it('links each row to its read only view', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [testSubmission], total: 1 });

      const { wrapper } = await mountSubmissionsView();

      const link = wrapper.findComponent({ name: 'RouterLinkStub' });
      expect(link.props('to')).toEqual({ name: RouteName.SUBMISSION, params: { submissionId: testSubmission.id } });
      expect(link.attributes('aria-label')).toBe('View the submission from Jane');
    });
  });

  describe('delete', () => {
    it('asks for confirmation before deleting', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [testSubmission], total: 1 });
      const { wrapper } = await mountSubmissionsView();

      await wrapper.find('button[aria-label="Delete the submission from Jane"]').trigger('click');

      expect(mockConfirm.require).toHaveBeenCalledWith(
        expect.objectContaining({
          header: 'Delete submission?',
          message: 'Delete the submission from Jane? It will no longer appear in the list.'
        })
      );
      expect(deleteSubmission).not.toHaveBeenCalled();
    });

    it('deletes the submission and reloads the page once confirmed', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [testSubmission, testSubmission], total: 2 });
      const { wrapper } = await mountSubmissionsView();

      await deleteAndAccept(wrapper);

      expect(deleteSubmission).toHaveBeenCalledWith(testSubmission.id);
      expect(mockToast.success).toHaveBeenCalledWith('Submission deleted');
      expect(listSubmissions).toHaveBeenCalledTimes(2);
      expect(listSubmissions).toHaveBeenLastCalledWith({ page: 1, pageSize: 10 });
    });

    it('shows the page before when the last row on a page is deleted', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [testSubmission], total: 11 });
      const { wrapper } = await mountSubmissionsView();
      wrapper.findComponent(PrimeDataTable).vm.$emit('page', { page: 1, rows: 10, first: 10 });
      await flushPromises();

      await deleteAndAccept(wrapper);

      expect(listSubmissions).toHaveBeenLastCalledWith({ page: 1, pageSize: 10 });
    });

    it('shows an error toast and keeps the rows when the delete fails', async () => {
      vi.mocked(listSubmissions).mockResolvedValue({ items: [testSubmission], total: 1 });
      vi.mocked(deleteSubmission).mockRejectedValue(new Error('delete failed'));
      const { wrapper } = await mountSubmissionsView();

      await deleteAndAccept(wrapper);

      expect(mockToast.error).toHaveBeenCalledWith('Unable to delete the submission. Please try again.');
      expect(listSubmissions).toHaveBeenCalledOnce();
    });
  });
});
