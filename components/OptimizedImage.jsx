'use client';

import React from 'react';

/**
 * Širine generisane skriptom optimize-images.js — moraju odgovarati scripts/optimize-images.js
 */
const WIDTHS = [400, 640, 960, 1280, 1920];

/**
 * OptimizedImage — koristi WebP placeholder slike s lazy load i srcset.
 * Za slike generisane npm run optimize-images (Public/images/*.webp).
 *
 * @param {string} name - Ime slike bez ekstenzije (npr. "1", "2", "10")
 * @param {string} alt - Alt tekst (obavezan za pristupačnost)
 * @param {string} [sizes] - CSS sizes za srcset (default: full width na svim breakpointima)
 * @param {string} [className] - CSS klasa za <img>
 * @param {boolean} [priority] - Ako true, isključuje lazy load (za hero/LCP slike)
 * @param {object} [imgProps] - Ostali props za <img> (npr. width, height za layout)
 */
export function OptimizedImage({
  name,
  alt,
  sizes = '100vw',
  className,
  priority = false,
  ...imgProps
}) {
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
        {...imgProps}
      />
    </picture>
  );
}

export default OptimizedImage;
