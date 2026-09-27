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
