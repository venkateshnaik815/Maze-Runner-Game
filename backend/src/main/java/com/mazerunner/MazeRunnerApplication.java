package com.mazerunner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main entry point for the Maze Runner Game Platform backend.
 *
 * <p>This is a Spring Boot 3.3 application built on Java 21 implementing
 * Clean Architecture (Domain → Application → Infrastructure → Presentation).
 *
 * <p>Features:
 * <ul>
 *   <li>JWT authentication with refresh token rotation</li>
 *   <li>Procedurally generated mazes (5 algorithms)</li>
 *   <li>Real-time leaderboards via WebSocket and Redis</li>
 *   <li>Achievement system with domain event-driven unlocking</li>
 *   <li>Player profiles, game history, save/load</li>
 *   <li>Admin dashboard with analytics</li>
 * </ul>
 *
 * @author Venkatesh Naik
 * @version 1.0.0
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
public class MazeRunnerApplication {

    /**
     * Application main entry point.
     *
     * @param args command-line arguments passed to the application
     */
    public static void main(final String[] args) {
        SpringApplication.run(MazeRunnerApplication.class, args);
    }
}
