-- =========================================================
-- V2__create_player_profiles.sql
-- Player profile, preferences, and stats tables
-- Author: Venkatesh Naik
-- =========================================================

CREATE TABLE player_profiles (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id              UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name         VARCHAR(100) NOT NULL,
    bio                  VARCHAR(500),
    avatar_url           VARCHAR(1000),
    total_score          BIGINT       NOT NULL DEFAULT 0,
    games_played         INTEGER      NOT NULL DEFAULT 0,
    games_won            INTEGER      NOT NULL DEFAULT 0,
    games_abandoned      INTEGER      NOT NULL DEFAULT 0,
    total_time_played_s  BIGINT       NOT NULL DEFAULT 0,   -- seconds
    total_moves          BIGINT       NOT NULL DEFAULT 0,
    current_streak       INTEGER      NOT NULL DEFAULT 0,
    best_streak          INTEGER      NOT NULL DEFAULT 0,
    last_played_at       TIMESTAMPTZ,
    preferred_difficulty maze_difficulty,
    is_public            BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_player_profiles_user_id UNIQUE (user_id),
    CONSTRAINT ck_display_name_length CHECK (char_length(display_name) >= 2),
    CONSTRAINT ck_total_score_non_negative CHECK (total_score >= 0),
    CONSTRAINT ck_games_played_non_negative CHECK (games_played >= 0),
    CONSTRAINT ck_games_won_lte_played CHECK (games_won <= games_played)
);

CREATE INDEX idx_player_profiles_user_id      ON player_profiles (user_id);
CREATE INDEX idx_player_profiles_total_score  ON player_profiles (total_score DESC);
CREATE INDEX idx_player_profiles_games_played ON player_profiles (games_played DESC);
CREATE INDEX idx_player_profiles_is_public    ON player_profiles (is_public);

CREATE TRIGGER trg_player_profiles_updated_at
    BEFORE UPDATE ON player_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE  player_profiles IS 'Extended player data, statistics, and preferences';
COMMENT ON COLUMN player_profiles.total_score IS 'Cumulative score across all completed games';
COMMENT ON COLUMN player_profiles.current_streak IS 'Current daily play streak (days)';
COMMENT ON COLUMN player_profiles.best_streak IS 'All-time best daily play streak (days)';
