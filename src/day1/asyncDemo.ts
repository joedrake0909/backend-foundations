
import type { Task } from "./types.js";
const { findTaskById } = require("./taskService.js") as
    { findTaskById: (id: number) => Task | null };

async function fetchTaskAfterDelay(id: number, delay: number = 1000): Promise<Task | null> {
    const task = await new Promise<Task | null>(resolve => {
        setTimeout(() => resolve(findTaskById(id)), delay);
    });

    return task;
}

module.exports = { fetchTaskAfterDelay };
