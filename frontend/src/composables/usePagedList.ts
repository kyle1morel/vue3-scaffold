import { ref, shallowRef } from 'vue';

import type { Ref } from 'vue';

export interface PageRequest {
  page: number;
  pageSize: number;
}

/**
 * Holds one page of a server-paged list for a paginated DataTable, and loads it.
 * @param fetchPage - Fetches a 1-based page, resolving to its items and the total across every page.
 * @param options - The starting page size, 10 unless given.
 * @returns The page state to bind to the DataTable, `load` for its page event, and `reloadAfterRemove`.
 */
export function usePagedList<T>(
  fetchPage: (request: PageRequest) => Promise<{ items: T[]; total: number }>,
  { pageSize = 10 } = {}
) {
  const loading = ref(false);
  const page = ref(1);
  const size = ref(pageSize);
  const rows = shallowRef<T[]>([]) as Ref<T[]>;
  const total = ref(0);

  async function load() {
    loading.value = true;
    try {
      const result = await fetchPage({ page: page.value, pageSize: size.value });
      rows.value = result.items;
      total.value = result.total;
    } finally {
      loading.value = false;
    }
  }

  // Removing the last row on a page leaves it empty, so this shows the page before it.
  function reloadAfterRemove() {
    if (rows.value.length === 1 && page.value > 1) page.value--;
    return load();
  }

  return { load, loading, page, pageSize: size, reloadAfterRemove, rows, total };
}
