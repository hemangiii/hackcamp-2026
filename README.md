# hackcamp-2026

## Backend authentication

The API uses Auth0-issued RS256 access tokens. Auth0 handles account creation, login, and email verification; the backend validates the bearer token and only allows verified addresses from:

- `student.ubc.ca`
- `sfu.ca`
- `uvic.ca`

Configure these backend environment variables before starting the server:

```sh
AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN/
AUTH0_AUDIENCE=https://YOUR_API_IDENTIFIER
# Optional; defaults to https://oncampus.app
AUTH0_CLAIMS_NAMESPACE=https://oncampus.app
```

In the Auth0 API settings, use RS256. Add a Post-Login Action to copy `email` and `email_verified` into the access token, because Auth0 does not normally include those claims in API access tokens:

```js
exports.onExecutePostLogin = async (event, api) => {
  const ns = 'https://oncampus.app';
  if (event.user.email) api.accessToken.setCustomClaim(`${ns}/email`, event.user.email);
  api.accessToken.setCustomClaim(`${ns}/email_verified`, event.user.email_verified === true);
};
```

The frontend must request an access token for `AUTH0_AUDIENCE` and send it as `Authorization: Bearer <token>` to `/api/profile`. No Auth0 client secret belongs in the frontend or this backend.
