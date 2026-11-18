import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { describeMovement, type Movement } from '../movement';
import styles from './MovementBadge.module.css';

interface MovementBadgeProps {
    movement: Movement | undefined;
    /** e.g. "the last 6 months" */
    againstLabel: string;
}

export function MovementBadge({ movement, againstLabel }: MovementBadgeProps) {
    if (!movement) return <span className={styles.badge} aria-hidden="true" />;
    const label = describeMovement(movement, againstLabel);

    return (
        <span className={`${styles.badge} ${styles[movement.kind]}`} title={label}>
            <span className="sr-only">{label}</span>
            <span aria-hidden="true" className={styles.visual}>
                {movement.kind === 'up' ? (
                    <>
                        <ArrowUp size={14} strokeWidth={2.5} />
                        <span className="tabular">{movement.places}</span>
                    </>
                ) : movement.kind === 'down' ? (
                    <>
                        <ArrowDown size={14} strokeWidth={2.5} />
                        <span className="tabular">{movement.places}</span>
                    </>
                ) : movement.kind === 'new' ? (
                    'New'
                ) : (
                    <Minus size={14} strokeWidth={2.5} />
                )}
            </span>
        </span>
    );
}
