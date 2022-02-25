import React, { useEffect, useState } from 'react';
import '../styles/Gallery.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Stack, Link, Fade, Pagination } from '@mui/material';
import loadingImage from '../assets/loading.png';
import { useSearchParams } from 'react-router-dom';

export default function Gallery(): JSX.Element {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [maxPageCount, setMaxPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetch('' + process.env.REACT_APP_API_SERVER + '/gallery?page=' + page)
            .then((res) => res.json())
            .then(
                (result) => {
                    for (let i = 0; i < result.length; i++) {
                        const img = new Image();
                        img.src = result[i].thumbnail;
                    }
                    setGallery(result.gallery);
                    setMaxPageCount(result.maxPageCount);
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                },
            );
    }, [page]);

    let pageNumber = parseInt(searchParams.get('page') as string);
    if (Number.isNaN(pageNumber)) {
        pageNumber = 1;
    }
    if (pageNumber !== page) {
        setPage(pageNumber);
    }

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        value: number,
    ) => {
        if (value > 0 && value < 3) {
            setSearchParams({ ['page']: value.toString() });

            if (value !== page) {
                setPage(value);
            }
        }
    };

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
                    {gallery.map(
                        (item: {
                            thumbnail: string;
                            title: string;
                            author: string;
                            id: string;
                        }) => (
                            <Link
                                key={item.id}
                                href={'/' + item.id}
                                sx={{
                                    backgroundColor:
                                        'var(--quaternary--bg-color)',
                                }}
                            >
                                <Fade in={true}>
                                    <div>
                                        <ImageListItem
                                            sx={{
                                                objectFit: 'contain',
                                            }}
                                        >
                                            <ImageListItemBar
                                                title={item.title}
                                                subtitle={
                                                    <span>
                                                        by: {item.author}
                                                    </span>
                                                }
                                                sx={{
                                                    color: 'var(--quinary--bg-color)',
                                                    backgroundColor:
                                                        'var(--quaternary--bg-color)',
                                                }}
                                            />
                                            <img
                                                src={item.thumbnail}
                                                alt={
                                                    'Thumbnail for ' +
                                                    item.title
                                                }
                                                className="objectFit__contain"
                                            />
                                        </ImageListItem>
                                    </div>
                                </Fade>
                            </Link>
                        ),
                    )}
                </ImageList>
                <Stack
                    spacing={2}
                    sx={{
                        backgroundColor: 'var(--quinary--bg-color)',
                    }}
                >
                    <Pagination
                        count={maxPageCount}
                        shape="rounded"
                        size="large"
                        page={page}
                        onChange={handlePageChange}
                    />
                </Stack>
            </Stack>
        );
    }
}
