import React, { useEffect, useRef, useState } from 'react';
import '../styles/Read.css';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Divider,
    Fade,
    Grid,
    GridSize,
    Link,
    Stack,
    Typography,
} from '@mui/material';
import { useAppSelector } from '../app/hooks';
import StyledTooltip from '../subcomponents/StyledTooltip';
import ImageListItem from '@mui/material/ImageListItem';

export default function Read(): JSX.Element | null {
    const navigate = useNavigate();
    const [error, setError] = useState<TypeError | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mangaInfo, setMangaInfo] = useState({
        author: '',
        title: '',
        images: [],
        tags: [],
    });
    const [mangaThumbnails, setMangaThumbnails] = useState([]);
    const [readInformation, setReadInformation] = useState({
        index: -1,
        mainCols: -1,
        currentImagePath: '',
        prevLink: '',
        prevOpacity: '',
        prevIndex: -1,
        nextLink: '',
        nextOpacity: '',
        nextIndex: -1,
    });
    const preloadCount = useAppSelector((state) => state.settings.preloadCount);
    const [currentImage, setCurrentImage] = useState(<div />);
    const myRef = useRef<HTMLDivElement>(null);

    const api = process.env.REACT_APP_API_SERVER || '';
    const pathname = useLocation().pathname;
    const id = pathname.substring(pathname.indexOf('/') + 1);

    useEffect(() => {
        fetch(api + '/manga?id=' + id)
            .then((res) => res.json())
            .then(
                (result) => {
                    if (result.length !== 0) {
                        setMangaInfo({
                            author: result[0].author,
                            title: result[0].title,
                            images: result[0].images,
                            tags: result[0].tags,
                        });
                        setMangaThumbnails(result[0].thumbnails);
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
    }, [currentImage]);

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

    useEffect(() => {
        const blurFilter = 'blur(4px)';
        if (readInformation.mainCols !== -1) {
            setCurrentImage(
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
                            opacity: readInformation.prevOpacity,
                        }}
                        component="button"
                        onClick={() => {
                            onImageClick(
                                readInformation.prevIndex,
                                readInformation.mainCols,
                            );
                        }}
                        className={
                            readInformation.mainCols === 1
                                ? 'side__page-normal'
                                : 'side__page-zoom'
                        }
                    >
                        <img
                            src={readInformation.prevLink}
                            alt={'Former page'}
                            className={
                                readInformation.mainCols === 1
                                    ? 'side__image-normal'
                                    : 'side__image-zoom side__image-left'
                            }
                        />
                    </Link>
                    <Link
                        component="button"
                        onClick={() => {
                            onImageClick(
                                readInformation.index,
                                readInformation.mainCols === 1 ? 3 : 1,
                            );
                        }}
                        className={
                            readInformation.mainCols === 1
                                ? 'main__page-normal'
                                : 'main__page-zoom'
                        }
                    >
                        <img
                            src={readInformation.currentImagePath}
                            alt={'Currently viewed page'}
                            className={
                                readInformation.mainCols === 1
                                    ? 'main__image-normal'
                                    : 'main__image-zoom'
                            }
                        />
                    </Link>
                    <Link
                        sx={{
                            filter: blurFilter,
                            opacity: readInformation.nextOpacity,
                        }}
                        component="button"
                        onClick={() => {
                            onImageClick(
                                readInformation.nextIndex,
                                readInformation.mainCols,
                            );
                        }}
                        className={
                            readInformation.mainCols === 1
                                ? 'side__page-normal'
                                : 'side__page-zoom'
                        }
                    >
                        <img
                            src={readInformation.nextLink}
                            alt={'Next page'}
                            className={
                                readInformation.mainCols === 1
                                    ? 'side__image-normal'
                                    : 'side__image-zoom  side__image-right'
                            }
                        />
                    </Link>
                </Stack>,
            );
            centerView();
        }
    }, [readInformation]);

    function onImageClick(index: number, mainCols: number) {
        const currentImagePath = mangaInfo.images[index];
        const updatedThumbnails = [...mangaThumbnails];
        updatedThumbnails[index] = currentImagePath;

        const opacity = '0.25';

        let prevLink = mangaThumbnails[index];
        let prevIndex;
        let prevOpacity = '0';

        let nextLink = mangaThumbnails[index];
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

        setMangaThumbnails(updatedThumbnails);
        setReadInformation({
            index: index,
            mainCols: mainCols,
            currentImagePath: currentImagePath,
            prevLink: prevLink,
            prevOpacity: prevOpacity,
            prevIndex: prevIndex,
            nextLink: nextLink,
            nextOpacity: nextOpacity,
            nextIndex: nextIndex,
        });
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
                            width: 850,
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
                            minWidth: (1700 / 1920) * 100 + '%',
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
                                <Grid item xs={14 as GridSize} sm={5} md={4}>
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
