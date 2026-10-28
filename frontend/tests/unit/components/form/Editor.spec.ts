import Editor from '@/components/form/Editor.vue';

import { mountComponent } from '../../../mountComponent';

// Mocks

// Fixtures

// Mount

// PrimeVue's Editor wraps Quill, which starts an async init loop that never
// settles under happy-dom and hangs the test -- stub it out. The stub is
// given a name distinct from 'Editor' because our own wrapper component's
// inferred SFC name is *also* 'Editor' (same filename), and VTU's
// findComponent(name) matching would otherwise resolve to the wrong node
// (our wrapper root) once the real child is replaced by a same-named stub.
const PvEditorStub = { name: 'PvEditorStub', props: ['editorStyle', 'readonly', 'pt'], template: '<div />' };

function mountEditor(options: { props?: Record<string, unknown> } = {}) {
  const { wrapper } = mountComponent(Editor, {
    props: { name: 'basic.description', ...options.props },
    stubs: { Editor: PvEditorStub }
  });

  return { wrapper };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('Editor', () => {
  describe('rendering', () => {
    it('renders a PrimeVue Editor with the default height', () => {
      const { wrapper } = mountEditor();

      const pvEditor = wrapper.findComponent(PvEditorStub);
      expect(pvEditor.exists()).toBe(true);
      expect(pvEditor.props('editorStyle')).toBe('height: 160px');
    });

    it('passes a custom height through to editor-style', () => {
      const { wrapper } = mountEditor({ props: { height: '300px' } });

      expect(wrapper.findComponent(PvEditorStub).props('editorStyle')).toBe('height: 300px');
    });

    it('renders the help text scoped to the given name', () => {
      const { wrapper } = mountEditor({ props: { helpText: 'Describe the project' } });

      expect(wrapper.find('#basic\\.description-help').text()).toBe('Describe the project');
    });

    it('is editable with a toolbar by default', () => {
      const { wrapper } = mountEditor();

      const pvEditor = wrapper.findComponent(PvEditorStub);
      expect(pvEditor.props('readonly')).toBe(false);
      expect(pvEditor.props('pt')).toEqual({ toolbar: { class: { hidden: false } } });
    });

    it('is read only with the toolbar hidden when disabled', () => {
      const { wrapper } = mountEditor({ props: { disabled: true } });

      const pvEditor = wrapper.findComponent(PvEditorStub);
      expect(pvEditor.props('readonly')).toBe(true);
      expect(pvEditor.props('pt')).toEqual({ toolbar: { class: { hidden: true } } });
    });
  });
});
