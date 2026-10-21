import { defineConfig } from 'prisma/config';

import '#src/env';
import { getDatabaseUrl } from '#src/db/url';

export default defineConfig({
  schema: 'src/db/prisma/schema.prisma',
  // No `migrations` block, as migrate.ts (Kysely) owns migrations, not `prisma migrate`.
  datasource: {
    url: getDatabaseUrl()
  }
});
