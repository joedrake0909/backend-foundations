CREATE TABLE users (
    id             SERIAL PRIMARY KEY, 
    name           VARCHAR(100) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  TEXT         NOT NULL,
    role           VARCHAR(20)  NOT NULL DEFAULT 'user',
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);


CREATE TABLE projects (
    id             SERIAL PRIMARY KEY, 
    name           VARCHAR(150) NOT NULL,
    description    TEXT,
    owner_id       INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


CREATE TABLE tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'todo',
    project_id  INTEGER      NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to INTEGER      REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_project_id ON tasks (project_id);