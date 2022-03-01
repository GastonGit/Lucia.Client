import React, { useEffect, useState } from 'react';
import '../styles/Header.css';
import {
    AppBar,
    Box,
    IconButton,
    InputBase,
    Link,
    Paper,
    Toolbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';

export default function Header(): JSX.Element {
    const [searchValue, setSearchValue] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setSearchValue(event.target.value);
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSearchParams({ ['search']: searchValue, ['page']: '1' });
    }

    useEffect(() => {
        const search = searchParams.get('search') as string;
        if (search !== null && search !== searchValue) {
            setSearchValue(search);
        }
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar
                    variant="dense"
                    className="header__bar"
                    sx={{ py: { xs: 1, md: 0.5 } }}
                >
                    <Link
                        href="/"
                        variant="h4"
                        className="title__link"
                        sx={{ mr: 2 }}
                    >
                        Lucia
                    </Link>
                    <Paper
                        sx={{
                            background: 'var(--quinary--bg-color)',
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            width: 300,
                        }}
                        component="form"
                        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            onSubmit(event);
                        }}
                    >
                        <InputBase
                            sx={{
                                ml: 1,
                                flex: 1,
                                opacity: 1,
                                color: 'var(--secondary-text-color)',
                            }}
                            placeholder="Search"
                            value={searchValue}
                            onChange={onChange}
                        />
                        <IconButton
                            sx={{
                                p: '10px',
                                color: 'var(--secondary-text-color)',
                            }}
                            aria-label="search"
                            type="submit"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
