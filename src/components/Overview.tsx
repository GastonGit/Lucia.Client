import React, { useEffect, useRef, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Overview.css';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
    setMangaInfo,
    setReadInfo,
    setMangaThumbnails,
    setCurrentImage,
} from '../features/reading';
import {
    Box,
    Divider,
    Fade,
    Grid,
    GridSize,
    Link,
    Stack,
    Typography,
    ImageListItem,
    useMediaQuery,
} from '@mui/material';
import StyledTooltip from '../subcomponents/StyledTooltip';

export default function Overview(): JSX.Element | null {
    const dispatch = useAppDispatch();
    const mangaInfo = useAppSelector((state) => state.reading.mangaInfo);
    const readInfo = useAppSelector((state) => state.reading.readInfo);
    const mangaThumbnails = useAppSelector(
        (state) => state.reading.mangaThumbnails,
    );
    const currentImage = useAppSelector((state) => state.reading.currentImage);
    const preloadCount = useAppSelector((state) => state.settings.preloadCount);

    const [error, setError] = useState<TypeError | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const navigate = useNavigate();
    const myRef = useRef<HTMLDivElement>(null);
    const screenWidthIsAbove1920 = useMediaQuery('(min-width:1920px)', {
        noSsr: true,
    });
    const screenWidthIsUnder600 = useMediaQuery('(max-width:600px)', {
        noSsr: true,
    });

    const api = process.env.REACT_APP_API_SERVER || '';
    const pathname = useLocation().pathname;
    const id = pathname.substring(pathname.indexOf('/') + 1);

    useEffect(() => {
        centerView();
    }, [currentImage]);

    useEffect(() => {
        fetch(api + '/manga?id=' + id)
            .then((res) => res.json())
            .then(
                (result) => {
                    if (result.length !== 0) {
                        dispatch(
                            setMangaInfo({
                                author: result[0].author,
                                title: result[0].title,
                                images: result[0].images,
                                tags: result[0].tags,
                            }),
                        );
                        dispatch(setMangaThumbnails(result[0].thumbnails));
                        dispatch(
                            setReadInfo({
                                index: -1,
                                mainCols: -1,
                                currentImagePath: '',
                                prevLink: '',
                                prevOpacity: '',
                                prevIndex: -1,
                                nextLink: '',
                                nextOpacity: '',
                                nextIndex: -1,
                            }),
                        );
                        dispatch(setCurrentImage(<div />));
                        setIsLoaded(true);
                    }
                },
                (error) => {
                    setError(error);
                    setIsLoaded(true);
                },
            );
    }, []);

    useEffect(() => {
        const blurFilter = 'blur(4px)';
        if (readInfo.mainCols !== -1) {
            if (screenWidthIsUnder600) {
                dispatch(
                    setCurrentImage(
                        <Box
                            sx={{
                                maxWidth: '100vw',
                                overflow: 'hidden',
                                backgroundColor: 'var(--quinary--bg-color)',
                            }}
                        >
                            <Grid container spacing={0.25} columns={28}>
                                {mangaInfo.images.map(
                                    (image: string, index) => (
                                        <Grid item xs={28 as GridSize}>
                                            <StyledTooltip
                                                title={'Page ' + (index + 1)}
                                                key={index}
                                            >
                                                <Link
                                                    component="button"
                                                    onClick={() => {
                                                        onImageClick(index, 1);
                                                    }}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        backgroundColor:
                                                            'var(--quaternary--bg-color)',
                                                    }}
                                                >
                                                    <ImageListItem
                                                        sx={{
                                                            width: '100%',
                                                            height: '100% !important',
                                                        }}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={
                                                                'Image for ' +
                                                                mangaInfo.title
                                                            }
                                                            className="gallery__image"
                                                        />
                                                    </ImageListItem>
                                                </Link>
                                            </StyledTooltip>
                                        </Grid>
                                    ),
                                )}
                            </Grid>
                        </Box>,
                    ),
                );
            } else {
                dispatch(
                    setCurrentImage(
                        <Stack direction="column">
                            <Stack
                                sx={{
                                    width: 1890,
                                    minHeight: 926,
                                    borderStyle: 'solid',
                                    borderWidth: '5px',
                                    borderColor: 'var(--quaternary--bg-color)',
                                    backgroundColor:
                                        'var(--quaternary--bg-color)',
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
                                        onImageClick(
                                            readInfo.prevIndex,
                                            readInfo.mainCols,
                                        );
                                    }}
                                    className={
                                        readInfo.mainCols === 1
                                            ? 'side__page-normal'
                                            : 'side__page-zoom'
                                    }
                                >
                                    <img
                                        src={readInfo.prevLink}
                                        alt={'Former page'}
                                        className={
                                            readInfo.mainCols === 1
                                                ? 'side__image-normal'
                                                : 'side__image-zoom side__image-left'
                                        }
                                    />
                                </Link>
                                <Link
                                    component="button"
                                    onClick={() => {
                                        onImageClick(
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
                                    <img
                                        src={readInfo.currentImagePath}
                                        alt={'Currently viewed page'}
                                        className={
                                            readInfo.mainCols === 1
                                                ? 'main__image-normal'
                                                : 'main__image-zoom'
                                        }
                                    />
                                </Link>
                                <Link
                                    sx={{
                                        filter: blurFilter,
                                        opacity: readInfo.nextOpacity,
                                    }}
                                    component="button"
                                    onClick={() => {
                                        onImageClick(
                                            readInfo.nextIndex,
                                            readInfo.mainCols,
                                        );
                                    }}
                                    className={
                                        readInfo.mainCols === 1
                                            ? 'side__page-normal'
                                            : 'side__page-zoom'
                                    }
                                >
                                    <img
                                        src={readInfo.nextLink}
                                        alt={'Next page'}
                                        className={
                                            readInfo.mainCols === 1
                                                ? 'side__image-normal'
                                                : 'side__image-zoom  side__image-right'
                                        }
                                    />
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
                        </Stack>,
                    ),
                );
            }

            centerView();
        }
    }, [readInfo, screenWidthIsUnder600]);

    function centerView() {
        if (myRef !== null && myRef.current !== null) {
            myRef.current.scrollIntoView();
        }
    }

    function onTagClick(
        event:
            | React.MouseEvent<HTMLSpanElement, MouseEvent>
            | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        tag: string,
    ) {
        event.preventDefault();
        navigate(
            '/?' +
                createSearchParams({
                    ['search']: tag,
                    ['page']: '1',
                }),
        );
    }

    function onImageClick(index: number, mainCols: number) {
        const currentImagePath = mangaInfo.images[index];
        const updatedThumbnails = [...mangaThumbnails] as string[];
        updatedThumbnails[index] = currentImagePath;

        const opacity = '0.25';

        let prevLink = mangaThumbnails[index] as string;
        let prevIndex;
        let prevOpacity = '0';

        let nextLink = mangaThumbnails[index] as string;
        let nextIndex;
        let nextOpacity = '0';

        if (index <= 0) {
            prevIndex = mangaThumbnails.length - 1;
        } else {
            prevIndex = index - 1;
            prevOpacity = opacity;
        }

        if (preloadCount.previous <= 0) {
            prevLink = mangaThumbnails[prevIndex];
        } else {
            for (let i = 0; i < preloadCount.previous; i++) {
                if (i === 0) {
                    prevLink = mangaInfo.images[prevIndex];
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

        if (preloadCount.next <= 0) {
            nextLink = mangaThumbnails[nextIndex];
        } else {
            for (let i = 0; i < preloadCount.next; i++) {
                if (i === 0) {
                    nextLink = mangaInfo.images[nextIndex];
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
                currentImagePath: currentImagePath,
                prevLink: prevLink,
                prevOpacity: prevOpacity,
                prevIndex: prevIndex,
                nextLink: nextLink,
                nextOpacity: nextOpacity,
                nextIndex: nextIndex,
            }),
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (isLoaded) {
        return (
            <Fade in={true} timeout={500}>
                <Stack
                    direction="column"
                    alignItems="center"
                    spacing={2}
                    mt={2}
                    mb={2}
                >
                    <Grid
                        container
                        sx={{
                            maxWidth: 850,
                            minWidth: screenWidthIsAbove1920
                                ? 850
                                : (850 / 1920) * 100 + '%',
                            borderStyle: 'solid',
                            borderWidth: '5px',
                            borderColor: 'var(--quaternary--bg-color)',
                            backgroundColor: 'var(--quaternary--bg-color)',
                        }}
                    >
                        <Grid item xs={12}>
                            <Typography
                                align="center"
                                variant="h2"
                                color="var(--main-text-color)"
                            >
                                {mangaInfo.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack
                                sx={{
                                    height: '100%',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    justifyContent: 'flex-start',
                                }}
                                spacing={1}
                                direction="row"
                            >
                                <Typography
                                    align="left"
                                    variant="h4"
                                    color="var(--main-text-color)"
                                >
                                    Tags:
                                </Typography>
                                <Stack
                                    direction="row"
                                    divider={
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                        />
                                    }
                                    spacing={1}
                                    sx={{
                                        height: '100%',
                                        alignItems: 'center',
                                        alignContent: 'center',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    {mangaInfo.tags.map(
                                        (tag: string, index) => (
                                            <Link
                                                href={
                                                    '/?search=' +
                                                    tag.toLowerCase() +
                                                    '&page=1'
                                                }
                                                onClick={(event) => {
                                                    onTagClick(
                                                        event,
                                                        tag.toLowerCase(),
                                                    );
                                                }}
                                                underline="none"
                                                sx={{
                                                    backgroundColor:
                                                        'var(--quaternary--bg-color)',
                                                }}
                                            >
                                                <Typography
                                                    key={index}
                                                    variant="h5"
                                                    color="var(--main-text-color)"
                                                >
                                                    {tag}
                                                </Typography>
                                            </Link>
                                        ),
                                    )}
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                    <div ref={myRef}>{currentImage}</div>
                    <Box
                        sx={{
                            maxWidth: 1700,
                            minWidth: screenWidthIsAbove1920
                                ? 1700
                                : (1700 / 1920) * 100 + '%',
                            overflow: 'hidden',
                            borderStyle: 'solid',
                            borderRadius: '25px',
                            borderWidth: '5px',
                            borderColor: 'var(--quinary--bg-color)',
                            backgroundColor: 'var(--quinary--bg-color)',
                        }}
                    >
                        <Grid container spacing={1} columns={28}>
                            {mangaThumbnails.map((image: string, index) => (
                                <Grid
                                    item
                                    xs={14 as GridSize}
                                    sm={7}
                                    md={4}
                                    key={index}
                                >
                                    <StyledTooltip
                                        title={'Page ' + (index + 1)}
                                    >
                                        <Link
                                            component="button"
                                            onClick={() => {
                                                onImageClick(index, 1);
                                            }}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor:
                                                    'var(--quaternary--bg-color)',
                                            }}
                                        >
                                            <ImageListItem
                                                sx={{
                                                    width: '100%',
                                                    height: '100% !important',
                                                }}
                                            >
                                                <img
                                                    src={image}
                                                    alt={
                                                        'Image for ' +
                                                        mangaInfo.title
                                                    }
                                                    className="gallery__image"
                                                />
                                            </ImageListItem>
                                        </Link>
                                    </StyledTooltip>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Stack>
            </Fade>
        );
    } else {
        return null;
    }
}
