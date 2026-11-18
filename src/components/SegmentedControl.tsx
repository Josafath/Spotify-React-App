import { useId } from 'react';
import styles from './SegmentedControl.module.css';

interface Option<T extends string> {
    value: T;
    label: string;
}

interface SegmentedControlProps<T extends string> {
    legend: string;
    options: readonly Option<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

/** A pill switch built on native radio inputs, so arrow keys and screen readers work for free. */
export function SegmentedControl<T extends string>({
    legend,
    options,
    value,
    onChange,
    className,
}: SegmentedControlProps<T>) {
    const name = useId();
    return (
        <fieldset className={[styles.group, className].filter(Boolean).join(' ')}>
            <legend className="sr-only">{legend}</legend>
            {options.map((option) => (
                <label key={option.value} className={styles.option}>
                    <input
                        className={styles.input}
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={option.value === value}
                        onChange={() => onChange(option.value)}
                    />
                    <span className={styles.label}>{option.label}</span>
                </label>
            ))}
        </fieldset>
    );
}
