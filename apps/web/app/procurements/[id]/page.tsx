import { ConversationPanel } from '../../../components/ConversationPanel';

const VIEWS = ['Request', 'Procurement plan', 'Tender pack', 'Evaluation', 'Evaluation report', 'Contract', 'Contract management'];

/**
 * One procurement, many views. Every view renders the same underlying facts, so a change made in
 * one (e.g. "add milestone 7: final invoice") appears in all (FR-0010, NFR-P03).
 * Concurrent editing, tracked changes and "what changed since I last looked" (FR-0735, FR-0740).
 */
export default async function ProcurementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <h1>Procurement {id}</h1>
      <nav aria-label="Document views" className="nav" style={{ border: 0, padding: 0, marginBottom: 12 }}>
        {VIEWS.map((v) => (
          <a key={v} href={`#${v}`}>{v}</a>
        ))}
      </nav>
      <div className="grid cols-2">
        <section className="card">
          <h2>Procurement plan</h2>
          <p className="muted">Fields bound to procurement facts. Locked after approval; procurement team can reopen.</p>
          {/* TODO GET /documents/:documentId/render?format=pdf|docx (NFR-U03) */}
          <button className="button secondary" type="button">Download Word / PDF</button>
        </section>
        <ConversationPanel contextType="procurement" contextId={id} />
      </div>
    </>
  );
}
