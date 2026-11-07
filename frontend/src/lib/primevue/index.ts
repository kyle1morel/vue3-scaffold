// PrimeVue used outside components/bcds; everything else goes through a bcds component

// Deliberately unwrapped: one or two users each, and no BC Design System equivalent
export { default as Breadcrumb } from 'primevue/breadcrumb';
export { default as Card } from 'primevue/card';
export { default as Column } from 'primevue/column';
export { default as DataTable } from 'primevue/datatable';
export { default as Drawer } from 'primevue/drawer';
export { default as Menu } from 'primevue/menu';
export { default as StyleClass } from 'primevue/styleclass';
export { default as Toast } from 'primevue/toast';
export { useConfirm } from 'primevue/useconfirm';
export { useToast } from './useToast';

export type { DataTablePageEvent } from 'primevue/datatable';
export type { MenuItem } from 'primevue/menuitem';
export type { ToastMessageOptions } from 'primevue/toast';

// TODO: Move each into a components/bcds component, then drop it from here
export { default as ConfirmDialog } from 'primevue/confirmdialog';
export { default as Divider } from 'primevue/divider';
export { default as Message } from 'primevue/message';
export { default as ProgressBar } from 'primevue/progressbar';
export { default as ProgressSpinner } from 'primevue/progressspinner';
export { default as Select } from 'primevue/select';
