import { useEffect, useState } from 'react';
import { api, usingSampleData, type Profile as ProfileData } from './api';
import { NavBar, type Page } from './components/NavBar';
import { Discover } from './pages/Discover';
import { Profile } from './pages/Profile';
import { Welcome } from './pages/Welcome';
import './App.css';

const emptyProfile: ProfileData = { schoolId: 1, name: '', schoolYear: 'first', major: null, hobbies: [], interestedTypes: [] };

export default function App() {
  const [entered, setEntered] = useState(false);
  const [page, setPage] = useState<Page>('discover');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    api
      .getProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setProfileLoaded(true));
  }, []);

  if (!entered) {
    return (
      <Welcome
        onSignUp={() => {
          setPage('profile');
          setEntered(true);
        }}
        onLogIn={() => {
          setPage('discover');
          setEntered(true);
        }}
      />
    );
  }

  return (
    <div className="shell">
      {usingSampleData && <p className="sample-banner">Sample data: nothing is saved to the server.</p>}
      <NavBar current={page} onNavigate={setPage} />
      <main>
        {page === 'discover' && <Discover schoolId={profile?.schoolId ?? null} />}
        {page === 'create' && (
          <section className="page">
            <h1 className="date-heading">Create your plan</h1>
            <p className="status">Coming next.</p>
          </section>
        )}
        {page === 'profile' &&
          (profileLoaded ? (
            <Profile initial={profile ?? emptyProfile} onSaved={setProfile} />
          ) : (
            <p className="status">Loading profile…</p>
          ))}
      </main>
    </div>
  );
}
