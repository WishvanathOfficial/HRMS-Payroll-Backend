# HRMS & Employee Payroll Management — Backend

> A complete REST API for an HRMS and Payroll Management application built with **Node.js, Express.js, TypeScript, Sequelize ORM** and **MySQL**.
>
> **Author:** Wishvanath Sah  
> **License:** MIT (see [LICENSE](./LICENSE))

Complete REST API for an HRMS and Payroll Management application built with **Node.js, Express.js, TypeScript, Sequelize ORM** and **MySQL**.

Development starts apply migrations automatically. Production starts require a separate migration release step to avoid concurrent instances changing the schema at the same time.

## Tech Stack

| Layer            | Tool                                  |
| ---------------- | ------------------------------------- |
| Runtime          | Node.js (>= 20)                       |
| Web framework    | Express.js 4                          |
| Language         | TypeScript (strict)                   |
| ORM              | Sequelize 6                           |
| Database         | MySQL 8                               |
| Migration runner | Umzug (programmatic + CLI)            |
| Auth             | JWT (`jsonwebtoken`) + bcryptjs       |
| Validation       | Joi                                   |
| Logging          | Winston + morgan                      |
| Security         | helmet, cors, compression, rate-limit |
| Status codes     | `http-status-codes`                   |
| Testing          | Jest + ts-jest + supertest            |
| Lint / format    | ESLint + Prettier (husky + lint-staged) |

## Quick Start

```bash
# 1. Install + scaffold .env (also installs husky hooks)
npm run setup

# 2. Set DB_PASSWORD in .env, then create the empty database
mysql -u root -p -e "CREATE DATABASE hrms_payroll CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 3. Start the dev server (port 5000)
# Migrations auto-run on boot. Set AUTO_SEED=true the first time for dummy data + seeded logins.
AUTO_SEED=true npm run dev

# …or do it all in one go on a fresh clone:
npm run first-run
```

API root: **http://localhost:5000/api/v1**

## Authentication

Every request to `/api/v1/*` requires a Bearer JWT — **except** the `/auth/*` open endpoints (`/auth/login` and `/auth/refresh`).

### Seeded credentials (after `AUTO_SEED=true`)

| Role(s)               | Email                       | Password        |
| --------------------- | --------------------------- | --------------- |
| `ADMIN`               | `admin@company.com`         | `Admin@123`     |
| `MANAGER`, `EMPLOYEE` | `aarav.sharma@company.com`  | `Password@123`  |
| `HR`, `EMPLOYEE`      | `vikram.singh@company.com`  | `Password@123`  |
| `EMPLOYEE`            | every other seeded employee | `Password@123`  |

Bootstrap admin password can be overridden with `BOOTSTRAP_ADMIN_PASSWORD` before running seeders.

### Auth endpoints

```
POST  /api/v1/auth/login              # open — { email, password } → { user, tokens }
POST  /api/v1/auth/refresh            # open — { refreshToken } → fresh token pair
GET   /api/v1/auth/me                 # current user + roles
POST  /api/v1/auth/change-password    # { oldPassword, newPassword }
POST  /api/v1/auth/logout             # stateless — client just drops its tokens
POST  /api/v1/auth/register           # ADMIN or HR only — creates a login for an existing employee
```

### Usage examples

```bash
# 1. Log in to get an access + refresh token pair
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@company.com","password":"Admin@123"}'

# Response:
# {
#   "success": true, "statusCode": 200, "message": "Logged in",
#   "data": {
#     "user": { "userId": 1, "employeeId": null, "email": "admin@company.com", "roles": ["ADMIN"] },
#     "tokens": { "accessToken": "eyJ...", "refreshToken": "eyJ..." }
#   }
# }

# 2. Use the accessToken on every subsequent call
curl http://localhost:5000/api/v1/employees \
  -H 'Authorization: Bearer <accessToken>'

# 3. Renew tokens before the access token expires
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H 'Content-Type: application/json' \
  -d '{"refreshToken":"<refreshToken>"}'

# 4. Inspect the current user
curl http://localhost:5000/api/v1/auth/me \
  -H 'Authorization: Bearer <accessToken>'

# 5. Change password
curl -X POST http://localhost:5000/api/v1/auth/change-password \
  -H 'Authorization: Bearer <accessToken>' \
  -H 'Content-Type: application/json' \
  -d '{"oldPassword":"Admin@123","newPassword":"NewStrongPw!2026"}'

# 6. ADMIN or HR provisions a login for an existing employee
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H 'Authorization: Bearer <adminAccessToken>' \
  -H 'Content-Type: application/json' \
  -d '{
        "email": "newhire@company.com",
        "password": "TempPw@2026",
        "employeeId": 11,
        "roles": ["EMPLOYEE"]
      }'
```

### Role-based access control

Available roles: `ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`. A user can hold multiple roles (e.g. `["MANAGER", "EMPLOYEE"]`).

Globally, every `/api/v1/*` route is gated by `authenticate`. To restrict a specific endpoint further, chain `requireRoles(...)`:

```ts
import { authenticate, requireRoles } from '../../../middlewares';

router.delete(
    '/:id',
    authenticate,             // already applied at the v1 router level, but explicit here is fine
    requireRoles('ADMIN'),    // only ADMIN can hit this route
    catchAsync(controller.remove),
);

// Multiple allowed roles — pass them as separate args:
router.post('/some-leave-action', requireRoles('ADMIN', 'HR'), handler);
```

### Auth-related env vars

```dotenv
# .env (rotate the secrets in any non-dev environment)
JWT_SECRET=change-me-access-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=change-me-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=10

# Used only by the bootstrap-admin seeder
BOOTSTRAP_ADMIN_PASSWORD=Admin@123
```

## Auto-migration on startup

In development, `src/server.ts` does this on startup by default. Set `AUTO_MIGRATE=false` to skip it:

1. `await testConnection()` — confirms MySQL is reachable.
2. `await runPendingMigrations()` — applies any **new** migrations from `src/migrations/`. Already-executed ones are skipped (tracked in `SequelizeMeta`).
3. (Optional) `await runPendingSeeders()` if `AUTO_SEED=true` — tracked in `SequelizeSeeds`.
4. `app.listen(5000)`.

Adding a new migration file under `src/migrations/` and restarting the development server applies it. Production disables automatic migrations by default; run them as a release step before starting the new application version.

## Production Deployment

The container uses Node.js 20, compiles only runtime code, runs as the unprivileged `node` user, and starts with `npm start`. Supply configuration through the deployment platform's secret/environment settings; do not copy `.env.example` unchanged into production.

Required production settings are `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `CORS_ORIGIN`. Use a dedicated database user, two different randomly generated JWT secrets of at least 32 characters, and the exact browser origin that should access the API. Startup rejects placeholder secrets, root DB access, wildcard CORS, invalid numeric/boolean settings, or `AUTO_SEED=true` in production. Automatic migrations default off in production.

Build and migrate as part of the release process, then run the service:

```bash
npm ci
npm run verify
npm run build
npm run db:migrate:prod
# On initial database provisioning, with BOOTSTRAP_ADMIN_PASSWORD configured:
npm run db:seed
npm start
```

For container deployments, build with `docker build -t hrms-payroll-api .` and run the image with the required environment variables. Run `npm run db:migrate:prod` once as the release job from the same built artifact before routing traffic to the new service. Configure the platform's readiness probe to call `GET /api/v1/health`; it returns `503` while MySQL is unavailable.

Never enable `AUTO_SEED` in production. After migrations, `npm run db:seed` in production applies only the standard roles and bootstrap admin; it does not create demo employees or shared employee passwords. Set a unique `BOOTSTRAP_ADMIN_PASSWORD` of at least 16 characters for that release job. The destructive `db:reset` command is disabled in production.

## Project Structure

```
src/
├── api/
│   └── v1/                       # Versioned API surface (/api/v1)
│       ├── controllers/          # 24 controller files — req/res only
│       ├── routes/               # 24 route files + index.ts (auth gate wired here)
│       ├── validators/           # Joi schemas (body / query / params)
│       └── index.ts              # v1 router aggregator
├── config/
│   ├── database.ts               # Sequelize instance
│   ├── env.ts                    # Parsed environment vars (incl. JWT config)
│   ├── logger.ts                 # Winston logger + morgan stream
│   └── sequelize.config.js       # sequelize-cli compatible config
├── constants/                    # HTTP messages, default pagination, etc.
├── db/
│   ├── migrator.ts               # Umzug instances (migrations + seeders)
│   └── cli.ts                    # CLI used by npm scripts
├── middlewares/
│   ├── authenticate.ts           # JWT verify → attaches req.user
│   ├── requireRoles.ts           # role-guard factory
│   ├── catchAsync.ts             # async wrapper
│   ├── errorHandler.ts           # global error → JSON envelope (Sequelize-aware)
│   ├── validate.ts               # Joi-based request validator
│   ├── requestId.ts              # X-Request-Id correlation
│   ├── requestLogger.ts          # morgan → winston
│   └── rateLimiter.ts            # 300 req/min/IP
├── models/                       # 26 Sequelize models incl. User/Role/UserRole
├── migrations/                   # 27 Sequelize migrations
├── seeders/                      # 9 seeders (incl. roles + bootstrap admin)
├── services/                     # 24 services — business logic only
├── utils/
│   ├── ApiError.ts               # operational error class
│   ├── ApiResponse.ts            # consistent success envelope
│   └── pagination.ts             # page/limit/offset parsing
├── app.ts                        # Express app composition
└── server.ts                     # Entry: bootstrap → migrate → listen
```

## Request Flow

```
HTTP request
   ↓
authenticate         (every /api/v1/* except /auth/login + /auth/refresh)
   ↓
Route                src/api/v1/routes/<entity>.route.ts        (path → middleware chain)
   ↓
Validator            Joi schema in src/api/v1/validators/...    (req.body/query/params)
   ↓
requireRoles(...)    (optional, per-endpoint role gate)
   ↓
Controller           src/api/v1/controllers/<entity>.controller (parse → call service → ApiResponse)
   ↓
Service              src/services/<entity>.service.ts            (business logic + transactions)
   ↓
Model                src/models/<entity>.ts                      (Sequelize Model — DB access)
   ↓
MySQL
```

## Industry-standard REST conventions

**Successful response envelope**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Fetched successfully",
  "data": { ... },
  "meta": { "pagination": { "page": 1, "limit": 20, "total": 137, "totalPages": 7 } }
}
```

**Error response envelope** — produced exclusively by `ApiError` + the global error handler

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": { "body": ["\"email\" must be a valid email"] },
  "requestId": "8a23…-…"
}
```

The error handler also catches Sequelize-specific errors and maps them to clean responses:

| Sequelize error             | HTTP status | Notes                                 |
| --------------------------- | ----------- | ------------------------------------- |
| `UniqueConstraintError`     | 409         | with offending field names            |
| `ForeignKeyConstraintError` | 400         | with table + fields                   |
| `ValidationError`           | 422         | field-level messages                  |
| `EmptyResultError`          | 404         |                                       |
| `DatabaseError`             | 500         | message hidden in production          |

## Scripts

| Command                          | Purpose                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| `npm run setup`                  | `npm install` + scaffold `.env` from `.env.example`                |
| `npm run first-run`              | `setup` + `db:setup` + `dev` (fresh-clone onboarding)              |
| `npm run dev`                    | Start dev server with hot reload + auto-migrate                    |
| `npm run build`                  | Compile TypeScript to `dist/`                                      |
| `npm start`                      | Run compiled output                                                |
| `npm test` / `:watch` / `:coverage` | Jest unit tests                                                 |
| `npm run typecheck`              | `tsc --noEmit`                                                     |
| `npm run lint` / `lint:fix`      | ESLint (`--max-warnings=0`)                                        |
| `npm run format` / `format:check`| Prettier                                                           |
| `npm run verify`                 | `typecheck + lint + format:check + test` (same as pre-commit gate) |
| `npm run db:migrate`             | Apply pending migrations (manual)                                  |
| `npm run db:migrate:down`        | Roll back the last migration                                       |
| `npm run db:migrate:status`      | Show executed + pending migrations                                 |
| `npm run db:seed`                | Apply pending seeders                                              |
| `npm run db:reset`               | Rollback all → migrate → seed                                      |
| `npm run db:setup`               | Migrate + seed                                                     |

A husky pre-commit hook runs `lint-staged` (Prettier + ESLint --max-warnings=0) followed by `jest --bail`. Commits abort on any failure.

## Functional Modules (26 Tables)

| Module       | Tables |
| ------------ | ------ |
| Auth         | Users, Roles, UserRoles |
| Organization | Departments, Designations |
| Employee     | Employees, EmploymentHistory |
| Attendance   | Shifts, EmployeeShifts, AttendanceLogs |
| Leave        | LeaveTypes, LeaveBalances, LeaveRequests |
| Salary       | SalaryStructures, SalaryComponents, SalaryStructureComponents, EmployeeSalaries |
| Payroll      | PayrollRuns, Payslips, PayslipDetails, StatutoryDeductions |
| Recruitment  | JobPostings, Applicants, InterviewStages |
| Appraisal    | AppraisalCycles, EmployeeAppraisals |

## Notable Domain Endpoints

```
# Auth (open)
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh

# Auth (authenticated)
GET    /api/v1/auth/me
POST   /api/v1/auth/change-password
POST   /api/v1/auth/logout
POST   /api/v1/auth/register             # ADMIN or HR only

# Attendance
POST   /api/v1/attendance-logs/check-in
POST   /api/v1/attendance-logs/check-out
GET    /api/v1/attendance-logs/summary/:employeeId?year=&month=

# Leave
POST   /api/v1/leave-requests/:id/approve     # transactional — adjusts balance
POST   /api/v1/leave-requests/:id/reject
POST   /api/v1/leave-requests/:id/cancel

# Payroll
POST   /api/v1/payroll-runs/:id/process       # generates payslips for all active employees
POST   /api/v1/payroll-runs/:id/lock

# Payslips
GET    /api/v1/payslips/:id/detailed          # includes line items + statutory deductions
GET    /api/v1/payslips/employee/:employeeId

# Profile composites
GET    /api/v1/employees/:id/profile          # employee + department + designation + salary + balances
GET    /api/v1/departments/:id/full           # department with parent/children/designations/manager
```

## Adding a new table

1. Add a model file under `src/models/<entity>.ts` and export it from `src/models/index.ts`.
2. Add associations directly in the model file (the dependent side owns both directions).
3. Add a migration file under `src/migrations/YYYYMMDDhhmmss-create-<entity>.ts`.
4. Write the service, controller, route, validator (one file each).
5. Mount the new route in `src/api/v1/index.ts` under the `guarded` router (or `v1` directly if it must be public).
6. Restart the server — the new migration runs automatically on boot.
7. Add `*.test.ts` next to each new file; the pre-commit hook enforces them.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

**Copyright © 2026 Wishvanath Sah**
