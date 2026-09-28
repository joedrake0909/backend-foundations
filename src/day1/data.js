
// Initial in-memory task data.

const tasks = [
    { id: 1, title: "Set up project repo", status: "done", priority: "high", assignee: "Alice" },
    { id: 2, title: "Write README", status: "in-progress", priority: "medium", assignee: "Bob" },
    { id: 3, title: "Design task model", status: "todo", priority: "high", assignee: "Alice" },
    { id: 4, title: "Implement add task", status: "todo", priority: "medium", assignee: "Charlie" },
    { id: 5, title: "Implement find task", status: "in-progress", priority: "low", assignee: "Bob" },
    { id: 6, title: "Implement update task", status: "todo", priority: "high", assignee: "Diana" },
    { id: 7, title: "Implement delete task", status: "done", priority: "low", assignee: "Charlie" },
    { id: 8, title: "Write summary function", status: "todo", priority: "medium", assignee: "Diana" },
];

module.exports = { tasks };