import { config } from 'dotenv';
import { join } from 'node:path';

// Load .env, falling back to .env.default for anything it doesn't set.
// Variables already in the environment (e.g. from the OpenShift configmap) always win.
config({
  path: [join(import.meta.dirname, '../.env'), join(import.meta.dirname, '../.env.default')],
  quiet: true
});
