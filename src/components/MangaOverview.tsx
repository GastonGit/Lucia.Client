import React, { useEffect, useRef, useState } from 'react';
import '../styles/Gallery.css';
import { useLocation } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import { Fade, Link, Stack, Typography } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import loadingImage from '../assets/loading.png';

export default function MangaOverview(): JSX.Element {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [manga, setManga] = useState({
        information: {
            author: '',
            bucket: '',
            chapter: 1,
            created_at: '',
            directory: '',
            id: 0,
            series: '',
            thumbnail: '',
            title: '',
            universe: '',
        },
        images: [{ name: '' }],
    });
    const [currentImage, setCurrentImage] = useState(<div></div>);
    const myRef = useRef(null);

    const api = process.env.REACT_APP_API_SERVER || '';
    const location = useLocation();

    useEffect(() => {
        fetch(api + '/manga' + location.pathname)
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setManga(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                },
            );
    }, []);

    useEffect(() => {
        centerView();
    }, [currentImage]);

    function centerView() {
        if (myRef !== null && myRef.current !== null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            myRef.current.scrollIntoView();
        }
    }

    function onImageClick(index: number) {
        const currentImagePath = manga.images[index].name;
        const blurFilter = 'blur(4px)';
        const opacity = '0.25';

        let backLink;
        let backIndex = index;
        let backOpacity = opacity;

        let forwardLink;
        let forwardIndex = index;
        let forwardOpacity = opacity;

        if (index >= 1) {
            backLink = manga.images[index - 1].name;
            backIndex = index - 1;
        } else {
            backLink = manga.images[index].name;
            backOpacity = '0';
        }

        if (index + 2 <= manga.images.length) {
            forwardLink = manga.images[index + 1].name;
            forwardIndex = index + 1;
        } else {
            forwardLink = manga.images[index].name;
            forwardOpacity = '0';
        }

        setCurrentImage(
            <ImageList
                sx={{
                    width: 1890,
                    borderStyle: 'solid',
                    borderWidth: '5px',
                    borderColor: 'var(--quaternary--bg-color)',
                    backgroundColor: 'var(--quaternary--bg-color)',
                }}
                cols={3}
                rowHeight={926}
                gap={6}
            >
                <Link
                    key="backButton"
                    component="button"
                    onClick={() => {
                        onImageClick(backIndex);
                    }}
                >
                    <ImageListItem
                        sx={{ filter: blurFilter, opacity: backOpacity }}
                    >
                        <img
                            src={`${process.env.REACT_APP_API_SERVER}/media/${manga.information.directory}/${manga.information.bucket}/${backLink}`}
                            alt={'viewed-page'}
                        />
                    </ImageListItem>
                </Link>
                <Link
                    key="centerButton"
                    component="button"
                    onClick={centerView}
                >
                    <ImageListItem>
                        <img
                            src={`${process.env.REACT_APP_API_SERVER}/media/${manga.information.directory}/${manga.information.bucket}/${currentImagePath}`}
                            alt={'viewed-page'}
                        />
                    </ImageListItem>
                </Link>
                <Link
                    key="nextButton"
                    component="button"
                    onClick={() => {
                        onImageClick(forwardIndex);
                    }}
                >
                    <ImageListItem
                        sx={{ filter: blurFilter, opacity: forwardOpacity }}
                    >
                        <img
                            src={`${process.env.REACT_APP_API_SERVER}/media/${manga.information.directory}/${manga.information.bucket}/${forwardLink}`}
                            alt={'viewed-page'}
                        />
                    </ImageListItem>
                </Link>
            </ImageList>,
        );
        centerView();
    }

    if (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        const images = [];
        for (let i = 0; i < 21; i++) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            images.push(
                <ImageListItem sx={{ objectFit: 'contain' }} key={i}>
                    <img src={loadingImage} className="objectFit__contain" />
                </ImageListItem>,
            );
        }

        return (
            <Stack
                direction="column"
                alignItems="center"
                spacing={2}
                mt={2}
                mb={2}
            >
                <Typography variant="h2" color="var(--main-text-color)">
                    Loading...
                </Typography>
                <div>{currentImage}</div>
                <ImageList
                    sx={{
                        width: 1700,
                        borderStyle: 'solid',
                        borderWidth: '5px',
                        borderColor: 'var(--quinary--bg-color)',
                        backgroundColor: 'var(--quinary--bg-color)',
                        overflow: 'hidden',
                    }}
                    cols={7}
                    rowHeight={380}
                    gap={6}
                >
                    {images}
                </ImageList>
            </Stack>
        );
    } else {
        return (
            <Stack
                direction="column"
                alignItems="center"
                spacing={2}
                mt={2}
                mb={2}
            >
                <Fade in={true}>
                    <Typography variant="h2" color="var(--main-text-color)">
                        {manga.information.title}
                    </Typography>
                </Fade>
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
                    {manga.images.map((image: { name: string }, index) => (
                        <Link
                            key={index}
                            component="button"
                            onClick={() => {
                                onImageClick(index);
                            }}
                            sx={{
                                backgroundColor: 'var(--quaternary--bg-color)',
                            }}
                        >
                            <Fade in={true}>
                                <div>
                                    <ImageListItem>
                                        <img
                                            src={`${process.env.REACT_APP_API_SERVER}/media/${manga.information.directory}/${manga.information.bucket}/${image.name}`}
                                            alt={
                                                'Image for ' +
                                                manga.information.title
                                            }
                                            className="objectFit__contain"
                                        />
                                    </ImageListItem>
                                </div>
                            </Fade>
                        </Link>
                    ))}
                </ImageList>
            </Stack>
        );
    }
}
