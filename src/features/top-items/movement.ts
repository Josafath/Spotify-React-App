export type Movement =
    | { kind: 'up'; places: number }
    | { kind: 'down'; places: number }
    | { kind: 'same' }
    | { kind: 'new' };

/**
 * Compares each item's position in `current` with its position in `previous`.
 * Positions are list indexes, so "up 3" means it ranks three places higher now.
 * Items missing from `previous` are "new" for this range.
 */
export function computeMovement(
    current: readonly { id: string }[],
    previous: readonly { id: string }[],
): Map<string, Movement> {
    const previousRank = new Map(previous.map((item, index) => [item.id, index]));
    const result = new Map<string, Movement>();

    current.forEach((item, index) => {
        const before = previousRank.get(item.id);
        if (before === undefined) result.set(item.id, { kind: 'new' });
        else if (before > index) result.set(item.id, { kind: 'up', places: before - index });
        else if (before < index) result.set(item.id, { kind: 'down', places: index - before });
        else result.set(item.id, { kind: 'same' });
    });

    return result;
}

export function describeMovement(movement: Movement, againstLabel: string): string {
    switch (movement.kind) {
        case 'up':
            return `Up ${movement.places} ${movement.places === 1 ? 'place' : 'places'} compared with ${againstLabel}`;
        case 'down':
            return `Down ${movement.places} ${movement.places === 1 ? 'place' : 'places'} compared with ${againstLabel}`;
        case 'same':
            return `Same position as ${againstLabel}`;
        case 'new':
            return `New, not in your top items for ${againstLabel}`;
    }
}
