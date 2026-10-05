export interface Project {
    id: number;
    name: string;
    description: string | null;
    ownerId: number;
    createdAt: string;
}

export interface CreateProjectInput {
    name: string;
    description?: string | null;
}

export interface UpdateProjectInput {
    name?: string;
    description?: string | null;
}