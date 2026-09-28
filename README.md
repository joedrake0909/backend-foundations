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
