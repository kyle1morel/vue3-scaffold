import { defineComponent, inject, onBeforeUnmount } from 'vue';

import { DATA_TABLE } from './DataTable.vue';

import type { SlotsType } from 'vue';

/**
 * A DataTable column. It renders nothing itself; the table draws it from what it registers.
 */
export default defineComponent({
  props: {
    // The row field the cell shows, unless the body slot renders it
    field: { type: String, default: undefined },
    header: { type: String, required: true }
  },
  // A column can't know its table's row type, so the row is untyped.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slots: Object as SlotsType<{ body?: (props: { data: any }) => unknown }>,
  setup(props, { slots }) {
    const table = inject(DATA_TABLE);
    const column = {
      get body() {
        return slots.body;
      },
      get field() {
        return props.field;
      },
      get header() {
        return props.header;
      }
    };

    table?.register(column);
    onBeforeUnmount(() => table?.unregister(column));

    return () => null;
  }
});
