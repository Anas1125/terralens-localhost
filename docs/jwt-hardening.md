# JWT hardening

Before deployment, ensure Vercel backend Production SECRET_KEY is an independent randomly generated value, e.g. python -c "import secrets; print(secrets.token_hex(32))". Put the same setting in the local backend .env if needed; never commit or share it. Missing or clearly weak values fail startup. All old tokens are intentionally invalidated; sign in again with existing credentials. No password hash migration or database schema change.

Tokens now expire after one hour and require issuer, audience, issued/expiry times, account ID, username, role and a keyed binding to the current password hash and account identity. Database active status and current role are checked on every authenticated request. Password/username/role changes invalidate tokens while the values differ, and a recreated account with a freshly salted password hash cannot reuse the old token. React still uses localStorage until the cookie milestone; logout remains client-side, and restoring prior account attributes or reactivating an account can revive an otherwise unexpired token. Persistent session revocation is a later milestone. Existing bcrypt passwords retained.

Run python -m pytest tests/ -q from backend, and npm run build from frontend/terralens-redesign. Verify both manager and employee logins after deployment.
