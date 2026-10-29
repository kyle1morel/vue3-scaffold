import '#src/env';
import prisma from '#src/db/database';
import { getLogger } from '#src/utils/log';

/**
 * Seeds demo submissions for local development. Fixed ids make it safe to rerun.
 * Usage: `npm run seed`.
 */

const log = getLogger(import.meta.filename);

const SEED_COUNT = 25;
const DAY_MS = 24 * 60 * 60 * 1000;

const names = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan'];
const places = [
  { province: 'AB', city: 'Calgary' },
  { province: 'BC', city: 'Victoria' },
  { province: 'SK', city: 'Regina' }
] as const;
const categories = ['feedback', 'question', 'request'];

const submissions = Array.from({ length: SEED_COUNT }, (_, i) => {
  const firstName = names[i % names.length]!;
  return {
    // Valid v4 ids, as the API validates them
    id: `5eed0000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
    firstName,
    email: `${firstName.toLowerCase()}${i + 1}@example.com`,
    phone: i % 2 ? '250-555-0100' : null,
    contactMethod: i % 2 ? ('phone' as const) : ('email' as const),
    ...places[i % places.length]!,
    category: categories[i % categories.length]!,
    quantity: (i % 10) + 1,
    // Spread over past days so the newest-first list has a visible order
    createdAt: new Date(Date.now() - i * DAY_MS)
  };
});

try {
  const { count } = await prisma.submission.createMany({ data: submissions, skipDuplicates: true });
  log.info(`Seeded ${count} submissions, ${SEED_COUNT - count} already existed`);
} catch (error) {
  log.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
