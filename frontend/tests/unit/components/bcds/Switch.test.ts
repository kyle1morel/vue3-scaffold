import { mount } from '@vue/test-utils';

import { Switch } from '@/components/bcds';
import i18n from '@/i18n';

// Mocks

// Fixtures

// Mount

function mountSwitch(props: Record<string, unknown> = {}) {
  const wrapper = mount(Switch, {
    props: { label: 'Email me updates', modelValue: false, ...props },
    global: { plugins: [i18n] }
  });

  return { wrapper, input: wrapper.find('[role="switch"]') };
}

// Tests

describe('Switch', () => {
  describe('rendering', () => {
    it('links the label to the switch', () => {
      const { wrapper, input } = mountSwitch();

      expect(wrapper.find(`label[for="${input.attributes('id')}"]`).text()).toBe('Email me updates');
    });

    it('shows the error on the switch and describes it with the message', () => {
      const { wrapper, input } = mountSwitch({ errorMessage: 'Choose whether to get updates' });

      expect(input.attributes('aria-invalid')).toBe('true');
      expect(input.classes()).toContain('bcds-switch-invalid');
      expect(wrapper.find(`[id="${input.attributes('aria-describedby')}"]`).text()).toBe(
        'Choose whether to get updates'
      );
    });

    it('shows its value', () => {
      const { input } = mountSwitch({ modelValue: true });

      expect(input.attributes('aria-checked')).toBe('true');
    });
  });

  describe('user interaction', () => {
    it('turns on when clicked', async () => {
      const { wrapper, input } = mountSwitch();

      await input.trigger('click');

      expect(wrapper.emitted('update:modelValue')).toEqual([[true]]);
    });

    it('ignores clicks when read only', async () => {
      const { wrapper, input } = mountSwitch({ readonly: true });

      await input.trigger('click');

      expect(input.attributes('aria-readonly')).toBe('true');
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
  });
});
