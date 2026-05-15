# API OpenAPI spec (deploy bundle)

`openapi.yaml` is copied from the monorepo source of truth at `contracts/openapi.yaml`.

When you change the root contract, sync before release:

```bash
copy ..\..\contracts\openapi.yaml apps\api\contracts\openapi.yaml
```

Railway builds with **Root Directory** `apps/api` only; this folder must contain the spec.
