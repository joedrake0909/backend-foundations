import { pool } from "../config/database.js";
import type {
    CreateProjectInput,
    Project,
    UpdateProjectInput,
} from "../models/project.js";

interface ProjectRow {
    id: number;
    name: string;
    description: string | null;
    owner_id: number;
    created_at: Date;
}

function mapRowToProject(row: ProjectRow): Project {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        ownerId: row.owner_id,
        createdAt: row.created_at.toISOString(),
    };
}

export async function createProject(
    input: CreateProjectInput,
    ownerId: number
): Promise<Project> {
    const result = await pool.query<ProjectRow>(
        `
        INSERT INTO projects (name, description, owner_id)
        VALUES ($1, $2, $3)
        RETURNING id, name, description, owner_id, created_at
        `,
        [
            input.name,
            input.description ?? null,
            ownerId
        ]
    );

    const row = result.rows[0];

    if (!row) {
        throw new Error("Project insert returned no row");
    }

    return mapRowToProject(row);
}



export async function listProjects(): Promise<Project[]> {
    const result = await pool.query<ProjectRow>(
        `
        SELECT id, name, description, owner_id, created_at
        FROM projects
        ORDER BY id
        `
    );

    return result.rows.map(mapRowToProject);
}


export async function findProjectById(
    id: number
): Promise<Project | null> {
    const result = await pool.query<ProjectRow>(
        `
        SELECT id, name, description, owner_id, created_at
        FROM projects
        WHERE id = $1
        `,
        [id]
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return mapRowToProject(row);
}



export async function updateProject(
    id: number,
    input: UpdateProjectInput
): Promise<Project | null> {
    const result = await pool.query<ProjectRow>(
        `
        UPDATE projects
        SET
            name = CASE WHEN $1 THEN $2 ELSE name END,
            description = CASE WHEN $3 THEN $4 ELSE description END
        WHERE id = $5
        RETURNING id, name, description, owner_id, created_at
        `,
        [
            input.name !== undefined,
            input.name ?? null,
            Object.prototype.hasOwnProperty.call(input, "description"),
            input.description ?? null,
            id,
        ]
    );

    const row = result.rows[0];

    if (!row) {
        return null;   // ← no project with that id
    }

    return mapRowToProject(row);
}


export async function deleteProject(
    id: number
): Promise<Project | null> {
    const result = await pool.query<ProjectRow>(
        `
        DELETE FROM projects
        WHERE id = $1
        RETURNING id, name, description, owner_id, created_at
        `,
        [id]
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return mapRowToProject(row);
}