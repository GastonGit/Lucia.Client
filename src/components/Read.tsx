import React, { useEffect, useRef, useState } from 'react';
import '../styles/Gallery.css';
import { useLocation } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import { Fade, Link, Stack, Typography } from '@mui/material';
import StyledTooltip from '../subcomponents/StyledTooltip';
import ImageListItem from '@mui/material/ImageListItem';

export default function Read(): JSX.Element | null {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [manga, setManga] = useState({
        author: '',
        title: '',
        images: [],
        thumbnails: [],
    });
    const [currentImage, setCurrentImage] = useState(<div></div>);
    const myRef = useRef(null);

    const api = process.env.REACT_APP_API_SERVER || '';
    const pathname = useLocation().pathname;
    const id = pathname.substring(pathname.indexOf('/') + 1);

    useEffect(() => {
        fetch(api + '/manga?id=' + id)
            .then((res) => res.json())
            .then(
                (result) => {
                    setManga(result);
                    setIsLoaded(true);
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            myRef.current.scrollIntoView();
        }
    }

    function onImageClick(index: number) {
        const currentImagePath = manga.images[index];
        const blurFilter = 'blur(4px)';
        const opacity = '0.25';

        let backLink;
        let backIndex = index;
        let backOpacity = opacity;

        let forwardLink;
        let forwardIndex = index;
        let forwardOpacity = opacity;

        if (index >= 1) {
            backLink = manga.images[index - 1];
            backIndex = index - 1;
        } else {
            backLink = manga.images[index];
            backOpacity = '0';
        }

        if (index + 2 <= manga.images.length) {
            forwardLink = manga.images[index + 1];
            forwardIndex = index + 1;
        } else {
            forwardLink = manga.images[index];
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
                            src={backLink}
                            alt={'viewed-page'}
                            className="objectFit__contain"
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
                            src={currentImagePath}
                            alt={'viewed-page'}
                            className="objectFit__contain"
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
                            src={forwardLink}
                            alt={'viewed-page'}
                            className="objectFit__contain"
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
                        {manga.title}
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
                        {manga.thumbnails.map((image: string, index) => (
                            <StyledTooltip title={'Page ' + (index + 1)}>
                                <Link
                                    key={index}
                                    component="button"
                                    onClick={() => {
                                        onImageClick(index);
                                    }}
                                    sx={{
                                        backgroundColor:
                                            'var(--quaternary--bg-color)',
                                    }}
                                >
                                    <ImageListItem>
                                        <img
                                            src={image}
                                            alt={'Image for ' + manga.title}
                                            className="objectFit__contain"
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
