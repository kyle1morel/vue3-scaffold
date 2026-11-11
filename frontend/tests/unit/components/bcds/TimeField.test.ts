import { mount } from '@vue/test-utils';

import { TimeField } from '@/components/bcds';
import i18n from '@/i18n';

// Mocks

// Fixtures

// Mount

function mountTimeField(props: Record<string, unknown> = {}) {
  const wrapper = mount(TimeField, {
    props: { label: 'A meeting time', ...props },
    global: { plugins: [i18n] }
  });

  return { wrapper, segments: wrapper.findAll('.bcds-time-field-segment') };
}

// Tests

describe('TimeField', () => {
  it('names the time segments with the label', () => {
    const { wrapper } = mountTimeField();
    const field = wrapper.find('[aria-labelledby]');

    expect(wrapper.find(`[id="${field.attributes('aria-labelledby')}"]`).text()).toBe('A meeting time');
  });

  it('shows the time it is given', () => {
    const { segments } = mountTimeField({ modelValue: '14:05' });

    expect(segments.map((segment) => segment.text())).toEqual(['2', '05', 'PM']);
  });

  it('gives a changed time as 24 hour HH:mm', async () => {
    const { wrapper, segments } = mountTimeField({ modelValue: '09:30' });

    await segments[0]!.trigger('keydown', { key: 'ArrowUp' });

    expect(wrapper.emitted('update:modelValue')).toEqual([['10:30']]);
  });
});
