import type { ReactNode } from 'react';
import styles from './StateMessage.module.css';

interface StateMessageProps {
    title: string;
    children?: ReactNode;
    actions?: ReactNode;
    /** Errors are announced to screen readers as soon as they appear. */
    tone?: 'neutral' | 'error';
}

/** Full-width message for empty, error and signed-out states. */
export function StateMessage({ title, children, actions, tone = 'neutral' }: StateMessageProps) {
    return (
        <div className={styles.message} role={tone === 'error' ? 'alert' : 'status'}>
            <h2 className={styles.title}>{title}</h2>
            {children ? <div className={styles.body}>{children}</div> : null}
            {actions ? <div className={styles.actions}>{actions}</div> : null}
        </div>
    );
}
