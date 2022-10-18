export const loadState = (state) => {
    try {
        const serializedState = localStorage.getItem(state);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state, data) => {
    try {
        const serializedState = JSON.stringify(data);
        localStorage.setItem(state, serializedState);
    } catch (err) {
        // Ignore write errors.
    }
};

export const resetState = (state) => {
    try {
        localStorage.removeItem(state);
    } catch (err) {
        // Ignore write errors.
    }
};