import React, { useEffect } from 'react';
import '../styles/Header.css';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    InputBase,
    Link,
    Paper,
    Toolbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setSearchValue } from '../features/search/search-slice';
import {
    createSearchParams,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';

export default function Header(): JSX.Element {
    const dispatch = useAppDispatch();
    const searchValue = useAppSelector((state) => state.search.searchValue);

    const [searchParams, setSearchParams] = useSearchParams();
    const pureNavigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname + location.search;

    function navigate(url: string) {
        if (pathname !== url) {
            pureNavigate(url);
        }
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        dispatch(setSearchValue(event.target.value));
    }

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedSearchValue = searchValue.trim();

        if (trimmedSearchValue !== '') {
            navigate(
                '/?' +
                    createSearchParams({
                        ['search']: trimmedSearchValue,
                        ['page']: '1',
                    }),
            );
        } else if (
            trimmedSearchValue === '' &&
            searchParams.toString() !== ''
        ) {
            setSearchParams('');
        }
        dispatch(setSearchValue(trimmedSearchValue));
    }

    function goHome(
        event:
            | React.MouseEvent<HTMLSpanElement, MouseEvent>
            | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) {
        event.preventDefault();
        const url = '/';

        if (event.ctrlKey) {
            window.open(url, '_blank');
        } else {
            dispatch(setSearchValue(''));
            navigate(url);
        }
    }

    useEffect(() => {
        const search = searchParams.get('search') as string;
        if (search !== null && search !== searchValue) {
            dispatch(setSearchValue(search));
        } else if (search === null) {
            dispatch(setSearchValue(''));
        }
    }, [searchParams]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar
                    variant="dense"
                    className="header__bar"
                    sx={{ py: { xs: 1, md: 0.5 } }}
                >
                    <Link
                        sx={{ mr: 2 }}
                        href="/"
                        variant="h4"
                        className="title__link"
                        onClick={(event) => {
                            goHome(event);
                        }}
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
                    <Button
                        sx={{
                            ml: 1,
                            p: '10px',
                            color: 'var(--secondary-text-color)',
                        }}
                    >
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
