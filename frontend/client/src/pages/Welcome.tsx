import { Logo } from '../components/Logo';

const NOTES = [
  { title: 'big way anyone?', when: 'Today, 12:00 - 1:00 AM', color: 'pink', back: 'mint' },
  { title: 'nwHacks workshop pull up!', when: 'Nov 23, 4:00 - 6:00', color: 'yellow', back: 'cream' },
  { title: 'ikb study for finals', when: 'Dec 01, 2:00 - 10:00 PM', color: 'olive', back: 'orange' },
] as const;

/**
 * Landing page. Auth0 login isn't wired into the frontend yet, so the two
 * buttons just move into the app: sign up → profile setup, log in → Discover.
 */
export function Welcome({ onSignUp, onLogIn }: { onSignUp: () => void; onLogIn: () => void }) {
  return (
    <main className="welcome">
      <h1 className="welcome-brand">
        <Logo size={44} /> on campus
      </h1>
      <p className="welcome-tagline">Don't miss out just because you don't have someone to go with.</p>
      <button className="btn-dark" onClick={onSignUp}>
        Sign up with school email
      </button>
      <p className="welcome-login">
        Already have an account?{' '}
        <button className="link" onClick={onLogIn}>
          Log in
        </button>
      </p>
      <div className="notes" aria-hidden="true">
        {NOTES.map((note, i) => (
          <div key={note.title} className={`note-wrap note-${i + 1}`}>
            <div className={`note note-back bg-${note.back}`} />
            <div className={`note bg-${note.color}`}>
              <p className="note-title">{note.title}</p>
              <p className="note-when">{note.when}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
