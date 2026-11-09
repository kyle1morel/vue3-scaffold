import { usePagedList } from '@/composables/usePagedList';

// Mocks

// Fixtures

// Rows numbered across every page, so each page's rows show where it starts
function testPage({ page, pageSize }: { page: number; pageSize: number }, total = 25) {
  const start = (page - 1) * pageSize;
  const items = Array.from({ length: Math.max(0, Math.min(pageSize, total - start)) }, (_, i) => start + i + 1);
  return Promise.resolve({ items, total });
}

// Mount

function setup(fetchPage = vi.fn(testPage), options?: { pageSize?: number }) {
  return { fetchPage, list: usePagedList(fetchPage, options) };
}

// Tests

describe('usePagedList', () => {
  describe('load', () => {
    it('loads the first page of 10 by default', async () => {
      const { fetchPage, list } = setup();

      await list.load();

      expect(fetchPage).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
      expect(list.rows.value).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(list.total.value).toBe(25);
    });

    it('starts at the page size it is given', async () => {
      const { fetchPage, list } = setup(undefined, { pageSize: 25 });

      await list.load();

      expect(fetchPage).toHaveBeenCalledWith({ page: 1, pageSize: 25 });
    });

    it('loads the page and page size the table has moved to', async () => {
      const { fetchPage, list } = setup();
      list.page.value = 3;
      list.pageSize.value = 5;

      await list.load();

      expect(fetchPage).toHaveBeenCalledWith({ page: 3, pageSize: 5 });
      expect(list.rows.value).toEqual([11, 12, 13, 14, 15]);
    });

    it('is loading only while the page is fetched', async () => {
      const { list } = setup();

      const loaded = list.load();
      expect(list.loading.value).toBe(true);
      await loaded;

      expect(list.loading.value).toBe(false);
    });

    it('stops loading and keeps the rows when the fetch fails', async () => {
      const fetchPage = vi.fn(testPage);
      const { list } = setup(fetchPage);
      await list.load();
      fetchPage.mockRejectedValueOnce(new Error('load failed'));

      await expect(list.load()).rejects.toThrow('load failed');

      expect(list.loading.value).toBe(false);
      expect(list.rows.value).toHaveLength(10);
    });
  });

  describe('reloadAfterRemove', () => {
    it('reloads the same page when other rows remain on it', async () => {
      const { fetchPage, list } = setup();
      list.page.value = 2;
      await list.load();

      await list.reloadAfterRemove();

      expect(fetchPage).toHaveBeenLastCalledWith({ page: 2, pageSize: 10 });
    });

    it('shows the page before when the last row on a page is removed', async () => {
      const { fetchPage, list } = setup(vi.fn((request) => testPage(request, 21)));
      list.page.value = 3;
      await list.load();

      await list.reloadAfterRemove();

      expect(list.page.value).toBe(2);
      expect(fetchPage).toHaveBeenLastCalledWith({ page: 2, pageSize: 10 });
    });

    it('stays on the first page when its last row is removed', async () => {
      const { fetchPage, list } = setup(vi.fn((request) => testPage(request, 1)));
      await list.load();

      await list.reloadAfterRemove();

      expect(list.page.value).toBe(1);
      expect(fetchPage).toHaveBeenLastCalledWith({ page: 1, pageSize: 10 });
    });
  });
});
