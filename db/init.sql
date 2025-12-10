-- ====================================
--   SCHEMA STREAM RECOMMENDATION
-- ====================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
--      TABLE : USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    age INT,
    gender VARCHAR(50),
    preferences JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
--      TABLE : CONTENTS
-- =========================
CREATE TABLE IF NOT EXISTS contents (
    content_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100),
    category VARCHAR(100),
    tags TEXT,
    duration INT,
    creator_id VARCHAR(255),
    upload_date DATE,
    language VARCHAR(50),
    popularity_score DOUBLE PRECISION DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
--      TABLE : TRAILERS
-- =========================
CREATE TABLE IF NOT EXISTS trailers (
    trailer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES contents(content_id) ON DELETE CASCADE,
    trailer_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
--  TABLE : STREAMING_LINKS
-- =========================
CREATE TABLE IF NOT EXISTS streaming_links (
    link_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES contents(content_id) ON DELETE CASCADE,
    platform VARCHAR(100),
    quality VARCHAR(50),
    url TEXT NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
--     INDEXES OPTIMISÉS
-- =========================
CREATE INDEX IF NOT EXISTS idx_contents_category ON contents(category);
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_contents_title ON contents(title);
