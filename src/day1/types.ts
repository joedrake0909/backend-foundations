type TaskStatus = "todo" | "in-progress" | "done";

type TaskPriority = "low" | "medium" | "high";

interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: string;
    createdAt: string;
}

interface TaskSummary {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}


export type { Task, TaskStatus, TaskPriority, TaskSummary, ApiResponse };