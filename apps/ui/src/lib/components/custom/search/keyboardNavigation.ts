export const SEARCH_INPUT_ID = 'search-input';

export const ARROW_DOWN = 'ArrowDown';
export const ARROW_UP = 'ArrowUp';
export const ENTER = 'Enter';
export const ESCAPE = 'Escape';


export function isNavigationKey(key: string): boolean {
    return (
        key === ARROW_DOWN ||
        key === ARROW_UP ||
        key === ENTER ||
        key === ESCAPE
    );
}

export function isInputKey(key: string): boolean {
    return RegExp("^[a-zA-Z0-9äöüÄÖÜß]$").test(key)
}

export function focusSearchInput() {
    const input: HTMLElement | null = document.getElementById(SEARCH_INPUT_ID);
    if (input === null) return
    input.focus();
}

export const ACTIVE_CLASS = 'bg-zinc-800';

export interface KeyboardNavigationActions {
    handleDown: () => void;
    handleUp: () => void;
    handleEnter: () => void;
    handleEscape: () => void;
}

export function evaluateNavigationKey(
    key: string,
    activeIndex: number,
    maxIndex: number,
    { handleDown, handleUp, handleEnter, handleEscape }: KeyboardNavigationActions,
) {
    switch (key) {
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
            handleEscape();
            break;
        }
    }
}
