import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
    preloadCount: { next: number; previous: number };
}

const initialState: SettingsState = {
    preloadCount: { next: 3, previous: 2 },
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setPreloadCount(
            state,
            action: PayloadAction<{ next: number; previous: number }>,
        ) {
            state.preloadCount.next = action.payload.next;
            state.preloadCount.previous = action.payload.previous;
        },
    },
});

export const { setPreloadCount } = settingsSlice.actions;
export default settingsSlice.reducer;
