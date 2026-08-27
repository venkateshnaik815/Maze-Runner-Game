import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ApiError } from '@/types';

/**
 * Merges Tailwind CSS class names intelligently, resolving conflicts.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric score with locale-appropriate comma separators.
 * @example formatScore(12500) → "12,500"
 */
export function formatScore(score: number): string {
  return score.toLocaleString('en-US');
}

/**
 * Formats a duration in seconds to MM:SS display format.
 * @example formatDuration(125) → "2:05"
 */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a duration in seconds to a human-readable string.
 * @example formatDurationLong(3725) → "1h 2m 5s"
 */
export function formatDurationLong(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Formats an ISO date string to a human-readable date.
 * @example formatDate("2024-01-15T10:30:00Z") → "Jan 15, 2024"
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(isoString));
}

/**
 * Formats an ISO date string to a relative time string.
 * @example formatRelativeTime("2024-01-15T10:30:00Z") → "3 days ago"
 */
export function formatRelativeTime(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return 'just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
  return formatDate(isoString);
}

/**
 * Extracts a user-friendly error message from an API error response.
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred';

  // Axios-style error
  const axiosError = error as { response?: { data?: ApiError } };
  if (axiosError?.response?.data?.detail) {
    return axiosError.response.data.detail;
  }
  if (axiosError?.response?.data?.title) {
    return axiosError.response.data.title;
  }

  // Generic error
  if (error instanceof Error) return error.message;

  return 'An unexpected error occurred';
}

/**
 * Returns field-level validation errors from an API error response.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  const axiosError = error as { response?: { data?: ApiError } };
  return axiosError?.response?.data?.fieldErrors ?? {};
}

/**
 * Calculates remaining seconds given a start time and time limit.
 */
export function calculateTimeRemaining(
  startedAt: string,
  timeLimitSeconds: number
): number {
  const startTime = new Date(startedAt).getTime();
  const elapsedMs = Date.now() - startTime;
  const remaining = timeLimitSeconds - Math.floor(elapsedMs / 1000);
  return Math.max(0, remaining);
}

/**
 * Formats a time remaining value to a colored display string.
 * Returns CSS class appropriate for urgency level.
 */
export function getTimerColorClass(remainingSeconds: number): string {
  if (remainingSeconds <= 10) return 'text-red-400 animate-pulse';
  if (remainingSeconds <= 30) return 'text-orange-400';
  if (remainingSeconds <= 60) return 'text-yellow-400';
  return 'text-green-400';
}

/**
 * Truncates a string to a max length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Generates initials from a display name (up to 2 characters).
 * @example getInitials("Venkatesh Naik") → "VN"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
