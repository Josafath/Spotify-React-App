import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router';
import { App } from '@/app/App';

/** Exposes the current URL so tests can assert on navigation. */
function LocationProbe() {
    const location = useLocation();
    return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
}

export function renderApp(route: string) {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter initialEntries={[route]}>
                <App />
                <LocationProbe />
            </MemoryRouter>
        </QueryClientProvider>,
    );
}
