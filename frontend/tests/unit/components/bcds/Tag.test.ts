import { mount } from '@vue/test-utils';

import Tag from '@/components/bcds/Tag.vue';

// Mocks

// Fixtures

// Mount

function mountTag(props: Record<string, unknown> = {}) {
  return { wrapper: mount(Tag, { props, slots: { default: 'Unsaved changes' } }) };
}

// Tests

describe('Tag', () => {
  describe('rendering', () => {
    it('shows its content in the given colour', () => {
      const { wrapper } = mountTag({ color: 'yellow' });

      expect(wrapper.text()).toBe('Unsaved changes');
      expect(wrapper.classes()).toContain('yellow');
    });

    it('defaults to blue', () => {
      const { wrapper } = mountTag();

      expect(wrapper.classes()).toContain('blue');
    });
  });
});
