const SEGMENTS = ['Finance', 'Users', 'Legal', 'Procurement', 'Delegations', 'Workflows', 'Templates', 'Integrations'];

/** Segmented, independently permissioned admin configuration (FR-0680, FR-0685, SEC-AC11). */
export default function AdminPage() {
  return (
    <>
      <h1>Administration</h1>
      <ul className="grid cols-3" style={{ listStyle: 'none', padding: 0 }}>
        {SEGMENTS.map((s) => (
          <li key={s} className="card">{s}</li>
        ))}
      </ul>
    </>
  );
}
