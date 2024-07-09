import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const HomePage = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the stored username from local storage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="md">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Typography component="h1" variant="h4">
                        Welcome, {username}
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleNavigation('/search')}
                        >
                            Go to Search
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleNavigation('/post')}
                        >
                            Go to Post
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleNavigation('/profile')}
                        >
                            Go to Profile
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default HomePage;
