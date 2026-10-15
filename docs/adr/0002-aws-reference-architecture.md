# ADR 0002 — AWS reference architecture (BRS §5), single region per deployment

Status: Proposed · 2026-10-15

## Context
BRS §5 proposes AWS (Cognito, Verified Permissions, API Gateway, Lambda, Step Functions, ECS, Aurora,
DynamoDB, S3, KMS, Bedrock, Transcribe, Polly, Textract, Comprehend, EventBridge, AppFlow, Glue,
Redshift, QuickSight, WAF/Shield, GuardDuty, Config, CloudTrail, Macie). Data must stay in the customer's
nominated country/boundary (NFR-R01/R02, SEC-D09) and public-sector customers expect IRAP alignment
(NFR-R04).

## Decision
- Adopt the BRS §5 services as the baseline, expressed as AWS CDK stacks in `infra/cdk`.
- Each deployment is one stage in one region (default `ap-southeast-2`). Customers that need their own
  account or another country get their own deployment.
- Aurora PostgreSQL for transactional data, S3 for documents and the sealed bid box (separate KMS key),
  EventBridge for domain events, Redshift/QuickSight for analytics decoupled from OLTP (NFR-P05).

## Consequences
- Data sovereignty is structural. Cost is higher for small dedicated deployments.
- 99.9% (multi-AZ) is achievable in-region; 99.99% (TR-07) would need multi-region — see open decision 8.
- Service selection remains indicative per the BRS; revisit during solution design.
