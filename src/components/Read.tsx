import React, { useEffect, useRef, useState } from 'react';
import '../styles/Read.css';
import { useLocation } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import { Fade, Link, Stack, Typography } from '@mui/material';
import StyledTooltip from '../subcomponents/StyledTooltip';
import ImageListItem from '@mui/material/ImageListItem';

export default function Read(): JSX.Element | null {
    const [error, setError] = useState<TypeError | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mangaInfo, setMangaInfo] = useState({
        author: '',
        title: '',
        images: [],
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

        const prevPreloadCount = 2;
        let prevLink = mangaThumbnails[index];
        let prevIndex = index;
        let prevOpacity = '0';

        const nextPreloadCount = 3;
        let nextLink = mangaThumbnails[index];
        let nextIndex = index;
        let nextOpacity = '0';

        if (index > 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (prevPreloadCount === 0) {
                prevIndex = index - 1;
                prevLink = mangaThumbnails[prevIndex];
                prevOpacity = opacity;
            } else {
                for (let i = 0; i < prevPreloadCount; i++) {
                    if (i === 0) {
                        prevIndex = index - 1;
                        prevLink = mangaInfo.images[prevIndex];
                        prevOpacity = opacity;
                        updatedThumbnails[prevIndex] =
                            mangaInfo.images[prevIndex];
                    } else if (prevIndex - i >= 0) {
                        updatedThumbnails[prevIndex - i] =
                            mangaInfo.images[prevIndex - i];
                    } else {
                        break;
                    }
                }
            }
        } else if (index === 0) {
            prevIndex = mangaThumbnails.length - 1;
            prevLink = mangaThumbnails[prevIndex];
            prevOpacity = '0';
        }

        if (index + 1 < mangaInfo.images.length) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (nextPreloadCount === 0) {
                nextIndex = index + 1;
                nextLink = mangaThumbnails[nextIndex];
                nextOpacity = opacity;
            } else {
                for (let i = 0; i < nextPreloadCount; i++) {
                    if (i === 0) {
                        nextIndex = index + 1;
                        nextLink = mangaInfo.images[nextIndex];
                        nextOpacity = opacity;
                        updatedThumbnails[nextIndex] =
                            mangaInfo.images[nextIndex];
                    } else if (nextIndex + i < mangaInfo.images.length) {
                        updatedThumbnails[nextIndex + i] =
                            mangaInfo.images[nextIndex + i];
                    } else {
                        break;
                    }
                }
            }
        } else if (index + 1 === mangaInfo.images.length) {
            nextIndex = 0;
            nextLink = mangaThumbnails[nextIndex];
            nextOpacity = '0';
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
                    <Typography variant="h2" color="var(--main-text-color)">
                        {mangaInfo.title}
                    </Typography>
                    <div ref={myRef}>{currentImage}</div>
                    <ImageList
                        sx={{
                            width: 1700,
                            borderStyle: 'solid',
                            borderWidth: '5px',
                            borderColor: 'var(--quinary--bg-color)',
                            backgroundColor: 'var(--quinary--bg-color)',
                        }}
                        cols={7}
                        rowHeight={380}
                        gap={6}
                    >
                        {mangaThumbnails.map((image: string, index) => (
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
                                        backgroundColor:
                                            'var(--quaternary--bg-color)',
                                    }}
                                >
                                    <ImageListItem>
                                        <img
                                            src={image}
                                            alt={'Image for ' + mangaInfo.title}
                                            className="gallery__image"
                                        />
                                    </ImageListItem>
                                </Link>
                            </StyledTooltip>
                        ))}
                    </ImageList>
                </Stack>
            </Fade>
        );
    } else {
        return null;
    }
}
