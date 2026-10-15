-- Defence in depth for tenant isolation (SEC-D10) and the append-only audit trail (SEC-L01).
-- Applied after Prisma migrations. The API sets `SET app.tenant_id = '<uuid>'` per transaction.

-- Example for one table; repeat for every tenant-owned table (generate from the schema in CI).
ALTER TABLE "Procurement" ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON "Procurement"
  USING ("tenantId" = current_setting('app.tenant_id', true));

-- Audit trail is insert-only for the application role.
REVOKE UPDATE, DELETE, TRUNCATE ON "AuditEvent" FROM app_user;
GRANT INSERT, SELECT ON "AuditEvent" TO app_user;
