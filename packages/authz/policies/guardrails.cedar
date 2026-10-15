// Platform-wide FORBID policies. These cannot be overridden by tenant permits.

// SEC-D10 — tenant isolation. Resources without a tenantId are denied.
@id("tenant-isolation")
forbid (principal, action, resource)
unless { resource has tenantId && principal.tenantId == resource.tenantId };

// SEC-AC13, SEC-D03 — the bid box is sealed until close. No internal role (incl. admins/DBAs)
// can read a submission before close; a supplier can always see its own.
@id("sealed-bid-box")
forbid (principal, action in [IF::Action::"ReadSubmission", IF::Action::"DownloadSubmission"], resource is IF::Submission)
unless {
  resource.rfx.closed ||
  (principal has supplierId && principal.supplierId == resource.supplierId)
};

// FR-0190, SEC-AC06 — segregation of duties: tender administrators and probity officers can't evaluate.
@id("sod-admin-probity-not-evaluator")
forbid (principal, action == IF::Action::"ScoreSubmission", resource is IF::Evaluation)
when {
  resource.procurement.tenderAdministrators.contains(principal) ||
  resource.procurement.probityOfficers.contains(principal)
};

// FR-0300 — evaluators must declare conflicts of interest before seeing vendor names or bids.
@id("coi-before-bids")
forbid (principal in IF::Role::"evaluator", action in [IF::Action::"ReadSubmission", IF::Action::"ScoreSubmission"], resource)
unless { context has coiDeclared && context.coiDeclared };

// FR-0260, SEC-AC07 — technical evaluators never see commercial/pricing sections.
@id("technical-evaluators-no-pricing")
forbid (principal, action == IF::Action::"ReadSubmissionSection", resource is IF::SubmissionSection)
when { resource.stream == "commercial" && context has evaluatorStream && context.evaluatorStream == "technical" };

// SEC-AC10 — supplier bank details are finance-only (open decision: confirm with client).
@id("bank-details-finance-only")
forbid (principal, action, resource is IF::SupplierBankDetail)
unless { principal in IF::Role::"finance" };
