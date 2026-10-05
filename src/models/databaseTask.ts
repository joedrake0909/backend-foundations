export type DatabaseTaskStatus = "todo" | "in-progress" | "done";

export interface DatabaseTask {
    id: number;
    title: string;
    description: string | null;
    status: DatabaseTaskStatus;
    projectId: number;
    assignedTo: number | null;
    createdAt: string;
}

export interface CreateDatabaseTaskInput {
    title: string;
    description?: string | null;
    status?: DatabaseTaskStatus;
    assignedTo?: number | null;
}

export interface UpdateDatabaseTaskInput {
    title?: string;
    description?: string | null;
    status?: DatabaseTaskStatus;
    assignedTo?: number | null;
}