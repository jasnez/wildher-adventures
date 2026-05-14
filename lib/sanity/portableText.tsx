import React from 'react';
import { PortableText, type PortableTextBlock } from '@portabletext/react';

type Locale = 'bs' | 'en';

export function localiseRichText(
  value: { bs?: unknown; en?: unknown } | null | undefined,
  locale: Locale
): PortableTextBlock[] | null {
  if (!value) return null;
  const picked =
    (locale === 'en' && Array.isArray(value.en) ? value.en : value.bs) || null;
  return Array.isArray(picked) ? (picked as PortableTextBlock[]) : null;
}

export function RichText({
  value,
  className,
}: {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className={className}>
      <PortableText value={value} />
    </div>
  );
}
