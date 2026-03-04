import React from 'react';
import {render, screen, within} from '@testing-library/react';
import {vi} from 'vitest';

vi.mock('@/i18n/navigation', () => {
  return {
    Link: ({href, children, ...rest}) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

import {HomePopularTours} from '../HomePopularTours';

const mockTours = [
  {
    titleKey: 'tour1Title',
    locationKey: 'tour1Location',
    durationKey: 'tour1Duration',
    difficultyKey: 'tour1Difficulty',
    groupKey: 'tour1Group',
    priceKey: 'tour1Price',
    descKey: 'tour1Desc',
    image: '5',
  },
];

const t = (key) => {
  const map = {
    tour1Title: 'Visočica Summit Hike',
    tour1Location: 'Visočica',
    tour1Duration: '1 dan',
    tour1Difficulty: 'Umjereno',
    tour1Group: 'Do 12',
    tour1Price: '95',
    tour1Desc: 'Jednodnevni uspon na jedan od najljepših vrhova.',
    learnMore: 'Saznaj više',
  };
  return map[key] ?? key;
};

describe('HomePopularTours', () => {
  it('prikazuje istu strukturu sadržaja na prednjoj strani kao i stare kartice', () => {
    render(<HomePopularTours t={t} tours={mockTours} />);

    const cardFront = screen.getByTestId('popular-tour-card-front-0');
    const utils = within(cardFront);

    expect(utils.getByText('Visočica')).toBeInTheDocument();
    expect(utils.getByText('Visočica Summit Hike')).toBeInTheDocument();
    expect(utils.getByText('1 dan')).toBeInTheDocument();
    expect(utils.getByText('Umjereno')).toBeInTheDocument();
    expect(utils.getByText('Do 12')).toBeInTheDocument();
    expect(utils.getByText(/Jednodnevni uspon/)).toBeInTheDocument();
    expect(utils.getByText(/Saznaj više/)).toBeInTheDocument();
  });

  it('ima stražnju stranu sa fokusom na destinaciju i opis ture', () => {
    render(<HomePopularTours t={t} tours={mockTours} />);

    const cardBack = screen.getByTestId('popular-tour-card-back-0');
    const utils = within(cardBack);

    expect(utils.getByText('Visočica')).toBeInTheDocument();
    expect(utils.getByText('Visočica Summit Hike')).toBeInTheDocument();
    expect(utils.getByText(/Jednodnevni uspon/)).toBeInTheDocument();
  });

  it('koristi spor, nježan flip (duža duration na transform animaciji)', () => {
    render(<HomePopularTours t={t} tours={mockTours} />);

    const inner = screen.getByTestId('popular-tour-card-inner-0');
    expect(inner.className).toMatch(/duration-1000/);
  });
});

