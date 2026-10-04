-- ============================================================
-- database/queries.sql
-- Practice queries for the backend internship project.
--
-- These are read-mostly examples against the schema in schema.sql
-- and the seed data in seed.sql.
--
-- Sections 7 and 8 (UPDATE and DELETE) modify data — run them
-- against a disposable database (e.g. day4_delete_test), NOT
-- against the primary backend_internship database.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Select all users
-- ------------------------------------------------------------
-- Basic full-table read; useful for verifying the seed and
-- for admin-style user listings.
SELECT id, name, email, role, created_at
FROM users
ORDER BY id;


-- ------------------------------------------------------------
-- 2. Select all projects
-- ------------------------------------------------------------
-- Full read of projects. Ordering by id keeps the output stable.
SELECT id, name, description, owner_id, created_at
FROM projects
ORDER BY id;


-- ------------------------------------------------------------
-- 3. Select all tasks
-- ------------------------------------------------------------
-- Full read of tasks. Shows the FK columns (project_id,
-- assigned_to) alongside the business fields.
SELECT id, title, status, project_id, assigned_to, created_at
FROM tasks
ORDER BY id;


-- ------------------------------------------------------------
-- 4. Filter tasks for one project with WHERE
-- ------------------------------------------------------------
-- Returns only the tasks that belong to project 1.
-- Demonstrates the WHERE clause on a foreign-key column.
SELECT id, title, status
FROM tasks
WHERE project_id = 1
ORDER BY id;


-- ------------------------------------------------------------
-- 5. Join tasks to projects
-- ------------------------------------------------------------
-- Pairs each task with the project it belongs to, so the
-- project's name can be shown alongside the task's title.
-- Plain JOIN is correct because tasks.project_id is NOT NULL.
SELECT
    tasks.id,
    tasks.title,
    tasks.status,
    projects.name AS project_name
FROM tasks
JOIN projects ON projects.id = tasks.project_id
ORDER BY tasks.id;


-- ------------------------------------------------------------
-- 6. Join projects to users
-- ------------------------------------------------------------
-- Pairs each project with its owner. Uses the projects.owner_id
-- foreign key. Plain JOIN is correct because owner_id is
-- NOT NULL and FK-enforced.
SELECT
    projects.id,
    projects.name AS project_name,
    users.name    AS owner_name
FROM projects
JOIN users ON users.id = projects.owner_id
ORDER BY projects.id;


-- ------------------------------------------------------------
-- 7. Update one test task  (DISPOSABLE DATABASE ONLY)
-- ------------------------------------------------------------
-- Changes a single task's status and shows the updated row
-- via RETURNING. Run this only in a scratch database such as
-- day4_delete_test, because it permanently alters data.
UPDATE tasks
SET status = 'done'
WHERE id = 1
RETURNING id, title, status;


-- ------------------------------------------------------------
-- 8. Delete one test task  (DISPOSABLE DATABASE ONLY)
-- ------------------------------------------------------------
-- Removes a single task and shows the row that was deleted via
-- RETURNING. Same caution as above: run only in a disposable
-- database.
DELETE FROM tasks
WHERE id = 2
RETURNING id, title, status;


-- ------------------------------------------------------------
-- 9. First page using LIMIT
-- ------------------------------------------------------------
-- Classic pagination, page 1: first 5 rows ordered by id.
SELECT id, title, status
FROM tasks
ORDER BY id
LIMIT 5;


-- ------------------------------------------------------------
-- 10. Second page using LIMIT + OFFSET
-- ------------------------------------------------------------
-- Page 2 of the same ordered result: skip the first 5 rows,
-- return the next 5.
SELECT id, title, status
FROM tasks
ORDER BY id
LIMIT 5 OFFSET 5;


-- ------------------------------------------------------------
-- 11. Aggregate task counts by status
-- ------------------------------------------------------------
-- Groups tasks by status and counts how many fall into each
-- bucket. Useful for dashboard-style summaries.
SELECT status, COUNT(*) AS task_count
FROM tasks
GROUP BY status
ORDER BY status;


-- ------------------------------------------------------------
-- 11b. Aggregate task counts by project
-- ------------------------------------------------------------
-- Same idea, grouped by project instead of status. Pairs with
-- the project JOIN so the output shows names, not just ids.
SELECT
    projects.id,
    projects.name AS project_name,
    COUNT(tasks.id) AS task_count
FROM projects
LEFT JOIN tasks ON tasks.project_id = projects.id
GROUP BY projects.id, projects.name
ORDER BY projects.id;