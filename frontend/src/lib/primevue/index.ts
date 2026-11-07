// PrimeVue used outside components/bcds; everything else goes through a bcds component

// Deliberately unwrapped: one or two users each, and no BC Design System equivalent
export { default as Breadcrumb } from 'primevue/breadcrumb';
export { default as Column } from 'primevue/column';
export { default as DataTable } from 'primevue/datatable';

export type { DataTablePageEvent } from 'primevue/datatable';
export type { MenuItem } from 'primevue/menuitem';
