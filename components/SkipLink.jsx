import React from 'react';

export function SkipLink({ targetId = 'main-content' }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-radius-button focus:bg-brand-primary-green focus:text-white focus:shadow-button"
    >
      Preskoči na sadržaj
    </a>
  );
}

export default SkipLink;

