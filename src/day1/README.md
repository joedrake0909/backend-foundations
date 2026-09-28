# Day 1 - JavaScript Backend Foundations

## Setup

1. Install Node.js.
2. Open a terminal in the `src/day1` directory.
3. Confirm Node.js is available:

```bash
node --version
```

No external packages are required for this lesson.

## Run

Run the day1 example with:

```bash
node index.js
```

The program waits briefly, fetches task `1` asynchronously, and prints the task.

## Module Structure

- `data.js` stores the in-memory task data.
- `taskService.js` contains task operations such as adding, deleting, updating, filtering, and summarizing tasks.
- `asyncDemo.js` fetches a task after a delay using a Promise and `await`.
- `index.js` is the entry point for running the example.

## Learning Notes

- CommonJS modules use `require()` to import code and `module.exports` to expose it.
- Keeping data, service logic, asynchronous behavior, and application startup in separate modules makes the code easier to maintain.
- A Promise represents a value that may be available later.
- An `async` function always returns a Promise.
- `await` pauses an async function until a Promise settles, which makes asynchronous code easier to read.
- `filter()` returns a new array containing items that match a condition.

## What I Learned Today

- `data.js` owns the shared in-memory `tasks` array.
- `taskService.js` contains the operations that find, add, delete, update, filter, and summarize tasks.
- A module can be imported as a complete object, such as `const service = require(...)`, or destructured to use one export directly, such as `const { tasks } = require(...)`.
- `findIndex()` returns `-1` when no matching item exists, so checking `index === -1` prevents accidentally deleting the last array item with `splice(-1, 1)`.
- The `updates` parameter is a separate object supplied by the caller, for example `{ status: "done" }`; it is not another field in the `tasks` array.
- `task.status = updates.status` changes the existing task object because the service holds a reference to the object inside the shared array.
- Status validation uses `undefined`, `includes()`, `&&`, and `!` to reject only supplied values that are not `todo`, `in-progress`, or `done`.
- An update should change `task.status` only when a new status was provided, so an empty update does not erase the existing status.
- Task IDs are entered manually, and `addTask()` rejects duplicate IDs.
- Small `node -e` commands can test one function at a time directly from the terminal.

Testing screenshots are stored in the `Screenshoot` folder.
