import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { BrandMark } from '@/components/BrandMark';
import { SegmentedControl } from '@/components/SegmentedControl';
import type { TimeRange, TopItemType } from '@/lib/spotify/types';
import { ITEM_TYPES, TIME_RANGES } from '../ranges';
import styles from './TopBar.module.css';

interface TopBarProps {
    type: TopItemType;
    range: TimeRange;
    onTypeChange: (type: TopItemType) => void;
    onRangeChange: (range: TimeRange) => void;
    /** Right side: the signed-in user, or the demo's sign-in prompt. */
    account: ReactNode;
}

export function TopBar({ type, range, onTypeChange, onRangeChange, account }: TopBarProps) {
    return (
        <header className={styles.bar}>
            <div className={styles.inner}>
                <Link to="/" className={styles.brand}>
                    <BrandMark size={28} />
                    <span>Jossify</span>
                </Link>
                <div className={styles.controls}>
                    <SegmentedControl
                        className={styles.type}
                        legend="Show"
                        options={ITEM_TYPES.map((t) => ({ value: t.id, label: t.label }))}
                        value={type}
                        onChange={onTypeChange}
                    />
                    <SegmentedControl
                        className={styles.range}
                        legend="Time range"
                        options={TIME_RANGES.map((r) => ({ value: r.id, label: r.label }))}
                        value={range}
                        onChange={onRangeChange}
                    />
                </div>
                <div className={styles.account}>{account}</div>
            </div>
        </header>
    );
}
