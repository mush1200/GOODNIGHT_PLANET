# GitHub Actions CI — secrets

CI does **not** store database passwords in the repository.

## Required repository secret

| Secret | Purpose |
|--------|---------|
| `CI_POSTGRES_PASSWORD` | Ephemeral Postgres service container password (CI only) |

**Settings → Secrets and variables → Actions → New repository secret**

Use any strong value for CI (e.g. generate a random string). It is **not** your Supabase or production password.

The `release` workflow builds `DATABASE_URL` at runtime from this secret.
