import searchMachine from './search-machine';

describe('SearchMachine', () => {
    describe("default state", () => {
        const initialState = 'default';
        test("should reach 'searching' when the 'search' event occurs and search input valid", () => {
            const expectedState = "searching"
            const actualState = searchMachine.transition(initialState, { type: 'SEARCH', query: 'hello'})
            expect(actualState.matches(expectedState)).toBeTruthy();
        });

        test("Should reach 'disabled' when the 'sync' event occurs", () => {
            const expectedState = "disabled"
            const actualState = searchMachine.transition(initialState, { type: 'SYNC'})
            expect(actualState.matches(expectedState)).toBeTruthy();
        });
    });
    describe("disabled state", () => {
        const initialState = 'disabled';
        test("should reach 'default' state when the 'activate' event occurs", () => {
            const expectedState = 'default';
            const actualState = searchMachine.transition(initialState, { type: 'ACTIVATE'})
            expect(actualState.matches(expectedState)).toBeTruthy();
        });
    })
    describe("searching state", () => {
        const initialState = 'searching';
        test("Should reach 'reset' when the 'result' event occurs", () => {
            const expectedState = 'reset';
            const actualState = searchMachine.transition(initialState, { type: 'RESULT'})
            expect(actualState.matches(expectedState)).toBeTruthy();
        });
    });
    describe("reset state", () => {
        const initialState = 'reset';
        test("Should reach the 'default' state when the 'clear' event occurs", () => {
            const expectedState = 'default';
            const actualState = searchMachine.transition(initialState, { type: 'CLEAR'})
            expect(actualState.matches(expectedState)).toBeTruthy();
        });
        test("should reach the 'searching' state when the 'search' event occurs", () => {
            const expectedState = 'searching';
            const actualState = searchMachine.transition(initialState, { type: 'SEARCH'})
            expect(actualState.matches(expectedState)).toBeTruthy();
        });
    });
});