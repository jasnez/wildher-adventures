import React from 'react';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {vi} from 'vitest';

vi.mock('next-intl', () => {
  return {
    useTranslations: (ns) => {
      const footer = {
        tagline: 'Ženski avanturistički brend u BiH',
        newsletter: 'Newsletter',
        newsletterDesc: 'Prijavi se za vijesti i najave tura.',
        submit: 'Prijavi se',
        thanks: 'Hvala! Prijavljeni ste na vijesti.',
        faq: 'FAQ',
        privacy: 'Privatnost',
        terms: 'Uslovi korištenja',
      };
      const nav = {
        tours: 'Ture',
        destinations: 'Destinacije',
        about: 'O nama',
        blog: 'Blog',
        gallery: 'Galerija',
        contact: 'Kontakt',
      };
      return (key) => {
        if (ns === 'footer') return footer[key] ?? key;
        if (ns === 'nav') return nav[key] ?? key;
        return key;
      };
    },
  };
});

vi.mock('@/i18n/navigation', () => {
  return {
    Link: ({href, children, ...rest}) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

vi.mock('next/image', () => ({
  default: (props) => <img {...props} />,
}));

import {Footer} from '../Footer';

describe('Footer', () => {
  it('prikazuje logo, glavnu navigaciju i pravne linkove', () => {
    render(<Footer />);

    const logo = screen.getByRole('link', {name: /wildher adventures/i});
    expect(logo).toBeInTheDocument();

    const nav = screen.getByRole('navigation', {name: /footer/i});
    expect(
      within(nav).getByRole('link', {
        name: /ture/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole('link', {
        name: /destinacije/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole('link', {
        name: /o nama/i,
      }),
    ).toBeInTheDocument();

    const faq = screen.getByRole('link', {name: /faq/i});
    const privacy = screen.getByRole('link', {name: /privatnost/i});
    const terms = screen.getByRole('link', {name: /uslovi korištenja/i});

    expect(faq).toBeInTheDocument();
    expect(privacy).toBeInTheDocument();
    expect(terms).toBeInTheDocument();
  });

  it('ima newsletter formu koja prikazuje poruku zahvalnosti nakon submit-a', async () => {
    const user = userEvent.setup();
    render(<Footer />);

    const input = screen.getByPlaceholderText(/@/i);
    const button = screen.getByRole('button', {name: /prijavi se/i});

    await user.type(input, 'test@example.com');
    await user.click(button);

    const thanks = await screen.findByText(/prijavljeni ste na vijesti/i);
    expect(thanks).toBeInTheDocument();
  });

  it('prikazuje social linkove sa aria-label atributima', () => {
    render(<Footer />);

    const instagram = screen.getByRole('link', {name: /instagram/i});
    const facebook = screen.getByRole('link', {name: /facebook/i});

    expect(instagram).toBeInTheDocument();
    expect(facebook).toBeInTheDocument();
  });
});

