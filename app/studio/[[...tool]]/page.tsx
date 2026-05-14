'use client';

/**
 * Sanity Studio mounted at /studio. Client-only because Sanity Studio
 * relies on browser-side context providers.
 */
import { NextStudio } from 'next-sanity/studio';
import { isSanityConfigured } from '@/sanity/env';
import config from '../../../sanity.config';

export default function StudioPage() {
  if (!isSanityConfigured()) {
    return (
      <main
        style={{
          padding: '4rem',
          maxWidth: 640,
          margin: '0 auto',
          fontFamily: 'system-ui',
        }}
      >
        <h1>Sanity not configured</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in{' '}
          <code>.env.local</code> and restart <code>npm run dev</code>.
        </p>
        <pre
          style={{
            background: '#f6f6f6',
            padding: '1rem',
            borderRadius: 8,
          }}
        >
{`# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production`}
        </pre>
        <p>
          Get the project ID from{' '}
          <a
            href="https://sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
          >
            sanity.io/manage
          </a>
          .
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
