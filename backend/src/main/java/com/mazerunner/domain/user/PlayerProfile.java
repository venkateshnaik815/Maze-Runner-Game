package com.mazerunner.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Player profile domain entity.
 *
 * <p>Extends a User with game-specific statistics, preferences, and public
 * profile data. One-to-one relationship with User.
 *
 * <p>Statistics are updated incrementally after each game session completes.
 * Heavy aggregations (e.g., per-maze best score) are computed at query time.
 *
 * @author Venkatesh Naik
 */
@Entity
@Table(
    name = "player_profiles",
    indexes = {
        @Index(name = "idx_player_profiles_user_id",     columnList = "user_id"),
        @Index(name = "idx_player_profiles_total_score", columnList = "total_score DESC")
    }
)
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString
public class PlayerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true,
                foreignKey = @ForeignKey(name = "fk_player_profiles_user_id"))
    private User user;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    @Column(name = "bio", length = 500)
    private String bio;

    @Column(name = "avatar_url", length = 1000)
    private String avatarUrl;

    @Column(name = "total_score", nullable = false)
    private long totalScore = 0L;

    @Column(name = "games_played", nullable = false)
    private int gamesPlayed = 0;

    @Column(name = "games_won", nullable = false)
    private int gamesWon = 0;

    @Column(name = "games_abandoned", nullable = false)
    private int gamesAbandoned = 0;

    @Column(name = "total_time_played_s", nullable = false)
    private long totalTimePlayedSeconds = 0L;

    @Column(name = "total_moves", nullable = false)
    private long totalMoves = 0L;

    @Column(name = "current_streak", nullable = false)
    private int currentStreak = 0;

    @Column(name = "best_streak", nullable = false)
    private int bestStreak = 0;

    @Column(name = "last_played_at")
    private Instant lastPlayedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_difficulty", length = 20)
    private MazeDifficulty preferredDifficulty;

    @Column(name = "is_public", nullable = false)
    private boolean publicProfile = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * Factory method — creates a default profile for a newly registered player.
     *
     * @param user the owner of this profile
     * @return new PlayerProfile (not persisted)
     */
    public static PlayerProfile createDefault(final User user) {
        final PlayerProfile profile = new PlayerProfile();
        profile.user = user;
        profile.displayName = user.getUsername();
        profile.publicProfile = true;
        return profile;
    }

    /**
     * Records a completed game win, updating all relevant statistics.
     *
     * @param score          score earned in the game
     * @param durationSeconds time taken in seconds
     * @param moves          total moves made
     */
    public void recordWin(final long score, final long durationSeconds, final long moves) {
        this.totalScore += score;
        this.gamesPlayed++;
        this.gamesWon++;
        this.totalTimePlayedSeconds += durationSeconds;
        this.totalMoves += moves;
        this.lastPlayedAt = Instant.now();
        incrementStreak();
    }

    /**
     * Records a game loss or timeout, updating statistics (no streak increment).
     *
     * @param durationSeconds time taken in seconds
     * @param moves           total moves made
     */
    public void recordLoss(final long durationSeconds, final long moves) {
        this.gamesPlayed++;
        this.totalTimePlayedSeconds += durationSeconds;
        this.totalMoves += moves;
        this.lastPlayedAt = Instant.now();
        resetStreak();
    }

    /**
     * Records an abandoned game (no score, no streak change).
     */
    public void recordAbandoned() {
        this.gamesPlayed++;
        this.gamesAbandoned++;
    }

    /**
     * Increments current streak and updates best streak if needed.
     */
    private void incrementStreak() {
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
    }

    /**
     * Resets the current streak to zero.
     */
    private void resetStreak() {
        this.currentStreak = 0;
    }

    /**
     * Returns the win ratio as a percentage (0–100), or 0 if no games played.
     *
     * @return win ratio percentage
     */
    public double getWinRatio() {
        if (gamesPlayed == 0) {
            return 0.0;
        }
        return (double) gamesWon / gamesPlayed * 100.0;
    }

    /**
     * Returns the average score per completed game, or 0 if no games played.
     *
     * @return average score
     */
    public double getAverageScore() {
        if (gamesPlayed == 0) {
            return 0.0;
        }
        return (double) totalScore / gamesPlayed;
    }
}
