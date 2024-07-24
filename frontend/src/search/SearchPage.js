import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6ba292', // Light green tint
        },
        secondary: {
            main: '#95c4b5', // Slightly lighter green
        },
        success: {
            main: '#8bb09b', // Another shade of light green
        },
        warning: {
            main: '#7f9e8b', // Another shade of light green
        },
        error: {
            main: '#748f80', // Another shade of light green
        },
        background: {
            default: 'linear-gradient(to bottom right, #ffffff, #d0e6d7)', // Gradient background
        },
    },
    typography: {
        h1: {
            fontSize: '3rem',
            fontWeight: 500,
            color: '#333', // Darker text for contrast
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#333', // Darker text for contrast
        },
    },
});

const SearchPage = () => {
    const [searchUsername, setSearchUsername] = useState('');
    const [results, setResults] = useState([]);
    const userID = parseInt(localStorage.getItem("user_id"));

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: searchUsername }),
            });
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleFollow = async (followedID) => {
        try {
            const response = await fetch('http://localhost:8000/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    followerID: userID,
                    followedID: followedID,
                }),
            });
            if (response.ok) {
                alert(`Followed user!`);
            } else {
                alert(`Followed user!`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Container component="main" maxWidth="md">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            bgcolor: 'background.paper',
                            p: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Search Users
                        </Typography>
                        <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="searchUsername"
                                label="Username"
                                name="searchUsername"
                                autoComplete="username"
                                autoFocus
                                value={searchUsername}
                                onChange={(e) => setSearchUsername(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Search
                            </Button>
                        </Box>
                    </Box>
                    {results.length > 0 && (
                        <TableContainer component={Paper} sx={{ marginTop: 4, maxWidth: '100%' }}>
                            <Table sx={{ minWidth: 700 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>First Name</TableCell>
                                        <TableCell>Last Name</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.map((row) => (
                                        <TableRow key={row.UserID}>
                                            <TableCell component="th" scope="row">
                                                {row.Username}
                                            </TableCell>
                                            <TableCell>{row.FirstName}</TableCell>
                                            <TableCell>{row.LastName}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleFollow(row.UserID)}
                                                >
                                                    Follow
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default SearchPage;
