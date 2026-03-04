import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...p }) => <a href={href} {...p}>{children}</a>,
}));

import { GiftVoucherBanner } from '@/components/tours/GiftVoucherBanner';

describe('GiftVoucherBanner', () => {
  it('displays "Pokloni avanturu" title/CTA', () => {
    render(
      <GiftVoucherBanner
        title="Pokloni avanturu"
        description="Mogućnost kupovine poklon vaučera"
        ctaLabel="Kupi vaučer"
        ctaHref="/poklon-vaucer"
      />
    );
    expect(screen.getByText(/pokloni avanturu/i)).toBeInTheDocument();
  });

  it('renders CTA link with given href', () => {
    render(
      <GiftVoucherBanner
        title="Pokloni avanturu"
        ctaLabel="Kupi vaučer"
        ctaHref="/poklon-vaucer"
      />
    );
    const link = screen.getByRole('link', { name: /kupi vaučer/i });
    expect(link).toHaveAttribute('href', '/poklon-vaucer');
  });
});
