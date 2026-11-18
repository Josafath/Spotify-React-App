interface BrandMarkProps {
    size?: number;
    className?: string;
}

/** Jossify's mark: three descending bars, a ranking, on an ember tile. Decorative; pair it with the name. */
export function BrandMark({ size = 28, className }: BrandMarkProps) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 32 32"
            aria-hidden="true"
            focusable="false"
        >
            <rect width="32" height="32" rx="8" fill="var(--color-accent)" />
            <rect x="7" y="8" width="5" height="16" rx="1.5" fill="var(--color-accent-ink)" />
            <rect x="13.5" y="13" width="5" height="11" rx="1.5" fill="var(--color-accent-ink)" />
            <rect x="20" y="17" width="5" height="7" rx="1.5" fill="var(--color-accent-ink)" />
        </svg>
    );
}
