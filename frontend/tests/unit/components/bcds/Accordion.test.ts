import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';

import { Accordion, AccordionGroup } from '@/components/bcds';

// Mocks

// Fixtures

const testFaqs = ['apply', 'cost', 'time'];

// Mount

function mountGroup(props: Record<string, unknown> = {}) {
  const wrapper = mount(AccordionGroup, {
    props: { modelValue: ['apply'], title: 'Questions', ...props },
    slots: { default: () => testFaqs.map((faq) => h(Accordion, { label: faq, value: faq }, () => `${faq} answer`)) }
  });

  return { wrapper, buttons: wrapper.findAll('button') };
}

// Tests

describe('Accordion', () => {
  it('shows its content once expanded', async () => {
    const wrapper = mount(Accordion, {
      props: { label: 'What is it?', open: false },
      slots: { default: () => 'An answer' }
    });
    const button = wrapper.find('button');

    expect(button.attributes('aria-expanded')).toBe('false');
    expect(wrapper.text()).not.toContain('An answer');

    await button.trigger('click');
    await wrapper.setProps({ open: wrapper.emitted<[boolean]>('update:open')![0]![0] });

    expect(button.attributes('aria-expanded')).toBe('true');
    expect(wrapper.text()).toContain('An answer');
  });
});

describe('AccordionGroup', () => {
  it('shows its title', () => {
    const { wrapper } = mountGroup();

    expect(wrapper.find('.bcds-accordion-group-title').text()).toBe('Questions');
  });

  it('expands the accordions it is given', () => {
    const { buttons } = mountGroup();

    expect(buttons.map((button) => button.attributes('aria-expanded'))).toEqual(['true', 'false', 'false']);
  });

  it('expands one accordion at a time', async () => {
    const { wrapper, buttons } = mountGroup();

    await buttons[1]!.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[['cost']]]);
  });

  it('collapses the expanded accordion', async () => {
    const { wrapper, buttons } = mountGroup();

    await buttons[0]!.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[[]]]);
  });

  it('expands several accordions when multiple', async () => {
    const { wrapper, buttons } = mountGroup({ multiple: true });

    await buttons[2]!.trigger('click');
    await nextTick();

    expect(wrapper.emitted('update:modelValue')).toEqual([[['apply', 'time']]]);
  });
});
