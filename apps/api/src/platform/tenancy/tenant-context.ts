import { AsyncLocalStorage } from 'node:async_hooks';
import type { Principal } from '@if/domain';

export interface RequestContext {
  principal: Principal;
  tenantId: string;
  requestId: string;
}

const storage = new AsyncLocalStorage<RequestContext>();

export function runWithContext<T>(ctx: RequestContext, fn: () => T): T {
  return storage.run(ctx, fn);
}

/**
 * The tenant/principal for the current request. Every repository call must be scoped by
 * `currentContext().tenantId` (SEC-D10). Throws if called outside a request.
 */
export function currentContext(): RequestContext {
  const ctx = storage.getStore();
  if (!ctx) throw new Error('No request context — tenant-scoped code called outside a request');
  return ctx;
}
