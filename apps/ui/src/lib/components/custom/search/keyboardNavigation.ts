export const ARROW_DOWN = 'ArrowDown';
export const ARROW_UP = 'ArrowUp';
export const ENTER = 'Enter';
export const ESCAPE = 'Escape';

export function keyIsOnInterest(event: KeyboardEvent) {
    return (
        event.key === ARROW_DOWN ||
        event.key === ARROW_UP ||
        event.key === ENTER ||
        event.key === ESCAPE
    );
}

export const ACTIVE_CLASS = 'bg-zinc-800';

interface KeyboardActions {
    handleDown: () => void;
    handleUp: () => void;
    handleEnter: () => void;
    handleEscape: () => void;
}

export function evaluateKeypress(
    event: KeyboardEvent,
    activeIndex: number,
    maxIndex: number,
    { handleDown, handleUp, handleEnter, handleEscape }: KeyboardActions
) {
    switch (event.key) {
        case ARROW_DOWN: {
            if (activeIndex < maxIndex) {
                handleDown();
            }
            break;
        }
        case ARROW_UP: {
            if (activeIndex > 0) {
                handleUp();
            }
            break;
        }
        case ENTER: {
            if (activeIndex > -1) {
                handleEnter();
            }
            break;
        }
        case ESCAPE: {
            handleEscape()
            break;
        }
    }
}
