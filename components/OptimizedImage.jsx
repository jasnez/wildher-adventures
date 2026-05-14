'use client';

import React from 'react';

const WIDTHS = [400, 640, 960, 1280, 1920];

function isAbsoluteUrl(value) {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}

function sanityVariant(url, width) {
  if (!url.includes('cdn.sanity.io')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}w=${width}&auto=format&fit=max&q=80`;
}

/**
 * Image component that handles three sources:
 *   1. `src` prop pointing at a Sanity CDN URL → builds responsive srcset via Sanity image API.
 *   2. `src` prop pointing at any other absolute URL → renders <img src>.
 *   3. `name` prop (legacy mock data) → renders pre-generated /images/{name}-{w}w.webp.
 */
export function OptimizedImage({
  name,
  src,
  alt,
  sizes = '100vw',
  className,
  priority = false,
  width,
  height,
  ...imgProps
}) {
  // Allow legacy callers to pass a URL into `name` too — treat as src.
  const effectiveSrc = isAbsoluteUrl(src) ? src : isAbsoluteUrl(name) ? name : null;
  if (effectiveSrc) {
    const srcSet = WIDTHS.map((w) => `${sanityVariant(effectiveSrc, w)} ${w}w`).join(', ');
    return (
      <img
        src={sanityVariant(effectiveSrc, WIDTHS[WIDTHS.length - 1])}
        srcSet={srcSet}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
        width={width}
        height={height}
        {...imgProps}
      />
    );
  }

  const base = `/images/${name}`;
  const srcSet = WIDTHS.map((w) => `${base}-${w}w.webp ${w}w`).join(', ');
  const defaultSrc = `${base}-${WIDTHS[WIDTHS.length - 1]}w.webp`;

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={defaultSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        className={className}
        width={width}
        height={height}
        {...imgProps}
      />
    </picture>
  );
}

export default OptimizedImage;
