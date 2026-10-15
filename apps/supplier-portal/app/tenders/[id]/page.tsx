import Link from 'next/link';

/** One tender at a time: documents, addenda, anonymised Q&A, dates (FR-0155, FR-0195, FR-0210). */
export default async function TenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <h1>Tender {id}</h1>
      <section className="card">
        <h2>Documents & addenda</h2>
        <p className="muted">Download the tender pack. You&apos;ll be notified of any addenda or date changes.</p>
      </section>
      <section className="card">
        <h2>Questions</h2>
        <p className="muted">Questions are answered anonymously; answers may be shared with all bidders.</p>
      </section>
      <Link className="button" href={`/tenders/${id}/submit`}>Prepare submission</Link>
    </>
  );
}
