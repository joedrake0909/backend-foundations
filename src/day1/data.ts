
import type { Task } from "./types.js";

// Initial in-memory task data.

const tasks: Task[] = [
    { id: 1, title: "Set up project repo", description: "Create and configure the project repository", status: "done", priority: "high", assignee: "Alice", createdAt: "2024-06-01T10:00:00Z" },
    { id: 2, title: "Write README", status: "in-progress", description: "It was all about Readme file", priority: "medium", assignee: "Bob", createdAt: "2024-06-02T12:00:00Z" },
    { id: 3, title: "Design task model", description: "I design the task model", status: "todo", priority: "high", assignee: "Alice", createdAt: "2024-06-03T14:00:00Z" },
    { id: 4, title: "Implement add task", description: "implement added task", status: "todo", priority: "medium", assignee: "Charlie", createdAt: "2024-06-04T16:00:00Z" }, 
    { id: 5, title: "Implement find task", description: "implement find task", status: "in-progress", priority: "low", assignee: "Bob", createdAt: "2024-06-05T18:00:00Z" },
    { id: 6, title: "Implement update task", description: "implement update task", status: "todo", priority: "high", assignee: "Diana", createdAt: "2024-06-06T20:00:00Z" },
    { id: 7, title: "Implement delete task", description: "implement delete task", status: "done", priority: "low", assignee: "Charlie", createdAt: "2024-06-07T22:00:00Z"    }, 
    { id: 8, title: "Write summary function",  description: "added the write summary", status: "todo",  priority: "medium", assignee: "Diana", createdAt: "2024-06-08T09:00:00Z" },
];

module.exports = { tasks };
