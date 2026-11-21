import styles from './SplitWords.module.css';

/**
 * Renders text as masked words that can rise into view one by one.
 *
 * React renders the split, so animations never rewrite React-owned DOM (unlike SplitText).
 * Screen readers get the sentence once, from the visually hidden copy; the split words
 * are hidden from them. With no animation running, it looks exactly like plain text.
 */
export function SplitWords({ text }: { text: string }) {
    const words = text.split(/\s+/).filter(Boolean);
    return (
        <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {words.map((word, i) => (
                    <span key={i}>
                        <span className={styles.mask}>
                            <span className={styles.word}>{word}</span>
                        </span>
                        {i < words.length - 1 ? ' ' : null}
                    </span>
                ))}
            </span>
        </>
    );
}
