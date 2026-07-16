'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';

/**
 * Share button: native Web Share API where available (mobile), copy-link
 * fallback otherwise. Reads the current URL at click time so it works on
 * any page without threading the URL through props.
 */
export function ShareButton({ title, label, copiedLabel, className = '' }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled — no-op */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-live="polite"
      className={`inline-flex items-center gap-2 rounded-button border border-neutral-300 px-4 py-2 text-small font-semibold text-wildher-text hover:border-brand-primary-green hover:text-brand-primary-green transition-colors duration-200 motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-green focus-visible:ring-offset-2 ${className}`}
    >
      <Icon name={copied ? 'check' : 'share'} size={16} />
      {copied ? copiedLabel : label}
    </button>
  );
}

export default ShareButton;
