import RichTextEditor from '@/components/form/RichTextEditor.vue';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

// Mount

// PrimeVue's Editor wraps Quill, which starts an async init loop that never settles under happy-dom and hangs the
// test, so it's stubbed out.
const PvEditorStub = { name: 'PvEditorStub', props: ['editorStyle', 'readonly', 'pt'], template: '<div />' };

function mountRichTextEditor(options: { props?: Record<string, unknown> } = {}) {
  const { wrapper } = mountComponent(RichTextEditor, {
    props: { name: 'basic.description', ...options.props },
    stubs: { Editor: PvEditorStub }
  });

  return { wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('RichTextEditor', () => {
  describe('rendering', () => {
    it('renders a PrimeVue Editor with the default height', () => {
      const { wrapper } = mountRichTextEditor();

      const pvEditor = wrapper.findComponent(PvEditorStub);
      expect(pvEditor.exists()).toBe(true);
      expect(pvEditor.props('editorStyle')).toBe('height: 160px');
    });

    it('passes a custom height through to editor-style', () => {
      const { wrapper } = mountRichTextEditor({ props: { height: '300px' } });

      expect(wrapper.findComponent(PvEditorStub).props('editorStyle')).toBe('height: 300px');
    });

    it('renders the description', () => {
      const { wrapper } = mountRichTextEditor({ props: { description: 'Describe the project' } });

      expect(wrapper.find('small').text()).toBe('Describe the project');
    });

    it('is editable with a toolbar by default', () => {
      const { wrapper } = mountRichTextEditor();

      const pvEditor = wrapper.findComponent(PvEditorStub);
      expect(pvEditor.props('readonly')).toBe(false);
      expect(pvEditor.props('pt')).toEqual({ toolbar: { class: { hidden: false } } });
    });

    it('is read only with the toolbar hidden when disabled', () => {
      const { wrapper } = mountRichTextEditor({ props: { disabled: true } });

      const pvEditor = wrapper.findComponent(PvEditorStub);
      expect(pvEditor.props('readonly')).toBe(true);
      expect(pvEditor.props('pt')).toEqual({ toolbar: { class: { hidden: true } } });
    });
  });
});
