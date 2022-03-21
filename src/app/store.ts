import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../features/search/search-slice';
import settingsReducer from '../features/settings/settings-slice';
import readingReducer from '../features/reading';

export const store = configureStore({
    reducer: {
        search: searchReducer,
        settings: settingsReducer,
        reading: readingReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
