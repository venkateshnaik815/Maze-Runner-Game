import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './msw/server';

// ── MSW Setup ────────────────────────────────────────────────────────
// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test so they don't affect other tests
afterEach(() => server.resetHandlers());

// Close server after all tests are done
afterAll(() => server.close());

// ── Mock Globals ─────────────────────────────────────────────────────
// Mock matchMedia for components relying on window metrics
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
