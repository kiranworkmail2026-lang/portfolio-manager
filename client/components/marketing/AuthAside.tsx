/** Reassurance panel shown beside the sign-in and account-opening forms. */
export function AuthAside() {
  return (
    <aside className="aside" aria-labelledby="next-title">
      <h2 id="next-title">What happens next</h2>
      <ol>
        <li>Open your account.</li>
        <li>Export your holdings from your broker as .xlsx or .csv.</li>
        <li>Upload the file and read your report.</li>
      </ol>
      <p className="reassure">
        Passwords are hashed with bcrypt. We never ask for brokerage log-ins, and you can delete a
        portfolio at any time.
      </p>
    </aside>
  );
}
