import Link from 'next/link';
import { PROCUREMENT_PHASES } from '@if/domain';

/**
 * Role-based home (FR-0590, FR-0600, FR-0650): my outstanding actions first, then the pipeline.
 * Layout varies by role — dense analytical view for category managers (FR-0045).
 */
export default function HomePage() {
  return (
    <>
      <h1>Good morning</h1>

      <section className="card" aria-labelledby="actions">
        <h2 id="actions">Waiting on you</h2>
        <p className="muted">Approvals, COI declarations, scoring and sign-offs assigned to you appear here.</p>
        <Link className="button" href="/intake">Start a new request</Link>
      </section>

      <section className="card" aria-labelledby="pipeline">
        <h2 id="pipeline">Active procurements by phase</h2>
        <ul className="grid cols-3">
          {PROCUREMENT_PHASES.filter((p) => p !== 'CLOSED' && p !== 'CANCELLED').map((phase) => (
            <li key={phase} className="card">
              <strong>{phase.replaceAll('_', ' ').toLowerCase()}</strong>
              <div className="muted">— procurements</div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
