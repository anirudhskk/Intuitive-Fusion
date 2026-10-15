import { randomUUID } from 'node:crypto';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Principal } from '@if/domain';
import { Observable } from 'rxjs';
import { runWithContext } from './tenant-context.js';

/** Binds the authenticated principal + tenant to the async context for the rest of the request. */
@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = ctx.switchToHttp().getRequest<{ principal?: Principal; headers: Record<string, string> }>();
    if (!req.principal) return next.handle(); // public route

    const requestContext = {
      principal: req.principal,
      tenantId: req.principal.tenantId,
      requestId: req.headers['x-request-id'] ?? randomUUID(),
    };
    return new Observable((subscriber) =>
      runWithContext(requestContext, () => next.handle().subscribe(subscriber)),
    );
  }
}
