import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import { useLocation } from 'react-router-dom';
import ImageList from '@mui/material/ImageList';
import { Link, Stack, Typography } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';

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
        images: [],
    });

    const api = process.env.REACT_APP_API_SERVER || '';
    const location = useLocation();

    useEffect(() => {
        fetch(api + location.pathname)
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

    if (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <span>Loading...</span>;
    } else {
        return (
            <Stack
                direction="column"
                alignItems="center"
                spacing={2}
                mt={2}
                mb={2}
            >
                <Typography variant="h2" color="var(--main-text-color)">
                    {manga.information.title}
                </Typography>
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
                    {manga.images.map((image: { name: string }) => (
                        <Link
                            key={image.name}
                            href={'/manga/' + manga.information.id}
                        >
                            <ImageListItem>
                                <img
                                    src={`${process.env.REACT_APP_API_SERVER}/media/${manga.information.directory}/${manga.information.bucket}/${image.name}`}
                                    alt={'Image for ' + manga.information.title}
                                />
                            </ImageListItem>
                        </Link>
                    ))}
                </ImageList>
            </Stack>
        );
    }
}
