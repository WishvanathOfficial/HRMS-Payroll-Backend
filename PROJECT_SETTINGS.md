# Project Settings

## Where the repo sits

- **23 Sequelize models** in `sequelize.define` + `ModelDefined<>` style (kebab-case files, camelCase attributes ↔ PascalCase DB columns, audit fields, minimal indexes)
- **24 TS migrations** with the transaction wrapper + `TABLE_NAME` constant
- **8 seeders** with PascalCase DB column names
- **23 services + 23 controllers + 23 routes + 7 validators** under `src/api/v1/`, all camelCase
- **Auto-migrate on boot** via Umzug
- **Industry tooling**: ESLint + Prettier + EditorConfig + .nvmrc + strict tsconfig
- **Observability + safety**: requestId middleware, DB-pinging `/health`, compression, rate limit

## Next time you boot the project

```bash
npm install
cp .env.example .env   # edit DB creds
mysql -u root -p -e "CREATE DATABASE hrms_payroll CHARACTER SET utf8mb4;"
npm run format         # one-shot indentation normalization across all files
AUTO_SEED=true npm run dev
```

## Common follow-ups

- **Auth**: JWT middleware + `userId` injected into `req` so audit columns `createdBy`/`updatedBy` populate automatically via a Sequelize hook
- **Tests**: Jest + supertest
- **API docs**: OpenAPI / Swagger spec
