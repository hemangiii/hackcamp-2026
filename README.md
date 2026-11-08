# hackcamp-2026

## API documentation

See [backend/server/API.md](backend/server/API.md) for endpoint addresses, request and response formats, authentication requirements, and error codes.

## Email notifications

The backend uses Resend for production notification emails. From the repository root, create a local environment file:

```sh
cp backend/server/.env.example backend/server/.env
```

Create a Resend account, generate an API key in the Resend dashboard, and set the values in `backend/server/.env`:

```env
RESEND_API_KEY=
EMAIL_FROM=
```

`RESEND_API_KEY` is a private credential and must never be committed or exposed to frontend code. The `EMAIL_FROM` address must use a domain verified in Resend when sending from a custom domain.

If `RESEND_API_KEY` or `EMAIL_FROM` is missing, the backend uses `ConsoleEmailService`. In that mode, notification emails are printed to the server log and no real email is sent. This is useful for local development.

The local `backend/server/.env` file is ignored by Git. Commit only `backend/server/.env.example`, which contains placeholders and no credentials.

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
