import DemoFormView from '@/views/DemoFormView.vue';

import { mockRouter, resetMockRouter } from '../../mockRouter';
import { mountComponent } from '../../mountComponent';

// Mocks

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
  useRouter: () => mockRouter
}));

// Fixtures

const testSections = ['Contact', 'Details', 'Notes'];

// Mount

function mountDemoFormView() {
  // Quill doesn't run in happy-dom
  const { wrapper } = mountComponent(DemoFormView, { stubs: { Editor: true } });

  return { wrapper };
}

beforeEach(() => {
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
    });
  });
});
