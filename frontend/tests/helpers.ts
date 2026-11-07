// Minimal Standard Schema shape (https://standardschema.dev), as implemented by zod
interface StandardSchema {
  '~standard': {
    validate: (value: unknown) => StandardResult | Promise<StandardResult>;
  };
}

type StandardResult =
  | { value: unknown; issues?: undefined }
  | { issues: readonly { message: string; path?: readonly (PropertyKey | { key: PropertyKey })[] }[] };

/*
 * Runs any Standard Schema and flattens the result to { value, errors } keyed by dotted path
 */
export async function runSchema(schema: StandardSchema, input: unknown) {
  const result = await schema['~standard'].validate(input);
  if (!result.issues) return { value: result.value, errors: {} };
  const errors: Record<string, string> = {};
  for (const issue of result.issues) {
    const path = (issue.path ?? []).map((p) => String(typeof p === 'object' ? p.key : p)).join('.');
    errors[path] ??= issue.message;
  }
  return { value: undefined, errors };
}
