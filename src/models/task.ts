export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: string;
    createdAt: string;
}

export interface CreateTaskInput {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: string;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignee?: string;
}

export interface TaskSummary {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
}