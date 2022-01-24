import React, { useEffect, useState } from 'react';
import '../styles/App.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useLocation } from 'react-router-dom';
import { Link } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function MangaOverview(): JSX.Element {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState({
        images: [],
        title: '',
        author: '',
        id: -1,
    });

    const api = process.env.REACT_APP_API_SERVER || '';
    const location = useLocation();
    console.log(location);

    useEffect(() => {
        fetch(api + location.pathname)
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
            <div>
                <p>Title: {items.title}</p>
                <ImageList
                    sx={{ width: 1800 }}
                    cols={7}
                    gap={8}
                    rowHeight={380}
                >
                    {items.images.map(
                        (
                            item: {
                                img: string;
                                title: string;
                                author: string;
                                id: string;
                            },
                            index: number,
                        ) => (
                            <Link
                                key={item + '' + (index + 1)}
                                href={
                                    '/read/' + items.id + '?page=' + (index + 1)
                                }
                            >
                                <ImageListItem>
                                    <img
                                        src={`http://localhost:6021/${item}`}
                                    />
                                </ImageListItem>
                            </Link>
                        ),
                    )}
                </ImageList>
            </div>
        );
    }
}
