import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setMangaThumbnails, setReadInfo } from '../features/reading';
import { Link, Stack, Typography } from '@mui/material';

export default function Read(): JSX.Element {
    const dispatch = useAppDispatch();
    const mangaInfo = useAppSelector((state) => state.reading.mangaInfo);
    const readInfo = useAppSelector((state) => state.reading.readInfo);
    const mangaThumbnails = useAppSelector(
        (state) => state.reading.mangaThumbnails,
    );
    const currentPageIndex = useAppSelector(
        (state) => state.reading.currentPageIndex,
    );
    const preloadCount = useAppSelector((state) => state.settings.preloadCount);

    const [initLoadComplete, setInitLoadComplete] = useState(false);

    const blurFilter = 'blur(4px)';

    useEffect(() => {
        updatePage(currentPageIndex, 1);
    }, [currentPageIndex]);

    function updatePage(index: number, mainCols: number) {
        const updatedThumbnails = [...mangaThumbnails] as string[];
        updatedThumbnails[index] = mangaInfo.images[index];

        const opacity = '0.25';

        let prevIndex;
        let prevOpacity = '0';

        let nextIndex;
        let nextOpacity = '0';

        if (index <= 0) {
            prevIndex = mangaThumbnails.length - 1;
        } else {
            prevIndex = index - 1;
            prevOpacity = opacity;
        }

        if (preloadCount.previous > 0) {
            for (let i = 0; i < preloadCount.previous; i++) {
                if (i === 0) {
                    updatedThumbnails[prevIndex] = mangaInfo.images[prevIndex];
                } else if (prevIndex - i >= 0) {
                    updatedThumbnails[prevIndex - i] =
                        mangaInfo.images[prevIndex - i];
                } else {
                    break;
                }
            }
        }

        if (index + 1 === mangaInfo.images.length) {
            nextIndex = 0;
        } else {
            nextIndex = index + 1;
            nextOpacity = opacity;
        }

        if (preloadCount.next > 0) {
            for (let i = 0; i < preloadCount.next; i++) {
                if (i === 0) {
                    updatedThumbnails[nextIndex] = mangaInfo.images[nextIndex];
                } else if (nextIndex + i < mangaInfo.images.length) {
                    updatedThumbnails[nextIndex + i] =
                        mangaInfo.images[nextIndex + i];
                } else {
                    break;
                }
            }
        }

        dispatch(setMangaThumbnails(updatedThumbnails));
        dispatch(
            setReadInfo({
                index: index,
                mainCols: mainCols,
                prevOpacity: prevOpacity,
                prevIndex: prevIndex,
                nextOpacity: nextOpacity,
                nextIndex: nextIndex,
            }),
        );

        if (!initLoadComplete) {
            const img = new Image();
            img.onload = () => {
                setInitLoadComplete(true);
            };
            img.src = mangaInfo.images[index];
        }
    }

    return (
        <Stack direction="column">
            <Stack
                sx={{
                    width: 1890,
                    minHeight: 926,
                    borderStyle: 'solid',
                    borderWidth: '5px',
                    borderColor: 'var(--quaternary--bg-color)',
                    backgroundColor: 'var(--quaternary--bg-color)',
                    overflow: 'hidden',
                }}
                direction="row"
                justifyContent="space-around"
                alignItems="stretch"
                spacing={0.5}
            >
                <Link
                    sx={{
                        filter: blurFilter,
                        opacity: readInfo.prevOpacity,
                    }}
                    component="button"
                    onClick={() => {
                        updatePage(readInfo.prevIndex, readInfo.mainCols);
                    }}
                    className={
                        readInfo.mainCols === 1
                            ? 'side__page-normal'
                            : 'side__page-zoom'
                    }
                >
                    {initLoadComplete && (
                        <img
                            src={mangaThumbnails[readInfo.prevIndex]}
                            alt={'Former page'}
                            className={
                                readInfo.mainCols === 1
                                    ? 'side__image-normal'
                                    : 'side__image-zoom side__image-left'
                            }
                        />
                    )}
                </Link>
                <Link
                    component="button"
                    onClick={() => {
                        updatePage(
                            readInfo.index,
                            readInfo.mainCols === 1 ? 3 : 1,
                        );
                    }}
                    className={
                        readInfo.mainCols === 1
                            ? 'main__page-normal'
                            : 'main__page-zoom'
                    }
                >
                    {initLoadComplete && (
                        <img
                            src={mangaInfo.images[readInfo.index]}
                            alt={'Currently viewed page'}
                            className={
                                readInfo.mainCols === 1
                                    ? 'main__image-normal'
                                    : 'main__image-zoom'
                            }
                        />
                    )}
                </Link>
                <Link
                    sx={{
                        filter: blurFilter,
                        opacity: readInfo.nextOpacity,
                    }}
                    component="button"
                    onClick={() => {
                        updatePage(readInfo.nextIndex, readInfo.mainCols);
                    }}
                    className={
                        readInfo.mainCols === 1
                            ? 'side__page-normal'
                            : 'side__page-zoom'
                    }
                >
                    {initLoadComplete && (
                        <img
                            src={mangaThumbnails[readInfo.nextIndex]}
                            alt={'Next page'}
                            className={
                                readInfo.mainCols === 1
                                    ? 'side__image-normal'
                                    : 'side__image-zoom  side__image-right'
                            }
                        />
                    )}
                </Link>
            </Stack>
            <Stack
                sx={{
                    width: 1890,
                    minHeight: 5,
                    overflow: 'hidden',
                }}
                direction="row"
                justifyContent="space-around"
                alignItems="stretch"
                spacing={0.5}
            >
                <Typography className="page__counter">
                    Page {readInfo.prevIndex + 1}
                </Typography>
                <Typography className="page__counter">
                    Page {readInfo.index + 1}
                </Typography>
                <Typography className="page__counter">
                    Page {readInfo.nextIndex + 1}
                </Typography>
            </Stack>
        </Stack>
    );
}
