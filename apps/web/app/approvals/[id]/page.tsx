/**
 * Delegate approval — designed for a phone first (TR-01). Arrives via deep link from email/Teams
 * straight to the section needing approval; one screen shows the AI summary, who hasn't signed
 * their COI, and the completeness ticks (FR-0785, FR-0650). Approve by tap or by voice (FR-0080);
 * the decision stamps the platform and the documents (FR-0780).
 *
 * OPEN DECISION: approve from an email link without full sign-in (NFR-U05) vs mandatory SSO (SEC-A04).
 */
export default async function ApprovalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <h1>Approval needed</h1>
      <section className="card" aria-labelledby="summary">
        <h2 id="summary">Summary</h2>
        <p className="muted">AI summary of approval {id}: where the procurement stands, value, risks, recommendation.</p>
        <ul>
          <li className="status-done">Procurement plan complete</li>
          <li className="status-pending">Conflict of interest — 1 evaluator outstanding</li>
        </ul>
      </section>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="button">Approve</button>
        <button className="button secondary">Reject</button>
        <button className="button secondary" aria-label="Approve or reject by voice">🎤</button>
      </div>
    </>
  );
}
