import { ConversationPanel } from '../../components/ConversationPanel';

/** Single front door for procurement requests (FR-0005, FR-0006, FR-0035, FR-0040). */
export default function IntakePage() {
  return (
    <>
      <h1>New request</h1>
      <p className="muted">
        Tell us what you need in plain language. The assistant fills in the request, checks budget, works out which
        process applies and asks about anything missing.
      </p>
      <div className="grid cols-2">
        <ConversationPanel contextType="intake" />
        <section className="card" aria-labelledby="captured">
          <h2 id="captured">Captured so far</h2>
          <p className="muted">Fields populated by the assistant appear here, editable. Budget check, complexity score and required engagements (IT, legal, cyber…) show once known.</p>
        </section>
      </div>
    </>
  );
}
