import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setAccessToken } from './authToken';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setAccessToken(null);
      return;
    }

    getAccessTokenSilently()
      .then((token) => setAccessToken(token ?? null))
      .catch(() => setTokenError('Unable to get an access token. Check your Auth0 API configuration.'));
  }, [getAccessTokenSilently, isAuthenticated]);

  if (isLoading) return <p className="status">Loading login…</p>;
  if (tokenError) return <p className="status">{tokenError}</p>;
  if (!isAuthenticated) {
    return (
      <main className="app">
        <h1>OnCampus</h1>
        <p>Log in with your verified school email to continue.</p>
        <button onClick={() => loginWithRedirect()}>Log in</button>
      </main>
    );
  }

  return <>{children}</>;
}
