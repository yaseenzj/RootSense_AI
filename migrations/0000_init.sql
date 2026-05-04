-- RootSense AI D1 Schema
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clinical_records (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    patient_name TEXT,
    findings TEXT,
    status TEXT,
    accuracy TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS stats (
    user_id TEXT PRIMARY KEY,
    cleaning_count INTEGER DEFAULT 0,
    diagnosis_count INTEGER DEFAULT 0,
    quiz_count INTEGER DEFAULT 0,
    operative_count INTEGER DEFAULT 0,
    perio_count INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
