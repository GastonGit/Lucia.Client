import React from 'react';
import '../styles/App.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export default function App(): JSX.Element {
    return (
        <ImageList sx={{ width: 1800 }} cols={7} gap={8} rowHeight={380}>
            {itemData.map((item) => (
                <ImageListItem key={item.img}>
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
            ))}
        </ImageList>
    );
}

// export default function App(): JSX.Element {
//     return (
//         <ImageList cols={7} gap={8} rowHeight={380}>
//             {itemData.map((item) => (
//                 <ImageListItem key={item.img}>
//                     <a className="image__url" href="#">
//                         <img
//                             src={`${item.img}`}
//                             srcSet={`${item.img}`}
//                             alt={item.title}
//                         />
//                     </a>
//                     <ImageListItemBar
//                         title={item.title}
//                         subtitle={<span>by: {item.author}</span>}
//                         position="below"
//                     />
//                 </ImageListItem>
//             ))}
//         </ImageList>
//     );
// }

const itemData = [
    {
        img: 'logo512.png',
        title: 'Breakfast',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Burger',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Camera',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Coffee',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Hats',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Honey',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Basketball',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Fern',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Mushrooms',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Tomato basil',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Sea star',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Bike',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Coffee',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Hats',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Honey',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Basketball',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Fern',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Mushrooms',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Tomato basil',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Sea star',
        author: '@test',
    },
    {
        img: 'logo512.png',
        title: 'Bike',
        author: '@test',
    },
];
