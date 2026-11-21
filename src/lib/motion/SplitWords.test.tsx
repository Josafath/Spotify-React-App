import { render, screen } from '@testing-library/react';
import { SplitWords } from './SplitWords';

it('gives screen readers the sentence once, not word by word', () => {
    render(
        <h1>
            <SplitWords text="Your listening,  ranked." />
        </h1>,
    );
    expect(screen.getByRole('heading', { name: 'Your listening, ranked.' })).toBeInTheDocument();
});

it('renders each word in its own mask, in order', () => {
    const { container } = render(<SplitWords text="Honey & Rust" />);
    const words = [...container.querySelectorAll('[aria-hidden="true"] span span span')].map((w) => w.textContent);
    expect(words).toEqual(['Honey', '&', 'Rust']);
});
