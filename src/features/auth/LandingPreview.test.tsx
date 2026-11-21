import { fireEvent, render, screen } from '@testing-library/react';
import { demoTracks } from '@/features/demo/demoSource';
import { LandingPreview } from './LandingPreview';

it('re-ranks the preview when the visitor picks another range', () => {
    render(<LandingPreview />);
    expect(screen.getByText('over the last 4 weeks', { exact: false })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('radio', { name: '6 months' }));

    expect(screen.getByText('over the last 6 months', { exact: false })).toBeInTheDocument();
    const names = [...document.querySelectorAll('[data-flip-id]')].map((row) => row.getAttribute('data-flip-id'));
    expect(names).toEqual(demoTracks('medium_term').slice(1, 6).map((t) => t.id));
});
