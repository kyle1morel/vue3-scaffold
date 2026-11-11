import { mount } from '@vue/test-utils';

import { CheckboxGroup } from '@/components/bcds';
import i18n from '@/i18n';

// Mocks

// Fixtures

const testOptions = [
  { label: 'News', value: 'news' },
  { label: 'Events', value: 'events' }
];

// Mount

function mountCheckboxGroup(props: Record<string, unknown> = {}) {
  const wrapper = mount(CheckboxGroup, {
    props: { label: 'Topics', modelValue: ['news'], options: testOptions, ...props },
    global: { plugins: [i18n] }
  });

  return { wrapper, boxes: wrapper.findAll('[role="checkbox"]') };
}

// Tests

describe('CheckboxGroup', () => {
  describe('rendering', () => {
    it('names the group with its label', () => {
      const { wrapper } = mountCheckboxGroup();
      const group = wrapper.find('[role="group"]');

      expect(wrapper.find(`[id="${group.attributes('aria-labelledby')}"]`).text()).toBe('Topics');
    });

    it('ticks the selected options', () => {
      const { boxes } = mountCheckboxGroup();

      expect(boxes.map((box) => box.attributes('aria-checked'))).toEqual(['true', 'false']);
    });

    it('marks every box invalid with the group error', () => {
      const { boxes } = mountCheckboxGroup({ errorMessage: 'Choose a topic' });

      expect(boxes.map((box) => box.attributes('aria-invalid'))).toEqual(['true', 'true']);
    });
  });

  describe('user interaction', () => {
    it('adds a ticked option', async () => {
      const { wrapper, boxes } = mountCheckboxGroup();

      await boxes[1]!.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toEqual([[['news', 'events']]]);
    });

    it('removes an unticked option', async () => {
      const { wrapper, boxes } = mountCheckboxGroup();

      await boxes[0]!.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toEqual([[[]]]);
    });
  });
});
