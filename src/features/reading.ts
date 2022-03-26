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
        currentImagePath: string;
        prevLink: string;
        prevOpacity: string;
        prevIndex: number;
        nextLink: string;
        nextOpacity: string;
        nextIndex: number;
    };
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
        currentImagePath: '',
        prevLink: '',
        prevOpacity: '',
        prevIndex: -1,
        nextLink: '',
        nextOpacity: '',
        nextIndex: -1,
    },
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
                currentImagePath: string;
                prevLink: string;
                prevOpacity: string;
                prevIndex: number;
                nextLink: string;
                nextOpacity: string;
                nextIndex: number;
            }>,
        ) {
            state.readInfo = action.payload;
        },
    },
});

export const { setMangaInfo, setReadInfo } = readingSlice.actions;
export default readingSlice.reducer;
