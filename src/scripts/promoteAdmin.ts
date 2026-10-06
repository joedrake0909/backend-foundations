import { pool } from "../config/database.js";

// Bootstraps the first admin, since registration can never create one.
// Usage: npm run admin:promote -- user@example.com
async function main(): Promise<void> {
    const email = process.argv[2]?.trim().toLowerCase();

    if (!email) {
        console.error("Usage: npm run admin:promote -- <email>");
        process.exitCode = 1;

        return;
    }

    const result = await pool.query<{ id: number; email: string; role: string }>(
        `
        UPDATE users
        SET role = 'admin'
        WHERE email = $1
        RETURNING id, email, role
        `,
        [email]
    );

    const row = result.rows[0];

    if (!row) {
        console.error(`No user registered with email ${email}`);
        process.exitCode = 1;

        return;
    }

    console.log(`User ${row.id} (${row.email}) is now ${row.role}`);
}

main()
    .catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
