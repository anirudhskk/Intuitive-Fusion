// Baseline PERMIT policies. Tenants extend these through admin configuration (SEC-AC09).

// Procurement members can read the procurement they're on.
@id("members-read-procurement")
permit (principal, action == IF::Action::"ReadProcurement", resource is IF::Procurement)
when { resource.members.contains(principal) };

// Hierarchy: division heads and team leads see records in their org unit subtree (SEC-AC08).
@id("org-hierarchy-read")
permit (principal, action == IF::Action::"ReadProcurement", resource is IF::Procurement)
when { principal has headOf && resource in principal.headOf };

// SEC-AC04 — delegates approve within their dollar authority; above it, escalate to the next level.
@id("approve-within-authority")
permit (principal in IF::Role::"delegate", action == IF::Action::"Approve", resource)
when { principal has sourcingAuthority && context.value.lessThanOrEqual(principal.sourcingAuthority) };

// SEC-AC05, FR-0410 — signing authority is separate from sourcing approval authority.
@id("sign-within-signing-authority")
permit (principal, action == IF::Action::"Sign", resource is IF::Contract)
when { principal has signingAuthority && context.value.lessThanOrEqual(principal.signingAuthority) };

// Evaluators score evaluations they are assigned to (subject to the forbid guardrails).
@id("assigned-evaluators-score")
permit (principal in IF::Role::"evaluator", action == IF::Action::"ScoreSubmission", resource is IF::Evaluation)
when { resource.procurement.evaluators.contains(principal) };

@id("finance-bank-details")
permit (principal in IF::Role::"finance", action == IF::Action::"ReadBankDetails", resource is IF::SupplierBankDetail);
