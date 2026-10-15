import { SetMetadata } from '@nestjs/common';

/**
 * Which identity pool may call a route. Internal staff and external suppliers authenticate against
 * separate, isolated pools (SEC-A03). Method-level metadata overrides class-level.
 */
export type RouteAudience = 'internal' | 'supplier' | 'any' | 'public';

export const AUDIENCE_KEY = 'if:audience';
export const Audience = (audience: RouteAudience) => SetMetadata(AUDIENCE_KEY, audience);
export const Public = () => SetMetadata(AUDIENCE_KEY, 'public' satisfies RouteAudience);
