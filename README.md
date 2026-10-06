# Backend Foundations

## Day 1 - JavaScript Backend Foundations

Day 1 introduces CommonJS modules, in-memory data, service functions, and basic asynchronous JavaScript with Promises and `async`/`await`.

### Setup

1. Install Node.js.
2. Open a terminal in the project root.
3. Confirm Node.js is available:

```bash
node --version
```

No external packages are required.

### Run

From the project root, run:

```bash
node src/day1/index.js
```

The example waits briefly, fetches task `1` asynchronously, and prints the task. You can also run it from the Day 1 directory:

```bash
cd src/day1
node index.js
```

### Learning Notes

- CommonJS modules use `require()` to import code and `module.exports` to expose it.
- Separating data, service logic, asynchronous behavior, and application startup keeps the code easier to maintain.
- A Promise represents a value that may be available later.
- An `async` function returns a Promise, and `await` makes asynchronous code easier to read.
- `filter()` returns a new array containing items that match a condition.

See [the Day 1 README](src/day1/README.md) for the module structure and more detail.

## Day 2 - TypeScript for Reliable Backend Code

Day 2 converts the Day 1 task project from JavaScript to TypeScript. The goal is to use compile-time checks to catch invalid data and programming mistakes before the application runs.

### Tooling

The project uses:

- `typescript` to check and compile TypeScript.
- `tsx` to run TypeScript during development.
- `@types/node` to provide Node.js type definitions.

Useful commands:

```bash
npx tsc --noEmit
npm run build
node dist/day1/index.js
```

`npx tsc --noEmit` checks the project without creating output files. `npm run build` compiles the TypeScript source into JavaScript under `dist`. Node runs the compiled JavaScript, not the TypeScript source.

### Type Model

- `Task` is an interface describing the required shape of a task.
- `TaskStatus` is a string union containing `todo`, `in-progress`, and `done`.
- `TaskPriority` is a string union containing `low`, `medium`, and `high`.
- `createdAt` stores the task creation time as an ISO date string.
- Function parameters and return values are explicitly typed.
- `updateTask` uses an optional status property because a partial update may omit the status.

### TypeScript Notes

TypeScript is a static type-checking layer that compiles to JavaScript. Compile-time checking happens before Node runs the program. Runtime behavior still depends on the JavaScript that was generated and on the data received while the application is running.

An interface describes the expected shape of an object in the TypeScript source. It does not validate arbitrary external input at runtime. Runtime validation is still useful for values received from users, files, APIs, or other JavaScript code.

Using `any` disables most TypeScript checking for a value, so it should not be used merely to silence an error. The type should describe the real value instead.

### Generic Response Exercise

`ApiResponse<T>` is a reusable generic response shape. The `T` represents the specific data inside the response, such as one `Task`, an array of tasks, or a task summary. Generics allow the response structure to be reused without losing the type of its data.

### Type-Safety Challenge

The compiler should reject an invalid task ID passed as a string and an invalid status such as `waiting`. These mistakes demonstrate the difference between a value that matches the declared function contract and one that does not.

To reproduce the challenge, temporarily pass a string to a function expecting a number and temporarily use `waiting` where `TaskStatus` is required. Run:

```bash
npx tsc --noEmit
```

Record the compiler errors, then restore the valid values and confirm that the check succeeds again. The invalid examples must not remain in the final source code.

### Day 2 Structure

```text
src/day1/
├── data.ts
├── taskService.ts
├── asyncDemo.ts
├── index.ts
└── types.ts
```

## Day 3 - Node.js, HTTP, and Express REST API

Day 3 turns the typed task logic into an in-memory HTTP API using Express.

### Install and Run

Install the runtime and TypeScript Express dependencies:

```bash
npm install express
npm install -D @types/express
```

Run the development server:

```bash
npm run dev
```

The server uses `process.env.PORT` when provided and falls back to port `3000`.

Build and run the compiled JavaScript:

```bash
npm run build
npm start
```

### Request Flow

```text
HTTP request
		-> Express app
		-> JSON parser and request logger middleware
		-> route
		-> controller
		-> task service
		-> HTTP response
```

The controller translates HTTP data into service calls. The service manages task data and does not depend on Express or HTTP status codes.

### API Endpoints

| Method | Endpoint | Success | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | 200 | Check that the server is running |
| GET | `/tasks` | 200 | List all tasks |
| GET | `/tasks/:id` | 200 | Get one task |
| POST | `/tasks` | 201 | Create a task |
| PATCH | `/tasks/:id` | 200 | Update supplied task fields |
| DELETE | `/tasks/:id` | 204 | Delete a task without a response body |

Invalid request data returns `400`. A valid ID with no matching task returns `404`.

### API Testing Checklist

Test these requests with Postman, Bruno, Insomnia, or `curl`:

1. `GET /health` returns `200` and `{ "status": "ok" }`.
2. `POST /tasks` with valid JSON returns `201` and a generated ID and `createdAt`.
3. `POST /tasks` with missing fields returns `400`.
4. `GET /tasks` includes the newly created task.
5. `GET /tasks/:id` returns the task for a known ID.
6. `GET /tasks/999` returns `404`.
7. `PATCH /tasks/:id` changes only the supplied fields and returns `200`.
8. `DELETE /tasks/:id` returns `204`.
9. Requesting the deleted ID returns `404`.

Example requests:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks/1
```

Create a task:

```bash
curl -i -X POST http://localhost:3000/tasks \
	-H "Content-Type: application/json" \
	-d '{"title":"Learn Express","description":"Build a REST API","status":"todo","priority":"high","assignee":"Alice"}'
```

Update a task:

```bash
curl -i -X PATCH http://localhost:3000/tasks/1 \
	-H "Content-Type: application/json" \
	-d '{"status":"done"}'
```

Delete a task:

```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```

### Day 3 Structure

```text
src/
├── app.ts
├── server.ts
├── controllers/
│   └── taskController.ts
├── middleware/
│   └── requestLogger.ts
├── models/
│   └── task.ts
├── routes/
│   └── taskRoutes.ts
└── services/
		└── taskService.ts
```

## Phase 2 - Days 4-7 Practice Plan

Continue with [the Phase 2 learning practice plan](Resources_info/Phase_2_Learning_Practice_Plan.md). It guides the learner through PostgreSQL, database-backed repositories, authentication, authorization, validation and centralized error handling without replacing the learner's implementation work.

## Phase 2 - Day 4 Database Setup

Day 4 adds PostgreSQL as the persistent data model for users, projects and tasks. The SQL files are intentionally runnable independently before the Express API is connected to the database.

### Prerequisites

- PostgreSQL is installed and running.
- The `createdb` and `psql` commands are available in the terminal.

After the learner has created `database/schema.sql` and `database/seed.sql`, create the local training database:

```bash
createdb -h localhost -p 5433 -U postgres backend_internship
psql -h localhost -p 5433 -U postgres -d backend_internship -f database/schema.sql
psql -h localhost -p 5433 -U postgres -d backend_internship -f database/seed.sql
```

Run the practice queries with:

```bash
psql -h localhost -p 5433 -U postgres -d backend_internship -f database/queries.sql
```

`seed.sql` inserts sample rows; it does not drop or reset existing tables. Run it against a fresh or disposable training database, or remove the existing rows deliberately before running it again. Do not run it against production data. Its password values are instructional placeholders only; Day 6 will create real password hashes through the registration flow.

### Database Concepts

- A **primary key** uniquely identifies one row, such as `users.id`.
- A **foreign key** points to a related row, such as `projects.owner_id` pointing to `users.id`.
- A **JOIN** combines related rows for a read without copying the related data into another table.
- `CREATE INDEX idx_tasks_project_id ON tasks (project_id);` supports the frequent query that lists tasks for one project. Indexes improve lookup work but use storage and add write overhead, so every column should not be indexed automatically.

The schema uses `ON DELETE CASCADE` when child records should be removed with their parent project or user, and `ON DELETE SET NULL` when a task should remain after its optional assignee is removed.

### Day 4 Intern-Led Lab

The schema and seed files are already present. Do not recreate them or change application code for this lab. The intern must perform the database work, explain each result, and record the evidence.

#### 1. Establish the baseline

Before changing anything:

```bash
git status
npm run build
```

Write down the difference between the Day 3 array and PostgreSQL:

- What happens to an in-memory task after the server stops?
- What should remain in PostgreSQL after the server stops?
- Which table is the parent of `projects`?
- Which table is the parent of `tasks`?

Inspect the existing schema and seed files. Confirm that the expected data model is:

```text
users 1 ─── many projects
users 1 ─── many tasks through assigned_to
projects 1 ─── many tasks
```

#### 2. Apply the existing database files

Use the PostgreSQL commands above against an empty training database. Then verify the row counts yourself:

- `users`: 5 rows
- `projects`: 3 rows
- `tasks`: 12 rows

If the counts are different, stop and diagnose the database state before continuing. Do not hide the problem by repeatedly running the seed file.

#### 3. Prove the constraints

In a disposable database, intentionally attempt each invalid operation below. The intern must identify the exact constraint responsible:

| Experiment | Expected database rule |
| --- | --- |
| Insert a project with an owner ID that does not exist | Foreign key on `projects.owner_id` |
| Insert a user with an email already in the seed | `UNIQUE` on `users.email` |
| Insert a task with a nonexistent project ID | Foreign key on `tasks.project_id` |
| Insert a task with a nonexistent assignee ID | Foreign key on `tasks.assigned_to` |
| Insert a user without a required name or email | `NOT NULL` |

Also test the deletion behavior in a disposable database:

- Delete a project and observe that its tasks are removed because of `ON DELETE CASCADE`.
- Delete a user assigned to a task and observe that the task remains while `assigned_to` becomes `NULL` because of `ON DELETE SET NULL`.

Restore the training database after destructive experiments.

#### 4. Write the practice queries

The intern must create `database/queries.sql`; the mentor should not write it for them. The file must contain queries for:

1. Selecting all users, projects, and tasks.
2. Filtering tasks for one project with `WHERE`.
3. Joining tasks to projects and displaying the project name.
4. Joining projects to users and displaying the owner name and email.
5. Updating one task status with `UPDATE`.
6. Deleting one test task with `DELETE`.
7. Returning the first five tasks with `LIMIT`.
8. Returning the second page with `LIMIT 5 OFFSET 5`.
9. Counting tasks grouped by status or project.

For every query, the intern should first predict the result count and important columns, then run it and compare the prediction with the output.

The intern must be able to explain:

- `WHERE` filters rows.
- `JOIN` combines related rows for a result without copying data between tables.
- `ORDER BY` makes result order deliberate.
- `LIMIT` caps the result size.
- `OFFSET` skips rows and supports a simple second page.
- `GROUP BY` forms groups for aggregate functions such as `COUNT`.

#### 5. Explain parameterization and the index

The intern should write a short explanation in this README or their learning notes:

- Why concatenating request text into SQL is unsafe.
- How a placeholder such as `$1` keeps input separate from SQL syntax.
- Which task-by-project query is helped by `idx_tasks_project_id`.
- Why an index can reduce lookup work.
- Why indexes consume storage and add work to writes.
- Why adding an index to every column is not automatically good design.

#### 6. Day 4 completion gate

Day 4 is complete only when the intern can show:

- A successful schema application to an empty database.
- The expected seeded row counts.
- The constraint failure evidence and explanations.
- The cascade and set-null behavior.
- A learner-written `database/queries.sql` with all required query categories.
- Query predictions compared with actual results.
- A clear parameterization explanation.
- A clear explanation of the existing project-task index.
- A passing `npm run build`.

Suggested Day 4 commits, after the intern has done and reviewed the work:

```text
chore: add PostgreSQL setup and environment configuration
feat: add PostgreSQL schema and seed data
test: add SQL practice queries
docs: record Day 4 database learning and evidence
```

Do not begin Day 5 until the intern can explain the schema and every practice query without copying an answer. Day 5 will connect Express to PostgreSQL; it is intentionally separate from this database-only verification step.

### Day 4 Completion Record

Day 4 was verified against disposable PostgreSQL databases before moving on:

- `schema.sql` applied successfully.
- `seed.sql` produced 5 users, 3 projects, and 12 tasks.
- The task/project and project/owner relationships were verified with `JOIN`.
- Optional assignments were verified with `LEFT JOIN`.
- `WHERE`, `LIMIT`, `OFFSET`, `GROUP BY`, `UPDATE`, and `DELETE` queries were executed successfully.
- Duplicate-email, foreign-key, and `NOT NULL` constraints rejected invalid writes.
- `ON DELETE CASCADE` removed a project's tasks.
- `ON DELETE SET NULL` preserved tasks while clearing an optional assignee.
- `EXPLAIN` selected `idx_tasks_project_id` for a project-filtered task query.
- Parameterization was documented as the separation of SQL structure from user values.
- The existing Express server started and `npm run build` completed without errors.

The primary `backend_internship` database remains seeded for the next phase. The write examples in `database/queries.sql` must only be run against a disposable database because they intentionally modify rows.

Day 4 is complete. Day 5 begins by replacing in-memory persistence with a PostgreSQL connection, repositories, and database-backed project/task endpoints. Do not implement that migration until the Day 4 concepts and query results can be explained without relying on copied answers.

### Day 4 Intern Runbook

The intern runs every command in this section. The mentor only reviews the output and asks the
teach-back questions. Do not start Day 5 until every checkpoint below is complete.

#### Checkpoint A: Confirm the starting point

1. Run `git status` and record the current branch and any existing changes.
2. Run `npm run build` and keep the successful output as evidence.
3. Inspect `database/schema.sql` and `database/seed.sql`; do not recreate files that already exist.
4. Explain what disappears when the Day 3 in-memory server stops and what PostgreSQL should preserve.

#### Checkpoint B: Apply schema and seed to a disposable database

Use an empty training database, not a production database. The intern should run the `createdb`,
schema, and seed commands from the setup section above.

Verify all counts with one query:

```sql
SELECT
    (SELECT COUNT(*) FROM users) AS users_count,
    (SELECT COUNT(*) FROM projects) AS projects_count,
    (SELECT COUNT(*) FROM tasks) AS tasks_count;
```

Required result:

```text
users_count = 5
projects_count = 3
tasks_count = 12
```

If the counts are wrong, stop. Do not repeatedly run `seed.sql`, because it inserts rows and does
not reset the tables. Create a fresh disposable database or diagnose the existing data first.

#### Checkpoint C: Verify relationships and reads

The intern runs and records the output for:

- All users, projects, and tasks.
- Tasks belonging to one project with `WHERE`.
- Tasks joined to projects with the project name.
- Projects joined to users with the owner name and email.
- Tasks joined to projects and optionally assigned users using `LEFT JOIN`.
- The first five tasks with `ORDER BY` and `LIMIT`.
- The second page with `ORDER BY`, `LIMIT 5`, and `OFFSET 5`.
- Task counts grouped by status or project.

Before each query, write down the expected row count and explain which table supplies each selected
column. The result must be compared with that prediction.

#### Checkpoint D: Verify constraints

In a disposable database, attempt each invalid write and record both the PostgreSQL error and the
constraint that caused it:

| Attempt | Constraint to identify |
| --- | --- |
| Project with a nonexistent `owner_id` | `projects.owner_id` foreign key |
| User with a duplicate email | `users.email` unique constraint |
| Task with a nonexistent `project_id` | `tasks.project_id` foreign key |
| Task with a nonexistent `assigned_to` | `tasks.assigned_to` foreign key |
| User with a missing required name or email | `NOT NULL` constraint |

After each failed write, query for the test value and confirm that no row was inserted.

#### Checkpoint E: Verify delete actions safely

Use a disposable database because these actions intentionally remove or change rows.

1. Delete a project and prove its child tasks disappear. Explain `ON DELETE CASCADE`.
2. Delete a user who is assigned to a remaining task and prove the task remains while
   `assigned_to` becomes `NULL`. Explain `ON DELETE SET NULL`.
3. Run the task `UPDATE` and `DELETE` examples from `database/queries.sql`.
4. Confirm the update reports one affected row and the delete reports one affected row.

Do not expect PostgreSQL to reuse an ID after deletion. `SERIAL` uses a sequence, so a restored
practice row may receive a higher ID even when the total row count returns to 12.

#### Checkpoint F: Run the learner-written query file

The intern creates and reviews `database/queries.sql`. It must contain all nine required query
categories from the Day 4 guide:

1. Select all users, projects, and tasks.
2. Filter tasks by project.
3. Join tasks to projects.
4. Join projects to owners.
5. Update a task status.
6. Delete one test task.
7. Return the first five tasks.
8. Return the second page with `LIMIT 5 OFFSET 5`.
9. Produce one useful aggregate.

Run the file against a clean disposable database, then review the output in order. The write
queries must not be run against the primary `backend_internship` database.

#### Checkpoint G: Explain parameterization and the index

The intern records this explanation in their own words:

- Concatenating request input into SQL can allow input to alter SQL structure.
- A placeholder such as `$1` keeps SQL structure separate from the value.
- The database driver sends the values separately and treats them as data.
- `idx_tasks_project_id` supports the query that lists tasks for one project.
- Indexes can reduce lookup work but consume storage and add write overhead.
- Indexes should be selected for real access patterns, not added to every column.

The intern may use `EXPLAIN` for the project-filter query and should explain why PostgreSQL may
choose a sequential scan on a very small table even when an index exists.

#### Checkpoint H: Final Day 4 gate

Day 4 is complete only when the intern has evidence for all of the following:

- `schema.sql` applied successfully to an empty database.
- `seed.sql` produced 5 users, 3 projects, and 12 tasks.
- All required reads, joins, pagination, aggregate, update, and delete queries ran.
- Query predictions were compared with actual output.
- Duplicate, foreign-key, and required-field failures were explained.
- Cascade and set-null behavior were demonstrated.
- `database/queries.sql` exists and is learner-written.
- Parameterization and index reasoning are documented.
- `npm run build` succeeds.
- The intern can answer the Day 4 teach-back questions without copying definitions.

#### Checkpoint I: Intern-only cleanup and Git workflow

After the mentor confirms the evidence, the intern—not the mentor—should:

1. Drop any disposable Day 4 databases.
2. Confirm the primary `backend_internship` database is not accidentally modified by write examples.
3. Check that no password, token, `.env` file, or credential was added to Git.
4. Review `git diff` and `git status`.
5. Commit the Day 4 work in small, meaningful commits.
6. Push the `feature/postgresql-schema` branch.
7. Open a pull request containing setup commands, query evidence, constraint results, and build output.

The `Resources_info` training files are reference material and should not be treated as
application source code. Keep secrets and local environment files ignored. The mentor does not
run these cleanup or Git commands on the intern's behalf.

## Phase 2 - Day 6 Authentication: Passwords and JWT

Day 6 adds user registration, login and a protected endpoint. It answers one question for every protected request: **who is making this request?** What that user is *allowed* to do is Day 7.

### Setup

Install the new dependencies:

```bash
npm install bcryptjs jsonwebtoken
npm install -D @types/jsonwebtoken
```

`bcryptjs` is a pure-JavaScript bcrypt implementation. It produces standard bcrypt hashes (`$2b$...`) and needs no native build tools on Windows.

Add these to your local `.env`. `.env.example` lists the names without real values:

| Variable | Purpose | Example |
| --- | --- | --- |
| `JWT_SECRET` | Key used to sign and verify tokens. Must be at least 32 characters. | generate one (below) |
| `JWT_EXPIRES_IN` | Token lifetime: seconds or a number with `s`/`m`/`h`/`d`. Defaults to `1h`. | `1h` |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The server refuses to start if `JWT_SECRET` is missing or shorter than 32 characters. A placeholder such as `replace_me` would let anyone forge tokens, so failing early is safer than running with one. Never commit `.env`.

No schema change is needed: the Day 4 `users` table already has `email UNIQUE`, `password_hash` and `role DEFAULT 'user'`.

### Endpoints

| Method | Endpoint | Auth | Success | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | none | `201` | Create a user; returns safe user fields |
| POST | `/auth/login` | none | `200` | Check credentials; returns a JWT |
| GET | `/users/me` | Bearer token | `200` | Return the user identified by the token |

Error responses:

| Situation | Status | Body |
| --- | --- | --- |
| Missing/invalid name, email or password on register | `400` | specific validation message |
| Email already registered | `409` | `Email is already registered` |
| Wrong password **or** unknown email on login | `401` | `Invalid email or password` |
| No `Authorization` header | `401` | `Authentication required` |
| Header not in `Bearer <token>` form | `401` | `Authorization header must be in the format: Bearer <token>` |
| Bad signature, tampered or malformed token | `401` | `Invalid token` |
| Expired token | `401` | `Token has expired` |

### Request flow

```text
POST /auth/register
  -> authRoutes -> authController.register   (body shape: name/email/password are strings)
  -> authService.registerUser                (trim name, lowercase email, length rules)
  -> userRepository.findUserByEmail          (duplicate? -> 409)
  -> bcrypt.hash(password, 10)
  -> userRepository.createUser               (INSERT ... RETURNING safe columns only)
  -> 201 { id, name, email, role, createdAt }

POST /auth/login
  -> authController.login
  -> authService.loginUser
  -> userRepository.findUserByEmail
  -> bcrypt.compare(password, stored hash)   (any failure -> the same 401)
  -> jwt.sign({ role }, JWT_SECRET, { subject: id, expiresIn, HS256 })
  -> 200 { token, tokenType: "Bearer", expiresIn }

GET /users/me
  -> userRoutes -> authenticate middleware   (read header, verify token, set request.user)
  -> userController.getMe                    (uses request.user.id only)
  -> userService.getCurrentUser -> userRepository.findUserById
  -> 200 safe user
```

### Files added

| File | Responsibility |
| --- | --- |
| `src/config/auth.ts` | Reads and checks `JWT_SECRET` / `JWT_EXPIRES_IN` at startup |
| `src/models/user.ts` | `User` (safe), `UserWithPasswordHash` (internal), input and token types |
| `src/types/express.d.ts` | Adds the typed `request.user` property to Express's `Request` |
| `src/repositories/userRepository.ts` | Parameterized SQL for users and row mapping |
| `src/services/authService.ts` | Registration, login, hashing, JWT signing and verification |
| `src/services/userService.ts` | Loading the current user |
| `src/middleware/authenticate.ts` | Bearer-token middleware |
| `src/controllers/authController.ts` | HTTP handling for register and login |
| `src/controllers/userController.ts` | HTTP handling for `/users/me` |
| `src/routes/authRoutes.ts`, `src/routes/userRoutes.ts` | URL-to-controller mapping |

### Authentication vs authorization

- **Authentication** proves *who* you are. Here, a correct password at login gives you a signed token, and presenting that token later proves you are the same user.
- **Authorization** decides *what* that proven user may do, for example "only the owner may delete this project". It needs authentication first, because you cannot check ownership without a trusted identity.
- That is the difference between `401` and `403`. `401` means "I don't know who you are" (no token, a bad token or an expired token). `403` means "I know who you are, but you are not allowed to do this". Day 6 only produces `401`; Day 7 will add `403`.

### Password hashing

- Passwords are never stored. Only a bcrypt hash goes into `users.password_hash`.
- **Hashing is not encryption.** Encryption can be reversed with a key; a hash cannot. At login, the server hashes the supplied password again with the salt stored inside the hash and compares the results. It never needs to recover the original password.
- bcrypt adds a random **salt** per password, so two users with the same password get different hashes, and precomputed lookup tables are useless.
- bcrypt is deliberately **slow** (cost factor 10 means 2^10 rounds). That is barely noticeable for one login but makes guessing millions of passwords from a leaked table very expensive.
- bcrypt only reads the first 72 bytes of a password, so registration rejects longer passwords instead of silently ignoring the extra characters.
- API responses never include `password_hash`. The repository's `INSERT ... RETURNING` and `findUserById` do not even select it. Only the login lookup reads the hash, and it stays inside the service.

### JWT

- A JWT has three base64url parts: `header.payload.signature`.
  - **header**: the algorithm (`HS256`) and type.
  - **payload**: claims. This API puts in `sub` (user ID), `role`, `iat` (issued at) and `exp` (expiry).
  - **signature**: an HMAC of the header and payload computed with `JWT_SECRET`.
- The payload is **encoded, not encrypted**. Anyone with the token can decode and read it, so it never holds a password, a hash or any other secret.
- The signature is what makes the token trustworthy. Changing even one character of the payload (for example `role: "user"` → `"admin"`) makes the signature fail to verify. Only someone who knows `JWT_SECRET` can produce a valid signature, which is why the secret must come from configuration and never be committed.
- **What a JWT proves:** this server issued it, to this user ID, and it has not been changed or expired.
- **What it does not prove:** that the user still exists, that their role has not changed since the token was issued, or that the person sending it is the person it was issued to (a stolen token works until it expires). This is why tokens expire, why `/users/me` reloads the user from the database, and why a deleted user's token gets `401`.
- Verification pins the algorithm to `HS256`, so a token that claims `alg: none` (unsigned) is rejected.

### Authentication middleware

`src/middleware/authenticate.ts`:

1. Reads `Authorization`. If it is missing → `401`.
2. Requires exactly `Bearer <token>`. Any other shape → `401`.
3. Calls `verifyAccessToken`, which checks the signature, the algorithm and `exp`, then checks that `sub` is a positive integer and `role` is `user` or `admin`.
4. Sets `request.user = { id, role }` (typed through `src/types/express.d.ts`).
5. Calls `next()` only after verification succeeds. Every failure goes to the central `errorHandler`, and the response carries a `WWW-Authenticate: Bearer` header.

`/users/me` uses only `request.user.id`. It ignores any user ID in the body, the query string or the URL, because the verified token already tells us who the caller is.

### Security decisions

- **Generic login failure.** An unknown email and a wrong password both return `401 Invalid email or password`. When the email is unknown, the service still runs `bcrypt.compare` against a dummy hash, so the response time does not reveal which emails are registered either.
- **Registration has to say `409` for duplicates.** The Day 6 spec requires rejecting duplicate emails, so registration necessarily reveals that an email exists. Login still does not.
- **Emails are trimmed and lowercased** before storage and lookup, so `Alice@Example.com` and `alice@example.com` are the same account.
- **Role cannot be self-assigned.** `/auth/register` ignores any `role` in the body; the database default `user` always applies.
- **Race-safe duplicates.** If two registrations for the same email arrive at once, both can pass the lookup. The `UNIQUE` constraint then rejects the second insert, and the PostgreSQL error `23505` is mapped to `409` rather than leaking a database error as `500`.
- **Seed users cannot log in.** Their `password_hash` values from Day 4 are placeholders, not bcrypt hashes, so login for them fails with the normal `401`. Register a new user to test.

### How to test

Start the server (`npm run dev`), then in Git Bash:

```bash
# 1. Register
curl.exe -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Day Six Tester","email":"day6.tester@example.com","password":"correct-horse-battery"}'

# 2. Login and keep the token
TOKEN=$(curl.exe -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"day6.tester@example.com","password":"correct-horse-battery"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

# 3. Protected endpoint
curl.exe -i http://localhost:3000/users/me                                   # 401 no token
curl.exe -i http://localhost:3000/users/me -H "Authorization: Bearer nope"   # 401 invalid
curl.exe -i http://localhost:3000/users/me -H "Authorization: Bearer $TOKEN" # 200
```

Confirm that the database holds a hash and not the password:

```sql
SELECT id, email, left(password_hash, 7) AS prefix, length(password_hash) AS len
FROM users ORDER BY id DESC LIMIT 1;
-- prefix = $2b$10$, len = 60
```

### Day 6 test evidence

All checks below were run against the local PostgreSQL database with `npm run build` passing.

Registration:

| Request | Status | Response / proof |
| --- | --- | --- |
| Valid `name`/`email`/`password` (email typed as `Day6.Tester@Example.com`) | `201` | `{"id":8,"name":"Day Six Tester","email":"day6.tester@example.com","role":"user","createdAt":...}`, with no `password_hash` and the email lowercased |
| Same email again | `409` | `Email is already registered` |
| Missing password | `400` | `Name, email and password are required` |
| Email `not-an-email` | `400` | `A valid email is required` |
| Password `abc` | `400` | `Password must be between 8 and 72 bytes` |
| Name of only spaces | `400` | `Name must be between 1 and 100 characters` |
| Body is a JSON array | `400` | `Request body must be an object` |
| Body includes `"role":"admin"` | `201` | Created with `"role":"user"`; the role was ignored |
| Database row | n/a | `password_hash` starts with `$2b$10$`, is 60 characters long and does not equal the plaintext |

Login:

| Request | Status | Response / proof |
| --- | --- | --- |
| Correct credentials (email in different case) | `200` | `{"token":"eyJ...","tokenType":"Bearer","expiresIn":"1h"}` |
| Decoded token | n/a | header `{"alg":"HS256","typ":"JWT"}`, payload `{"role":"user","iat":...,"exp":...,"sub":"8"}`, where `exp - iat = 3600` and there is no password or hash |
| Wrong password | `401` | `Invalid email or password` |
| Unknown email | `401` | `Invalid email or password` (identical) |
| Seed user with placeholder hash | `401` | `Invalid email or password` |
| Missing password | `400` | `Email and password are required` |

`GET /users/me`:

| Request | Status | Response |
| --- | --- | --- |
| No `Authorization` header | `401` | `Authentication required` |
| `Authorization: Basic abc123` | `401` | `Authorization header must be in the format: Bearer <token>` |
| `Authorization: Bearer` (no token) | `401` | same as above |
| `Bearer not.a.jwt` | `401` | `Invalid token` |
| Real token with payload edited to `role: admin` | `401` | `Invalid token` (the signature no longer matches) |
| Token signed with a different secret | `401` | `Invalid token` |
| Unsigned `alg: none` token claiming admin | `401` | `Invalid token` |
| Correctly signed token with `exp` in the past | `401` | `Token has expired` |
| Valid token from `/auth/login` | `200` | `{"id":8,"name":"Day Six Tester","email":"day6.tester@example.com","role":"user",...}` |
| Valid token plus body `{"id":1}` | `200` | Still user `8`; the body is ignored |
| Correctly signed token for a user ID that does not exist | `401` | `User account no longer exists` |

Regression: `GET /projects`, `/projects/1`, `/projects/1/tasks` → `200`, and `/projects/99999` → `404`, the same as Day 5. Project and task routes are not protected yet; protecting write endpoints is Day 7 work.

### Day 6 teach-back

- **Authentication vs authorization:** proving identity vs checking permission.
- **Comparing without recovering:** bcrypt re-hashes the attempt with the stored salt and cost and compares the hashes. The original password is never needed again.
- **What a client can see in a JWT:** the header and payload, which are only base64url-encoded. Only the signature depends on the secret.
- **Why the secret is configuration:** anyone who has it can mint tokens for any user or role. It has to stay out of Git and differ between environments.
- **Why login errors are generic:** saying "no such email" turns login into a tool for discovering which accounts exist.
