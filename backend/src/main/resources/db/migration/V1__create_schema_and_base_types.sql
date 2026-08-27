-- =========================================================
-- V1__create_schema_and_base_types.sql
-- Creates UUID extension, base enums, and audit columns
-- Author: Venkatesh Naik
-- =========================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('PLAYER', 'ADMIN');

CREATE TYPE maze_difficulty AS ENUM (
    'EASY',
    'MEDIUM',
    'HARD',
    'EXPERT',
    'LEGENDARY'
);

CREATE TYPE maze_algorithm AS ENUM (
    'RECURSIVE_BACKTRACKER',
    'PRIMS',
    'KRUSKALS',
    'WILSONS',
    'ALDOUS_BRODER'
);

CREATE TYPE game_status AS ENUM (
    'IN_PROGRESS',
    'COMPLETED',
    'ABANDONED',
    'TIMED_OUT',
    'SAVED'
);

CREATE TYPE game_result AS ENUM (
    'WIN',
    'LOSS',
    'ABANDONED'
);

CREATE TYPE power_up_type AS ENUM (
    'REVEAL_PATH',
    'FREEZE_TIMER',
    'TELEPORT',
    'WALL_BREAKER',
    'COMPASS',
    'SPEED_BOOST'
);

CREATE TYPE achievement_category AS ENUM (
    'PROGRESSION',
    'SPEED',
    'PERFECTION',
    'EXPLORER',
    'PERSISTENCE',
    'SOCIAL',
    'COLLECTOR',
    'LEGENDARY'
);

-- ─── Users Table ──────────────────────────────────────────────────

CREATE TABLE users (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username          VARCHAR(50)  NOT NULL,
    email             VARCHAR(255) NOT NULL,
    password_hash     VARCHAR(255) NOT NULL,
    role              user_role    NOT NULL DEFAULT 'PLAYER',
    is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
    email_verified    BOOLEAN      NOT NULL DEFAULT FALSE,
    email_verify_token VARCHAR(255),
    email_verify_token_expiry TIMESTAMPTZ,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    last_login_at     TIMESTAMPTZ,

    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email    UNIQUE (email),
    CONSTRAINT ck_users_username_length CHECK (char_length(username) >= 3),
    CONSTRAINT ck_users_email_format    CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email    ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_role     ON users (role);
CREATE INDEX idx_users_is_active ON users (is_active);

COMMENT ON TABLE  users IS 'Platform user accounts with authentication data';
COMMENT ON COLUMN users.id            IS 'UUID primary key';
COMMENT ON COLUMN users.username      IS 'Unique display username (3-50 chars)';
COMMENT ON COLUMN users.email         IS 'Unique email address for auth';
COMMENT ON COLUMN users.password_hash IS 'BCrypt hashed password (strength 12)';
COMMENT ON COLUMN users.role          IS 'User role: PLAYER or ADMIN';

-- ─── Refresh Tokens ───────────────────────────────────────────────

CREATE TABLE refresh_tokens (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash   VARCHAR(255) NOT NULL,
    device_info  VARCHAR(500),
    ip_address   INET,
    expires_at   TIMESTAMPTZ  NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    revoked_at   TIMESTAMPTZ,

    CONSTRAINT uq_refresh_tokens_hash UNIQUE (token_hash)
);

CREATE INDEX idx_refresh_tokens_user_id   ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens (token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);

COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens with revocation support';

-- ─── Password Reset Tokens ────────────────────────────────────────

CREATE TABLE password_reset_tokens (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ  NOT NULL,
    used_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_password_reset_token_hash UNIQUE (token_hash)
);

CREATE INDEX idx_password_reset_user_id ON password_reset_tokens (user_id);

-- ─── Auto-update updated_at trigger ─────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
