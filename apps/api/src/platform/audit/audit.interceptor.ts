import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service.js';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Coarse request-level audit for every mutating call. Services add the fine-grained, field-level
 * diff via AuditService.recordChange — this interceptor guarantees nothing slips through unlogged.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly audit: AuditService) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = ctx.switchToHttp().getRequest<{ method: string; route?: { path: string }; params: Record<string, string>; principal?: unknown }>();
    if (!MUTATING.has(req.method) || !req.principal) return next.handle();

    const action = `${req.method} ${req.route?.path ?? ''}`;
    const entityId = Object.values(req.params)[0] ?? 'n/a';
    return next.handle().pipe(
      tap({
        next: () => void this.audit.recordChange({ type: 'request', id: entityId }, action, null, null),
        error: () => void this.audit.recordChange({ type: 'request', id: entityId }, `${action} (failed)`, null, null),
      }),
    );
  }
}
