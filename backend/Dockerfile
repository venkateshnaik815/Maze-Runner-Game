# ─────────────────────────────────────────────────────────────────
# Maze Runner Game — Backend Dockerfile (Multi-stage)
#
# Stages:
#   build       → Maven build (JDK 21)
#   development → Development image with hot reload support
#   test        → Test runner image
#   production  → Optimized production image (JRE 21, non-root)
# ─────────────────────────────────────────────────────────────────

# ─── Stage 1: Build ───────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /build

# Copy Maven wrapper and POM first for dependency caching
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .

# Download dependencies (cached layer unless pom.xml changes)
RUN ./mvnw dependency:go-offline -q --no-transfer-progress

# Copy source code
COPY src/ src/

# Build the application (skip tests — tests run in CI separately)
RUN ./mvnw clean package -DskipTests --no-transfer-progress && \
    mkdir -p target/dependency && \
    cd target/dependency && \
    jar -xf ../*.jar

# ─── Stage 2: Development ─────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS development

WORKDIR /app

# Copy Maven wrapper for hot reload via spring-boot:run
COPY --from=build /build/.mvn/ .mvn/
COPY --from=build /build/mvnw .
COPY --from=build /build/pom.xml .

# Install curl for health checks
RUN apk add --no-cache curl

EXPOSE 8080

# Development: run with spring-boot:run for hot reload
CMD ["./mvnw", "spring-boot:run", \
     "-Dspring-boot.run.profiles=dev", \
     "--no-transfer-progress"]

# ─── Stage 3: Test ────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS test

WORKDIR /app

COPY --from=build /build/ .

RUN apk add --no-cache curl

EXPOSE 8080

CMD ["./mvnw", "spring-boot:run", \
     "-Dspring-boot.run.profiles=test", \
     "--no-transfer-progress"]

# ─── Stage 4: Production ──────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS production

# Security hardening: run as non-root user
RUN addgroup --system --gid 1001 mazerunner && \
    adduser  --system --uid  1001 --ingroup mazerunner mazerunner

WORKDIR /app

# Install curl for health checks (minimal)
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Copy layered JAR (optimal Docker layer caching)
ARG DEPENDENCY=/build/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# Set proper ownership
RUN chown -R mazerunner:mazerunner /app

USER mazerunner

EXPOSE 8080

# JVM tuning for containerized environment
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+UseG1GC \
               -XX:+OptimizeStringConcat \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.profiles.active=prod"

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/v1/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -cp app:app/lib/* com.mazerunner.MazeRunnerApplication"]

# ─── Default target: production ───────────────────────────────────
FROM production
