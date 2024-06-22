import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const SearchPage = () => {
    const [searchUsername, setSearchUsername] = useState('');
    const [results, setResults] = useState([]);

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

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
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
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Search
                        </Button>
                    </Box>
                </Box>
                {results.length > 0 && (
                    <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Username</TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map((row) => (
                                    <TableRow key={row.ID}>
                                        <TableCell component="th" scope="row">
                                            {row.Username}
                                        </TableCell>
                                        <TableCell>{row.FirstName}</TableCell>
                                        <TableCell>{row.LastName}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </ThemeProvider>
    );
};

export default SearchPage;
