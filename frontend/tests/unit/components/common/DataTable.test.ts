import { defineComponent, h, nextTick } from 'vue';

import { Select } from '@/components/bcds';
import Column from '@/components/common/Column';
import DataTable from '@/components/common/DataTable.vue';

import { expectNoAxeViolations } from '../../../expectNoAxeViolations';
import { mountComponent } from '../../../mountComponent';

import type { Component } from 'vue';

// Mocks

// Fixtures

const testRows = [
  { id: 'a', name: 'Ann', city: 'Victoria' },
  { id: 'b', name: 'Bob', city: 'Nanaimo' }
];

// Mount

// mountComponent takes no slots, so a parent renders the table with its columns.
async function mountDataTable(
  props: Record<string, unknown> = {},
  { cityBody, empty }: { cityBody?: (scope: { data: { city: string } }) => string; empty?: string } = {}
) {
  const Parent = defineComponent(
    () => () =>
      h(
        DataTable as Component,
        { paginator: true, rowKey: 'id', rows: testRows, total: 2, ...props },
        {
          default: () => [
            h(Column, { field: 'name', header: 'Name' }),
            h(Column, { field: 'city', header: 'City' }, cityBody ? { body: cityBody } : undefined)
          ],
          empty: () => empty
        }
      )
  );
  const { wrapper } = mountComponent(Parent);
  // The columns register as they mount, after the table's first render.
  await nextTick();
  const table = wrapper.findComponent({ name: 'DataTable' });
  const button = (label: string) => wrapper.find(`button[aria-label="${label}"]`);

  return { wrapper, table, button };
}

// Tests

describe('DataTable', () => {
  describe('rendering', () => {
    it('renders a header per column and a row per item', async () => {
      const { wrapper } = await mountDataTable();

      expect(wrapper.findAll('th').map((th) => th.text())).toEqual(['Name', 'City']);
      expect(wrapper.findAll('tbody tr').map((tr) => tr.findAll('td').map((td) => td.text()))).toEqual([
        ['Ann', 'Victoria'],
        ['Bob', 'Nanaimo']
      ]);
    });

    it('renders the body slot in place of the field', async () => {
      const { wrapper } = await mountDataTable({}, { cityBody: ({ data }) => `In ${data.city}` });

      expect(wrapper.find('tbody td:nth-child(2)').text()).toBe('In Victoria');
    });

    it('shows the empty slot when there are no rows', async () => {
      const { wrapper } = await mountDataTable({ rows: [], total: 0 }, { empty: 'Nothing here' });

      expect(wrapper.find('tbody').text()).toBe('Nothing here');
    });

    it('marks the table busy and hides the empty slot while loading', async () => {
      const { wrapper } = await mountDataTable({ loading: true, rows: [], total: 0 }, { empty: 'Nothing here' });

      expect(wrapper.find('table').attributes('aria-busy')).toBe('true');
      expect(wrapper.find('[role="progressbar"]').exists()).toBe(true);
      expect(wrapper.find('tbody').text()).toBe('');
    });
  });

  describe('paging', () => {
    it('shows no pager without paginator', async () => {
      const { wrapper } = await mountDataTable({ paginator: false });

      expect(wrapper.find('nav').exists()).toBe(false);
    });

    it('numbers the pages near the current one, keeps the first and last, and marks the current page', async () => {
      const { wrapper } = await mountDataTable({ page: 5, pageSize: 10, total: 130 });

      const pages = wrapper.findAll('nav button[aria-label^="Page "]');
      expect(pages.map((page) => page.text())).toEqual(['1', '4', '5', '6', '13']);
      expect(wrapper.find('[aria-current="page"]').attributes('aria-label')).toBe('Page 5');
    });

    it('moves to the page whose number is pressed', async () => {
      const { table, button } = await mountDataTable({ page: 1, pageSize: 10, total: 50 });

      await button('Page 3').trigger('click');

      expect(table.emitted('update:page')).toEqual([[3]]);
    });

    it('disables the first and previous buttons on the first page, and next and last on the last', async () => {
      const { button } = await mountDataTable({ page: 1, pageSize: 10, total: 10 });

      const labels = ['First page', 'Previous page', 'Next page', 'Last page'];
      expect(labels.map((label) => button(label).attributes('disabled'))).toEqual(['', '', '', '']);
    });

    it.each([
      ['First page', 1],
      ['Previous page', 2],
      ['Next page', 4],
      ['Last page', 5]
    ])('moves to the right page with the %s button', async (label, expected) => {
      const { table, button } = await mountDataTable({ page: 3, pageSize: 10, total: 50 });

      await button(label).trigger('click');

      expect(table.emitted('update:page')).toEqual([[expected]]);
      expect(table.emitted('page')).toEqual([[{ page: expected, pageSize: 10 }]]);
    });

    it('goes back to the first page when the page size changes', async () => {
      const { wrapper, table } = await mountDataTable({ page: 3, pageSize: 10, total: 50 });

      wrapper.findComponent(Select).vm.$emit('update:modelValue', 25);

      expect(table.emitted('update:pageSize')).toEqual([[25]]);
      expect(table.emitted('update:page')).toEqual([[1]]);
      expect(table.emitted('page')).toEqual([[{ page: 1, pageSize: 25 }]]);
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { wrapper } = await mountDataTable();

      await expectNoAxeViolations(wrapper.element);
    });
  });
});
