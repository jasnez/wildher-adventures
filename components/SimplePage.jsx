import React from 'react';

/**
 * Plain content page wrapper used by safety / terms / privacy.
 * Renders a centered article with title, optional date stamp, and paragraphs.
 */
export function SimplePage({ title, lastUpdatedLabel, lastUpdatedDate, children }) {
  return (
    <main id="main-content" className="min-h-[70vh] px-4 py-16">
      <article className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-wildher-text mb-4">
          {title}
        </h1>
        {lastUpdatedDate && (
          <p className="text-small text-wildher-text-muted mb-8">
            {lastUpdatedLabel}: {lastUpdatedDate}
          </p>
        )}
        <div className="prose-content space-y-4 text-body text-wildher-text-muted">
          {children}
        </div>
      </article>
    </main>
  );
}

export default SimplePage;
