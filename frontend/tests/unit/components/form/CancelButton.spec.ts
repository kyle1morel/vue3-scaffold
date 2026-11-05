import { flushPromises } from '@vue/test-utils';

import CancelButton from '@/components/form/CancelButton.vue';

import { mountWithFormContext, setFieldValue } from '../../../mountWithFormContext';

// Mocks

// Fixtures

// Mount

function mountCancelButton() {
  const onClick = vi.fn();

  const { wrapper } = mountWithFormContext(CancelButton, {
    fields: ['testField'],
    componentProps: { onClick }
  });

  return { wrapper, onClick };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// Tests

describe('CancelButton', () => {
  it('renders', async () => {
    const { wrapper } = mountCancelButton();
    await flushPromises();

    expect(wrapper.findComponent(CancelButton).exists()).toBe(true);
  });

  it('is disabled when the form has not been touched', async () => {
    const { wrapper } = mountCancelButton();
    await flushPromises();

    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('becomes enabled once a field changes, making the form dirty', async () => {
    const { wrapper } = mountCancelButton();
    await flushPromises();

    await setFieldValue(wrapper, 'testField', 'something');

    expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
  });

  it('passes clicks to the listener while enabled', async () => {
    const { wrapper, onClick } = mountCancelButton();
    await flushPromises();

    await setFieldValue(wrapper, 'testField', 'something');
    await wrapper.find('button').trigger('click');

    expect(onClick).toHaveBeenCalledOnce();
  });
});
