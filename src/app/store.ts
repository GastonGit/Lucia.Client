import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../features/search/search-slice';
import settingsReducter from '../features/settings/settings-slice';

export const store = configureStore({
    reducer: {
        search: searchReducer,
        settings: settingsReducter,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
