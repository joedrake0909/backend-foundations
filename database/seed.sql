INSERT INTO users (name, email, password_hash, role) VALUES
    ('Alice Johnson',  'alice@example.com',  'placeholder_hash_1', 'user'),
    ('Bob Smith',      'bob@example.com',    'placeholder_hash_2', 'user'),
    ('Carol Martinez', 'carol@example.com',  'placeholder_hash_3', 'user'),
    ('David Chen',     'david@example.com',  'placeholder_hash_4', 'user'),
    ('Eve Admin',      'eve@example.com',    'placeholder_hash_5', 'admin');


INSERT INTO projects (name, description, owner_id) VALUES
    ('Internship Task API', 'Backend API for managing projects and tasks', 1),
    ('Database Migration',  'Move legacy data to the new schema',          2),
    ('Security Upgrade',    'Rotate credentials and harden authentication', 5);



INSERT INTO tasks (title, description, status, project_id, assigned_to) VALUES
    ('Design database schema',         'Define tables, columns, and constraints',           'done',        1, 1),
    ('Document database relationships','Describe foreign keys and cascade behavior',        'in-progress', 1, 2),
    ('Prepare API migration plan',     'Outline endpoints and data flow for the API',       'todo',        1, 3),
    ('Review task requirements',       'Cross-check the task list against the spec',        'todo',        1, NULL),
    ('Configure PostgreSQL connection','Wire up the app to PostgreSQL on port 5433',        'todo',        2, 2),
    ('Create project repository',      'Implement data access for projects',                'in-progress', 2, 3),
    ('Create task repository',         'Implement data access for tasks',                   'todo',        2, 4),
    ('Test persistence after restart', 'Verify data survives a service restart',            'todo',        2, 1),
    ('Design registration flow',       'Sketch the user signup and login steps',            'done',        3, 5),
    ('Add password hashing',           'Integrate bcrypt for password storage',             'todo',        3, 1),
    ('Add JWT login',                  'Issue and verify access tokens on login',           'todo',        3, 5),
    ('Test ownership rules',           'Confirm users only access their own resources',    'in-progress', 3, 4);