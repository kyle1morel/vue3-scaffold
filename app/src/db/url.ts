/**
 * Builds the Postgres connection string from the SERVER_DB_* environment variables.
 * @returns A `postgresql://` connection string with the credentials URI encoded.
 */
export function getDatabaseUrl(): string {
  const { SERVER_DB_DATABASE, SERVER_DB_HOST, SERVER_DB_PASSWORD, SERVER_DB_PORT, SERVER_DB_USERNAME } = process.env;
  const user = encodeURIComponent(SERVER_DB_USERNAME ?? '');
  const password = encodeURIComponent(SERVER_DB_PASSWORD ?? '');
  return `postgresql://${user}:${password}@${SERVER_DB_HOST}:${SERVER_DB_PORT}/${SERVER_DB_DATABASE}`;
}
