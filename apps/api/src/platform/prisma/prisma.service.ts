import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

/**
 * Aurora PostgreSQL access (BRS §5.3). Connects lazily on first query.
 * Tenant scoping: repositories must always filter by tenantId (SEC-D10). A Postgres row-level
 * security policy on `tenant_id` is the backstop — see prisma/rls.sql.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' }) });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
