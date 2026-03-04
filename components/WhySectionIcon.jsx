'use client';

import React from 'react';

const viewBox = '0 0 48 48';
const stroke = 'var(--why-icon-stroke, #44403c)';
const fill = 'var(--why-icon-fill, #e8e4dc)';
const bird = 'var(--why-icon-bird, #374151)';
const plaster = 'var(--why-icon-plaster, #d4d0c8)';

const icons = {
  /* Dvije figure — za "Samo za žene" */
  'why-users': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <ellipse fill={fill} stroke={stroke} strokeWidth="1.4" cx="18" cy="18" rx="6" ry="7" />
      <path fill={fill} stroke={stroke} strokeWidth="1.4" d="M12 38v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4" />
      <ellipse fill={fill} stroke={stroke} strokeWidth="1.4" cx="32" cy="17" rx="5" ry="6" />
      <path fill={fill} stroke={stroke} strokeWidth="1.4" d="M27 36v-3a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3" />
    </svg>
  ),
  /* Dva ruksaka — za "Profesionalno vođenje" */
  'why-backpack': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path fill={fill} stroke={stroke} strokeWidth="1.4" d="M12 22v-5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14H12V22z" />
      <path fill="none" stroke={stroke} strokeWidth="1.4" d="M18 17v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
      <path fill={fill} stroke={stroke} strokeWidth="1.4" d="M26 20v-4a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v12h8V20z" />
      <path fill="none" stroke={stroke} strokeWidth="1.4" d="M28 20v-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v10h-4" />
    </svg>
  ),
  /* Kuća/envelope + ptica — za "Autentična BiH" */
  'why-nature': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path fill={fill} stroke={stroke} strokeWidth="1.4" d="M24 10L6 24v14h36V24L24 10z" />
      <path fill="none" stroke={stroke} strokeWidth="1.4" d="M6 24l18-14 18 14" />
      <path fill={bird} stroke={stroke} strokeWidth="1" d="M22 30a4 4 0 0 1 4-4 4 4 0 0 1 4 4c0 2-1.5 3.5-2.5 4-1-.5-2.5-2-2.5-4z" />
      <path fill={bird} stroke={stroke} strokeWidth="1" d="M24 28v-2M22 27l-1 1.5M26 27l1 1.5" />
    </svg>
  ),
  /* Srce + flaster — za "Više od ture" */
  'why-care': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="none" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path fill={fill} stroke={stroke} strokeWidth="1.4" d="M24 36.5C14 28 8 22 8 15a6.5 6.5 0 0 1 11-4.7A6.5 6.5 0 0 1 40 15c0 7-6 13-16 21.5z" />
      <path fill={plaster} stroke={stroke} strokeWidth="1.2" d="M27 14l7 7-9 9-7-7 9-9z" />
      <rect x="25.5" y="12.5" width="6" height="2" rx="0.6" fill={stroke} />
      <rect x="25.5" y="28.5" width="6" height="2" rx="0.6" fill={stroke} />
    </svg>
  ),
};

export function WhySectionIcon({ name, size = 48, className = '' }) {
  const icon = icons[name];
  if (!icon) return null;
  return (
    <span
      className={`inline-block shrink-0 [&>svg]:w-full [&>svg]:h-full drop-shadow-sm ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {icon}
    </span>
  );
}

export default WhySectionIcon;
