
import type { Task } from "./types.js";

const { fetchTaskAfterDelay } = require("./asyncDemo.js") as 
    { fetchTaskAfterDelay:
        (id: number, delay?: number) => Promise<Task | null> };

fetchTaskAfterDelay(1)
    .then(task => console.log("Fetched task:", task))
    .catch(error => console.error(error.message));
