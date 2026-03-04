import React from 'react';
import '@testing-library/jest-dom/vitest';

// Basic mocks for Next.js components used in tests.
vi.mock('next/image', () => ({
  // Simple img shim for tests
  default: (props: any) => {
    return React.createElement('img', props);
  },
}));

