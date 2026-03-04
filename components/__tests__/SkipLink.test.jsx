import React from 'react';
import {render, screen} from '@testing-library/react';

import {SkipLink} from '../SkipLink';

describe('SkipLink', () => {
  it('renderuje pristupačan skip link do main sadržaja', () => {
    render(<SkipLink />);

    const link = screen.getByRole('link', {name: /preskoči na sadržaj/i});
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
  });
});

