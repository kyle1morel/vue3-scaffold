import { mount } from '@vue/test-utils';

import { Calendar } from '@/components/bcds';
import i18n from '@/i18n';

// Mocks

// Fixtures

// Mount

function mountCalendar(props: Record<string, unknown> = {}) {
  const wrapper = mount(Calendar, {
    props: { modelValue: new Date(2026, 2, 10), ...props },
    global: { plugins: [i18n] }
  });

  return {
    wrapper,
    day: (text: string) =>
      wrapper.findAll('.bcds-calendar-cell:not([data-outside-view])').find((cell) => cell.text() === text)!
  };
}

// Tests

describe('Calendar', () => {
  it('shows the month of its value, with the day selected', () => {
    const { wrapper, day } = mountCalendar();

    expect(wrapper.find('.bcds-calendar-heading').text()).toContain('March');
    expect(day('10').attributes('data-selected')).toBeDefined();
  });

  it('gives a picked day as a local date', async () => {
    const { wrapper, day } = mountCalendar();

    await day('15').trigger('click');

    expect(wrapper.emitted<[Date]>('update:modelValue')![0]![0]).toEqual(new Date(2026, 2, 15));
  });

  it('strikes out unavailable dates', () => {
    const { day } = mountCalendar({ unavailableDate: (date: Date) => date.getDay() === 0 });

    expect(day('15').attributes('data-unavailable')).toBeDefined();
  });

  it('switches to months, and back to days once one is picked', async () => {
    const { wrapper } = mountCalendar();

    await wrapper.find('.bcds-calendar-view-button').trigger('click');
    const may = wrapper.findAll('.bcds-calendar-period').find((cell) => cell.text() === 'May')!;
    await may.trigger('click');

    expect(wrapper.find('.bcds-calendar-heading').text()).toContain('May');
  });
});
