import type { ReactNode } from 'react';
import { Logo } from './Logo';
import { Stickman, type Pose } from './Stickman';

type Note = { title: string; when: string; color: string; back: string };

/**
 * Two-column layout shared by Sign up and Log in: a colourful panel of
 * activity notes and stick figures on the left, the form card on the right.
 */
export function AuthLayout({
  heading,
  blurb,
  notes,
  pose,
  onBack,
  children,
}: {
  heading: ReactNode;
  blurb: string;
  notes: Note[];
  pose: Pose;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <main className="auth">
      <section className="auth-art" aria-hidden="true">
        <button className="nav-brand auth-brand" onClick={onBack} tabIndex={-1}>
          <Logo size={34} /> on campus
        </button>
        <h2 className="auth-heading">{heading}</h2>
        <p className="auth-blurb">{blurb}</p>
        <div className="auth-notes">
          {notes.map((note, i) => (
            <div key={note.title} className={`note-wrap auth-note-${i + 1}`}>
              <div className={`note note-back bg-${note.back}`} />
              <div className={`note bg-${note.color}`}>
                <p className="note-title">{note.title}</p>
                <p className="note-when">{note.when}</p>
              </div>
            </div>
          ))}
          <Stickman pose={pose} className="auth-stick" />
        </div>
      </section>

      <section className="auth-panel">
        <button className="link auth-back" onClick={onBack}>
          ← Back
        </button>
        <div className="auth-card">{children}</div>
      </section>
    </main>
  );
}
