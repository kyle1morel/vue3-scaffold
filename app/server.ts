#!/usr/bin/env node

/** Module dependencies. */
import { createServer } from 'node:http';

import '#src/env';
import app from './app.ts';
import prisma, { checkDatabaseHealth } from '#src/db/database';
import { getLogger } from '#src/utils/log';
import { state } from './state.ts';

const log = getLogger(import.meta.filename);
const port = normalizePort(process.env.SERVER_PORT ?? '3000');

// Time for the load balancer to see readiness fail and stop routing here; skipped locally so restarts stay quick
const DRAIN_MS = process.env.NODE_ENV === 'production' ? 5000 : 0;

// Log crashes through pino before Node exits; unhandled rejections are thrown as uncaught exceptions by default
process.on('uncaughtExceptionMonitor', (err, origin) => log.fatal({ err, origin }, 'Process crashed'));

// Graceful shutdown support
['SIGHUP', 'SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'].forEach((signal) => {
  process.on(signal, () => shutdown(signal as NodeJS.Signals));
});
process.on('exit', () => log.info('Exiting...'));

// Create HTTP server and listen on provided port, on all network interfaces.
const server = createServer(app);
server.listen(port, () => {
  log.info(`Server running on http://localhost:${port}`);
});
server.on('error', onError);

// Start periodic 10 second connection probes
const probeId = setInterval(() => {
  void checkDatabaseHealth().then((result) => {
    if (!state.ready && result) log.info('Database has recovered');
    state.ready = result;
  });
}, 10000);

// Perform preliminary database checks
void startup();

/**
 * Normalize a port into a number, string, or false.
 * @param val - Port string value.
 * @returns A number, string or false.
 */
function normalizePort(val: string): string | number | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param error - Error event.
 * @param error.syscall - System call.
 * @param error.code - Error code.
 */
function onError(error: { syscall?: string; code: string }): void {
  if (error.syscall !== 'listen') throw error;

  // Handle specific listen errors with friendly messages
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      log.error(`${bind} requires elevated privileges`);
      shutdown('SIGABRT');
      break;
    case 'EADDRINUSE':
      log.error(`${bind} is already in use`);
      shutdown('SIGABRT');
      break;
    default:
      throw error;
  }
}

/**
 * Gracefully shuts down the server and exits the process.
 * @see https://nodejs.org/api/http.html#servercloseallconnections
 * @param signal - Optional termination signal (e.g., 'SIGINT', 'SIGTERM').
 */
function cleanup(signal?: NodeJS.Signals): void {
  // Stops new connections and waits for in-flight requests before the database goes away
  server.close(() => {
    log.info('Server shut down');
    void prisma
      .$disconnect()
      .catch((error: unknown) => log.error(error, 'Error disconnecting from the database'))
      .finally(() => {
        if (signal) {
          // Drop our handler first, or the re-sent signal re-enters shutdown instead of terminating.
          process.removeAllListeners(signal);
          process.kill(process.pid, signal);
        } else process.exit();
      });
  });
}

/**
 * Handles application shutdown on termination signals.
 * @param signal - Received termination signal (e.g., 'SIGINT', 'SIGTERM').
 */
function shutdown(signal: NodeJS.Signals): void {
  // A second signal while draining would close the server twice
  if (state.shutdown) return;
  state.shutdown = true;
  log.info(`Received ${signal} signal. Shutting down...`);

  // Stop periodic 10 second connection probes
  if (probeId) clearInterval(probeId);
  setTimeout(() => cleanup(signal), DRAIN_MS);
}

/**
 * Initializes the server by performing database health checks.
 * An unavailable database leaves the server not ready rather than exiting; the connection probes flip it on recovery.
 */
async function startup(): Promise<void> {
  state.ready = await checkDatabaseHealth();
}
