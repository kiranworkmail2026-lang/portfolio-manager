/** Reassurance panel shown beside the sign-in and account-opening forms. */
export function AuthAside() {
  return (
    <aside className="aside" aria-labelledby="next-title">
      <h2 id="next-title">What happens next</h2>
      <ol>
        <li>Create your account with a work email address.</li>
        <li>Take the custodian export the company already receives, as .xlsx or .csv.</li>
        <li>Upload it and circulate the statement.</li>
      </ol>
      <p className="reassure">
        Passwords are hashed with bcrypt. We never ask for custodian or bank credentials, and an
        uploaded book can be deleted at any time.
      </p>
    </aside>
  );
}
