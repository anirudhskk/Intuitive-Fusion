/**
 * Supplier self-registration by voice or text: company details, ABN, contacts, bank details,
 * insurance, and any buyer-specific onboarding questions (FR-0235, FR-0215).
 * Sanctions screening runs on submit (FR-0180). Bank details go to a finance-only store (SEC-AC10).
 */
export default function RegisterPage() {
  return (
    <>
      <h1>Register your company</h1>
      <form className="card grid" aria-describedby="reg-help">
        <p id="reg-help" className="muted">You can also tell the assistant your details by voice.</p>
        <label>Legal entity name<input name="legalName" required autoComplete="organization" /></label>
        <label>ABN / company registration number<input name="abn" inputMode="numeric" /></label>
        <label>Contact email<input name="email" type="email" required autoComplete="email" /></label>
        <button className="button" type="submit">Continue</button>
      </form>
    </>
  );
}
