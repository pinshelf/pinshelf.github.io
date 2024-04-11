import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import {
    ARROW_DOWN,
    ARROW_UP,
    ENTER,
    ESCAPE,
    evaluateNavigationKey, focusSearchInput,
    isInputKey,
    isNavigationKey,
    type KeyboardNavigationActions, SEARCH_INPUT_ID,
} from '$lib/components/custom/search/keyboardNavigation';

describe('keyboardNavigation', () => {
    const expectedNavigationKeys = [ARROW_DOWN, ARROW_UP, ENTER, ESCAPE];

    it.each(expectedNavigationKeys)(
        'should identifier %s as navigation key',
        key => {
            expect(isNavigationKey(key)).toBe(true);
        }
    );

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const numbers = '1234567890'.split('');
    const umlaute = 'äöüÄÖÜß'.split('');
    const expectedInputKeys = alphabet
        .concat(alphabet.map(it => it.toUpperCase()))
        .concat(numbers)
        .concat(umlaute);

    it.each(expectedInputKeys)('should identifier %s as input key', key => {
        expect(isInputKey(key)).toBe(true);
    });

    it("should NOT identifier 'bd' as input key, because of length", () => {
        expect(isInputKey('bd')).toBe(false);
    });

    describe('evaluation', () => {
        const fakeHandler: KeyboardNavigationActions = {
            handleDown: vi.fn(),
            handleUp: vi.fn(),
            handleEnter: vi.fn(),
            handleEscape: vi.fn(),
        };

        beforeEach(() => {
            vi.resetAllMocks();
        });

        describe('arrow down', () => {
            const key = ARROW_DOWN;
            it('should identifier arrow down press correctly', () => {
                evaluateNavigationKey(key, 1, 2, fakeHandler);
                expect(fakeHandler.handleDown).toBeCalled();
            });

            it('should NOT identifier arrow down press when, activeIndex equals maxIndex ', () => {
                evaluateNavigationKey(key, 2, 2, fakeHandler);
                expect(fakeHandler.handleDown).toBeCalledTimes(0);
            });
        });

        describe('arrow up', () => {
            const key = ARROW_UP;
            it('should identifier arrow up press correctly', () => {
                evaluateNavigationKey(key, 1, 2, fakeHandler);
                expect(fakeHandler.handleUp).toBeCalled();
            });

            it('should NOT identifier arrow up press when, activeIndex equals 0', () => {
                evaluateNavigationKey(key, 0, 2, fakeHandler);
                expect(fakeHandler.handleUp).toBeCalledTimes(0);
            });
        });

        describe('enter', () => {
            const key = ENTER;
            it('should identifier enter press correctly', () => {
                evaluateNavigationKey(key, 1, 2, fakeHandler);
                expect(fakeHandler.handleEnter).toBeCalled();
            });

            it('should NOT identifier enter press when, activeIndex is -1 ', () => {
                evaluateNavigationKey(key, -1, 2, fakeHandler);
                expect(fakeHandler.handleEnter).toBeCalledTimes(0);
            });
        });

        it('should identifier escape press correctly', () => {
            evaluateNavigationKey(ESCAPE, 1, 2, fakeHandler);
            expect(fakeHandler.handleEscape).toBeCalled();
        });
    });

    describe('focus handling', () => {
        vi.stubGlobal('document', {
            getElementById: vi.fn()
        })

        it('should focus element when present', () => {
            const elementMock = {
                focus: vi.fn()
            };
            (document.getElementById as Mock).mockReturnValue(elementMock);
            focusSearchInput()
            expect(document.getElementById).toBeCalledWith(SEARCH_INPUT_ID)
            expect(elementMock.focus).toBeCalled()
        });

        it('does not throw if there is not input', () => {
            (document.getElementById as Mock).mockReturnValue(null);
            focusSearchInput()
            expect(document.getElementById).toBeCalledWith(SEARCH_INPUT_ID)
        });
    })
});
