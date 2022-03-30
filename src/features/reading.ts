import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReadingState {
    mangaInfo: {
        author: string;
        title: string;
        images: string[];
        tags: string[];
    };
    readInfo: {
        index: number;
        mainCols: number;
        prevOpacity: string;
        prevIndex: number;
        nextOpacity: string;
        nextIndex: number;
    };
    currentPageIndex: number;
    mangaThumbnails: string[];
}

const initialState: ReadingState = {
    mangaInfo: {
        author: '',
        title: '',
        images: [],
        tags: [],
    },
    readInfo: {
        index: -1,
        mainCols: -1,
        prevOpacity: '',
        prevIndex: -1,
        nextOpacity: '',
        nextIndex: -1,
    },
    currentPageIndex: 0,
    mangaThumbnails: [],
};

const readingSlice = createSlice({
    name: 'reading',
    initialState,
    reducers: {
        setMangaInfo(
            state,
            action: PayloadAction<{
                author: string;
                title: string;
                images: string[];
                tags: string[];
            }>,
        ) {
            state.mangaInfo = action.payload;
        },
        setReadInfo(
            state,
            action: PayloadAction<{
                index: number;
                mainCols: number;
                prevOpacity: string;
                prevIndex: number;
                nextOpacity: string;
                nextIndex: number;
            }>,
        ) {
            state.readInfo = action.payload;
        },
        setMangaThumbnails(state, action: PayloadAction<string[]>) {
            state.mangaThumbnails = action.payload;
        },
        setCurrentPageIndex(state, action: PayloadAction<number>) {
            state.currentPageIndex = action.payload;
        },
    },
});

export const {
    setMangaInfo,
    setReadInfo,
    setMangaThumbnails,
    setCurrentPageIndex,
} = readingSlice.actions;
export default readingSlice.reducer;
