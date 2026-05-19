import React from 'react';
import '@testing-library/jest-dom/vitest';

// Basic mocks for Next.js components used in tests.
vi.mock('next/image', () => ({
  // Simple img shim for tests
  default: (props: any) => {
    return React.createElement('img', props);
  },
}));

// jsdom does not implement ResizeObserver; components that publish layout
// measurements (e.g. QuickFactsBar) rely on it. Provide a no-op shim so
// component effects can mount in tests.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverShim {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = ResizeObserverShim;
}

// jsdom does not implement IntersectionObserver either. MobileBookingBar
// uses it to detect when the desktop BookingPanel scrolls into view.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class IntersectionObserverShim {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).IntersectionObserver = IntersectionObserverShim;
}

