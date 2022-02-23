import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Stack, Link } from '@mui/material';

export default function App(): JSX.Element {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_SERVER || '')
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setItems(result);
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
                    {items.map(
                        (item: {
                            thumbnail: string;
                            title: string;
                            directory: string;
                            author: string;
                            id: string;
                        }) => (
                            <Link key={item.id} href={'/' + item.id}>
                                <ImageListItem>
                                    <img
                                        src={`${process.env.REACT_APP_API_SERVER}/media/${item.directory}/${item.thumbnail}`}
                                        alt={'Thumbnail for ' + item.title}
                                    />
                                    <ImageListItemBar
                                        title={item.title}
                                        subtitle={
                                            <span>by: {item.author}</span>
                                        }
                                        sx={{
                                            color: 'var(--quinary--bg-color)',
                                            backgroundColor:
                                                'var(--quaternary--bg-color)',
                                        }}
                                    />
                                </ImageListItem>
                            </Link>
                        ),
                    )}
                </ImageList>
            </Stack>
        );
    }
}
