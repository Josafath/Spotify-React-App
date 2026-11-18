import styles from './Button.module.css';

type Variant = 'primary' | 'ghost' | 'quiet';

/** Class names for a button or a link styled as one. */
export function buttonClass(variant: Variant = 'primary', { large = false } = {}): string {
    return [styles.button, styles[variant], large ? styles.large : null].filter(Boolean).join(' ');
}
