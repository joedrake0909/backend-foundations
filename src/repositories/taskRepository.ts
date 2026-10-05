import { pool } from "../config/database.js";

import type {
    CreateDatabaseTaskInput,
    DatabaseTask,
    UpdateDatabaseTaskInput
} from "../models/databaseTask.js";

interface TaskRow {
    id: number;
    title: string;
    description: string | null;
    status: "todo" | "in-progress" | "done";
    project_id: number;
    assigned_to: number | null;
    created_at: Date;
}

function mapRowToTask(row: TaskRow): DatabaseTask {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        projectId: row.project_id,
        assignedTo: row.assigned_to,
        createdAt: row.created_at.toISOString()
    };
}

export async function createTaskForProject(
    input: CreateDatabaseTaskInput,
    projectId: number
): Promise<DatabaseTask> {
    const result = await pool.query<TaskRow>(
        `
        INSERT INTO tasks (
            title,
            description,
            status,
            project_id,
            assigned_to
        )
        VALUES ($1, $2, COALESCE($3, 'todo'), $4, $5)
        RETURNING
            id,
            title,
            description,
            status,
            project_id,
            assigned_to,
            created_at
        `,
        [
            input.title,
            input.description ?? null,
            input.status ?? null,
            projectId,
            input.assignedTo ?? null
        ]
    );

    const row = result.rows[0];

    if (!row) {
        throw new Error("Task insert returned no row");
    }

    return mapRowToTask(row);
}



export async function listTasksForProject(
    projectId: number
): Promise<DatabaseTask[]> {
    const result = await pool.query<TaskRow>(
        `
        SELECT
            id,
            title,
            description,
            status,
            project_id,
            assigned_to,
            created_at
        FROM tasks
        WHERE project_id = $1
        ORDER BY id
        `,
        [projectId]
    );

    return result.rows.map(mapRowToTask);
}



export async function findTaskById(
    id: number
): Promise<DatabaseTask | null> {
    const result = await pool.query<TaskRow>(
        `
        SELECT
            id,
            title,
            description,
            status,
            project_id,
            assigned_to,
            created_at
        FROM tasks
        WHERE id = $1
        `,
        [id]
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return mapRowToTask(row);
}



export async function updateTask(
    id: number,
    input: UpdateDatabaseTaskInput
): Promise<DatabaseTask | null> {
    const result = await pool.query<TaskRow>(
        `
        UPDATE tasks
        SET
            title = CASE WHEN $1 THEN $2 ELSE title END,
            description = CASE WHEN $3 THEN $4 ELSE description END,
            status = CASE WHEN $5 THEN $6 ELSE status END,
            assigned_to = CASE WHEN $7 THEN $8 ELSE assigned_to END
        WHERE id = $9
        RETURNING
            id,
            title,
            description,
            status,
            project_id,
            assigned_to,
            created_at
        `,
        [
            input.title !== undefined,
            input.title ?? null,

            Object.prototype.hasOwnProperty.call(input, "description"),
            input.description ?? null,

            input.status !== undefined,
            input.status ?? null,

            Object.prototype.hasOwnProperty.call(input, "assignedTo"),
            input.assignedTo ?? null,

            id
        ]
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return mapRowToTask(row);
}



export async function deleteTask(
    id: number
): Promise<DatabaseTask | null> {
    const result = await pool.query<TaskRow>(
        `
        DELETE FROM tasks
        WHERE id = $1
        RETURNING
            id,
            title,
            description,
            status,
            project_id,
            assigned_to,
            created_at
        `,
        [id]
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return mapRowToTask(row);
}