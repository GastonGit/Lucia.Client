import React, { useEffect, useRef, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Overview.css';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
    setMangaInfo,
    setMangaThumbnails,
    setCurrentPageIndex,
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
import Read from '../subcomponents/Read';

export default function Overview(): JSX.Element | null {
    const dispatch = useAppDispatch();
    const mangaInfo = useAppSelector((state) => state.reading.mangaInfo);
    const readInfo = useAppSelector((state) => state.reading.readInfo);
    const mangaThumbnails = useAppSelector(
        (state) => state.reading.mangaThumbnails,
    );

    const [error, setError] = useState<TypeError | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [readActive, setReadActive] = useState(false);

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
        centerView();
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

    function onImageClick(index: number) {
        dispatch(setCurrentPageIndex(index));
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
                    <div ref={myRef}>{readActive && <Read />}</div>
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
                                                onImageClick(index);
                                                if (!readActive) {
                                                    setReadActive(true);
                                                }
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
