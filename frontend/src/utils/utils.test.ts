import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatScore,
  formatDuration,
  formatDurationLong,
  formatRelativeTime,
  calculateTimeRemaining,
  truncate,
  getInitials,
} from './index';

describe('Frontend Utils', () => {
  it('formatScore formats numbers with commas', () => {
    expect(formatScore(12500)).toBe('12,500');
    expect(formatScore(1000000)).toBe('1,000,000');
    expect(formatScore(0)).toBe('0');
  });

  it('formatDuration formats seconds to MM:SS', () => {
    expect(formatDuration(125)).toBe('2:05');
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(9)).toBe('0:09');
    expect(formatDuration(3605)).toBe('60:05');
  });

  it('formatDurationLong formats seconds to human-readable strings', () => {
    expect(formatDurationLong(3725)).toBe('1h 2m 5s');
    expect(formatDurationLong(65)).toBe('1m 5s');
    expect(formatDurationLong(45)).toBe('45s');
    expect(formatDurationLong(3600)).toBe('1h');
    expect(formatDurationLong(0)).toBe('0s');
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock system time to 2024-01-15T12:00:00Z
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "just now" for times under 60 seconds ago', () => {
      expect(formatRelativeTime('2024-01-15T11:59:30Z')).toBe('just now');
    });

    it('returns minutes ago', () => {
      expect(formatRelativeTime('2024-01-15T11:55:00Z')).toBe('5m ago');
    });

    it('returns hours ago', () => {
      expect(formatRelativeTime('2024-01-15T10:00:00Z')).toBe('2h ago');
    });

    it('returns days ago', () => {
      expect(formatRelativeTime('2024-01-12T12:00:00Z')).toBe('3d ago');
    });
  });

  describe('calculateTimeRemaining', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T10:05:00Z')); // 5 mins elapsed
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('calculates remaining seconds correctly', () => {
      const startedAt = '2024-01-01T10:00:00Z';
      const timeLimit = 600; // 10 mins
      // 5 mins (300s) have passed, so 300s should remain
      expect(calculateTimeRemaining(startedAt, timeLimit)).toBe(300);
    });

    it('returns 0 if time limit exceeded', () => {
      const startedAt = '2024-01-01T10:00:00Z';
      const timeLimit = 120; // 2 mins
      expect(calculateTimeRemaining(startedAt, timeLimit)).toBe(0);
    });
  });

  it('truncate shortens string and adds ellipsis', () => {
    expect(truncate('Hello World', 15)).toBe('Hello World');
    expect(truncate('Hello World', 8)).toBe('Hello...');
  });

  it('getInitials extracts up to 2 initials', () => {
    expect(getInitials('Venkatesh Naik')).toBe('VN');
    expect(getInitials('john doe smith')).toBe('JD');
    expect(getInitials('SingleName')).toBe('S');
  });
});
