import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Link } from '@mui/material';

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
            <ImageList sx={{ width: 1800 }} cols={7} gap={8} rowHeight={380}>
                {items.map(
                    (
                        item: { img: string; title: string; author: string },
                        index: number,
                    ) => (
                        <Link key={item.img + (index + 1)} href="#">
                            <ImageListItem>
                                <img
                                    src={`${item.img}`}
                                    srcSet={`${item.img}`}
                                    alt={item.title}
                                />
                                <ImageListItemBar
                                    title={item.title}
                                    subtitle={<span>by: {item.author}</span>}
                                    position="below"
                                />
                            </ImageListItem>
                        </Link>
                    ),
                )}
            </ImageList>
        );
    }
}
