/**
 * Submission upload into the sealed bid box (FR-0165, FR-0170): PDF, Word, PowerPoint, Excel, images.
 * Files are encrypted at upload, malware-scanned (SEC-AP04) and unreadable by the buyer until close.
 * Optional AI self-check of the response against the requirements — factual, no ghost-writing
 * (client AI narrative, "AI for supplier platform").
 */
export default async function SubmitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <h1>Submit response — tender {id}</h1>
      <form className="card grid">
        <label>
          Response documents
          <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*" />
        </label>
        <p className="muted">Submissions lock automatically at the closing time. You&apos;ll get a receipt by email.</p>
        <button className="button" type="submit">Submit</button>
      </form>
    </>
  );
}
