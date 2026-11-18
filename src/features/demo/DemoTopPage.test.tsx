import { fireEvent, screen, within } from '@testing-library/react';
import { renderApp } from '@/test/renderApp';
import { demoArtists, demoTracks } from './demoSource';

it('labels the demo data as fictional', async () => {
    renderApp('/demo');
    expect(await screen.findByRole('note')).toHaveTextContent(/fictional/i);
});

it('offers no playback for fictional songs', async () => {
    renderApp('/demo');
    await screen.findByRole('list', { name: 'Top tracks 2 to 40' });
    expect(screen.queryByRole('button', { name: /^(Play|Pause) / })).not.toBeInTheDocument();
});

it('shows the #1 track as the hero and the rest as a ranked list', async () => {
    const [first, second] = demoTracks('short_term');
    renderApp('/demo');

    expect(await screen.findByRole('heading', { level: 2, name: first!.name })).toBeInTheDocument();
    const list = screen.getByRole('list', { name: 'Top tracks 2 to 40' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(39);
    expect(within(list).getByRole('link', { name: `Number 2: ${second!.name}` })).toBeInTheDocument();
});

it('shows movement compared with the longer range', async () => {
    renderApp('/demo');
    await screen.findByRole('list', { name: 'Top tracks 2 to 40' });
    expect(screen.getAllByTitle(/compared with the last 6 months|not in your top items/).length).toBeGreaterThan(0);
});

it('switches to artists and to another range through the URL', async () => {
    renderApp('/demo');
    await screen.findByRole('list', { name: 'Top tracks 2 to 40' });

    fireEvent.click(screen.getByRole('radio', { name: 'Artists' }));
    fireEvent.click(screen.getByRole('radio', { name: 'All time' }));

    const [topArtist] = demoArtists('long_term');
    expect(await screen.findByRole('heading', { level: 2, name: topArtist!.name })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/demo?type=artists&range=long_term');
    // All time is the longest range, so there is nothing to compare against.
    expect(screen.queryByText(/Arrows compare with/)).not.toBeInTheDocument();
    expect(screen.queryAllByTitle(/compared with|Same position|not in your top items/)).toHaveLength(0);
});

it('does not reuse one range’s data as the comparison for another', async () => {
    // Visit 4 weeks first so long_term data is cached, then switch to All time.
    renderApp('/demo?type=tracks&range=short_term');
    await screen.findByRole('list', { name: 'Top tracks 2 to 40' });
    fireEvent.click(screen.getByRole('radio', { name: 'All time' }));

    const [top] = demoTracks('long_term');
    expect(await screen.findByRole('heading', { level: 2, name: top!.name })).toBeInTheDocument();
    expect(screen.queryAllByTitle(/Same position/)).toHaveLength(0);
});

it('restores the view from a shared link', async () => {
    const [topArtist] = demoArtists('medium_term');
    renderApp('/demo?type=artists&range=medium_term');

    expect(await screen.findByRole('heading', { level: 2, name: topArtist!.name })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '6 months' })).toBeChecked();
});
