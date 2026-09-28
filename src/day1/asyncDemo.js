const { findTaskById } = require("./taskService.js");

async function fetchTaskAfterDelay(id, delay = 1000) {
    const task = await new Promise(resolve => {
        setTimeout(() => resolve(findTaskById(id)), delay);
    });

    return task;
}

module.exports = { fetchTaskAfterDelay };
