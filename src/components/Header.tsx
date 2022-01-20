import React from 'react';
import '../styles/Header.css';
import { AppBar, Box, Link, Toolbar } from '@mui/material';

export default function Header(): JSX.Element {
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
                        variant="h6"
                        className="title__link"
                        sx={{ mr: 2 }}
                    >
                        Lucia
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
