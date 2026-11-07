/** The type of any value of an object, such as the values of an `as const` enum object. */
export type ValueOf<T> = T[keyof T];
