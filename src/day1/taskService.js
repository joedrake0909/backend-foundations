const { tasks } = require("./data.js");
const VALID_STATUSES = ["todo", "in-progress", "done"];


// finds task by id
function findTaskById(id) {
    if ( typeof id !== "number" ) {
        throw new Error("Id must be a number");
    }

    const task = tasks.find(task => task.id === id);

    return task || null;
}


// Add a new task to the tasks array
function addTask({ id, title, status, priority, assignee} = {}) {

    if (id === undefined) {
        throw new Error("task id is required");
    }

    if (!title || !status || !priority || !assignee) {
        throw new Error("Missing required task properties");
    }

    const existingTask = tasks.find(task => task.id === id);
    if (existingTask) {
        throw new Error(`Task with id ${id} already exists`);
    }

    const task = {id, title, status, priority, assignee};
    tasks.push(task);
    return task;
}

// delete a task by id
function deleteTask(id) {
    if ( typeof id !== "number" ) {
        throw new Error("Id must be a number");
    }

    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
        throw new Error(`Task with id ${id} not found`);
    }

    const deletedTask = tasks.splice(index, 1)[0];
    return deletedTask;
}

// update task status
function updateTask(id, updates) {
    //validate id type
    if (typeof id !== "number") {
        throw new Error("ID must be a number");
    }

    // validate status (only if provided)
    if (updates.status !== undefined && !VALID_STATUSES.includes(updates.status)) {
        throw new Error(`Invalid status: ${updates.status}`);
    }

    //find task
    const task = findTaskById(id);
    if (!task) {
        throw new Error(`Task with id ${id} does not exist`);
    }

    // update status only when a new status was provided
    if (updates.status !== undefined) {
        task.status = updates.status;
    }

    //  return updated task
    return task;
}

// get tasks by status
function getTasksByStatus(status) {
    if (!VALID_STATUSES.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
    }

    return tasks.filter(task => task.status === status);
}

// summarize tasks by status
function getTaskSummary() {
    return {
        total: tasks.length,
        todo: tasks.filter(task => task.status === "todo").length,
        inProgress: tasks.filter(task => task.status === "in-progress").length,
        done: tasks.filter(task => task.status === "done").length,
    };
}

module.exports = {
    findTaskById,
    addTask,
    deleteTask,
    updateTask,
    getTasksByStatus,
    getTaskSummary,
};

