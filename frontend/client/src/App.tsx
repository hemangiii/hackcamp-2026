import { useEffect, useState } from 'react';
import { api, usingSampleData, type Profile as ProfileData } from './api';
import { NavBar, type Page } from './components/NavBar';
import { CreateActivity } from './pages/CreateActivity';
import { Discover } from './pages/Discover';
import { LogIn } from './pages/LogIn';
import { Profile } from './pages/Profile';
import { SignUp } from './pages/SignUp';
import { Welcome } from './pages/Welcome';
import './App.css';

const emptyProfile: ProfileData = { schoolId: 1, name: '', schoolYear: 'first', major: null, hobbies: [], interestedTypes: [] };

type Screen = 'welcome' | 'signup' | 'login' | 'app';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
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

  const go = (next: Screen) => {
    setScreen(next);
    window.scrollTo(0, 0);
  };

  if (screen === 'welcome') return <Welcome onSignUp={() => go('signup')} onLogIn={() => go('login')} />;

  if (screen === 'signup')
    return (
      <SignUp
        onBack={() => go('welcome')}
        onLogIn={() => go('login')}
        onContinue={(schoolId) => {
          // Step 2 of sign-up is the profile form, pre-filled with the chosen school.
          setProfile((p) => ({ ...(p ?? emptyProfile), schoolId }));
          setPage('profile');
          go('app');
        }}
      />
    );

  if (screen === 'login')
    return (
      <LogIn
        onBack={() => go('welcome')}
        onSignUp={() => go('signup')}
        onContinue={() => {
          setPage('discover');
          go('app');
        }}
      />
    );

  return (
    <div className="shell">
      {usingSampleData && <p className="sample-banner">Sample data: nothing is saved to the server.</p>}
      <NavBar current={page} onNavigate={setPage} />
      <main>
        {page === 'discover' && <Discover schoolId={profile?.schoolId ?? null} />}
        {page === 'create' && <CreateActivity onViewDiscover={() => setPage('discover')} />}
        {page === 'profile' &&
          (profileLoaded ? (
            <Profile key={profile?.schoolId} initial={profile ?? emptyProfile} onSaved={setProfile} />
          ) : (
            <p className="status">Loading profile…</p>
          ))}
      </main>
    </div>
  );
}
