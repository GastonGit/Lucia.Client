import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/Gallery.css';
import {
    Stack,
    Link,
    Fade,
    Pagination,
    Grid,
    GridSize,
    Box,
    ImageListItem,
    ImageListItemBar,
    useMediaQuery,
} from '@mui/material';

export default function Gallery(): JSX.Element | null {
    const [error, setError] = useState<TypeError | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [maxPageCount, setMaxPageCount] = useState(0);
    const [page, setPage] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const screenWidthIsAbove1920 = useMediaQuery('(min-width:1920px)', {
        noSsr: true,
    });

    let pageNumber = parseInt(searchParams.get('page') as string);
    if (Number.isNaN(pageNumber)) {
        pageNumber = 1;
    }
    if (pageNumber !== page) {
        setPage(pageNumber);
    }

    useEffect(() => {
        if ((searchParams.get('search') as string) !== null) {
            let searchPage = 1;

            if ((searchParams.get('page') as string) !== null) {
                searchPage = parseInt(searchParams.get('page') as string);
            }

            fetch(
                (('' +
                    process.env.REACT_APP_API_SERVER +
                    '/search?title=' +
                    searchParams.get('search')) as string) +
                    '&page=' +
                    searchPage,
            )
                .then((res) => res.json())
                .then(
                    (result) => {
                        setGallery(result.gallery);
                        setPage(parseInt(searchParams.get('page') as string));
                        setMaxPageCount(result.maxPageCount);
                        setIsLoaded(true);
                    },
                    (error) => {
                        setError(error);
                        setIsLoaded(true);
                    },
                );
        } else {
            fetch(
                '' + process.env.REACT_APP_API_SERVER + '/gallery?page=' + page,
            )
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
                        setError(error);
                        setIsLoaded(true);
                    },
                );
        }
    }, [page, searchParams]);

    function onMangaSubmit(
        event:
            | React.MouseEvent<HTMLSpanElement, MouseEvent>
            | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        id: string,
    ) {
        event.preventDefault();
        const url = '/' + id;

        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            navigate(url);
        }
    }

    const handlePageChange = (
        _event: React.ChangeEvent<unknown>,
        value: number,
    ) => {
        if (value > 0 && value <= maxPageCount) {
            if ((searchParams.get('search') as string) === null) {
                setSearchParams({ ['page']: value.toString() });
            } else {
                setSearchParams({
                    ['search']: searchParams.get('search') as string,
                    ['page']: value.toString(),
                });
            }
            if (value !== page) {
                setPage(value);
            }
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (isLoaded) {
        return (
            <Fade in={true} timeout={250}>
                <Stack
                    direction="column"
                    alignItems="center"
                    spacing={2}
                    mt={2}
                    mb={2}
                >
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
                            {gallery.map(
                                (item: {
                                    thumbnail: string;
                                    title: string;
                                    id: string;
                                }) => (
                                    <Grid
                                        item
                                        key={item.id}
                                        xs={14 as GridSize}
                                        sm={7}
                                        md={4}
                                    >
                                        <Link
                                            sx={{
                                                width: '100%',
                                                backgroundColor:
                                                    'var(--quaternary--bg-color)',
                                            }}
                                            href={'/' + item.id}
                                            onClick={(event) => {
                                                onMangaSubmit(event, item.id);
                                            }}
                                        >
                                            <ImageListItem
                                                sx={{ width: '100%' }}
                                            >
                                                <ImageListItemBar
                                                    title={item.title}
                                                    sx={{
                                                        opacity: 0.96,
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
                                                />
                                            </ImageListItem>
                                        </Link>
                                    </Grid>
                                ),
                            )}
                        </Grid>
                    </Box>
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
            </Fade>
        );
    } else {
        return null;
    }
}
