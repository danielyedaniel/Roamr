import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Container, CssBaseline, AppBar, Toolbar, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star'; // Importing the icon for Rating button
import globeImage from './globe.png'; // Import the globe image

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
        h4: {
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#333', // Darker text for contrast
        },
    },
});

const HomePage = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Logging all local storage properties:');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`${key}: ${value}`);
        }

        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
                <AppBar position="static" color="transparent" elevation={0}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Roamr
                        </Typography>
                        <IconButton color="inherit" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container component="main" maxWidth="md">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: 8,
                        }}
                    >
                        <Typography component="h1" variant="h1" gutterBottom>
                            Welcome, {username}
                        </Typography>
                        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon />}
                                onClick={() => handleNavigation('/search')}
                                sx={{ minWidth: 150 }}
                            >
                                Go to Search
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<PostAddIcon />}
                                onClick={() => handleNavigation('/post')}
                                sx={{ minWidth: 150 }}
                            >
                                Go to Post
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<AccountCircleIcon />}
                                onClick={() => handleNavigation('/profile')}
                                sx={{ minWidth: 150 }}
                            >
                                Go to Profile
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                startIcon={<MapIcon />}
                                onClick={() => handleNavigation('/map')}
                                sx={{ minWidth: 150 }}
                            >
                                Go to Map
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<LocationOnIcon />}
                                onClick={() => handleNavigation('/locations')}
                                sx={{ minWidth: 150 }}
                            >
                                Locations
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<StarIcon />}
                                onClick={() => handleNavigation('/rating')}
                                sx={{ minWidth: 150 }}
                            >
                                Ratings
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                sx={{ minWidth: 150 }}
                            >
                                Logout
                            </Button>
                        </Box>
                        <Box
                            component="img"
                            sx={{
                                width: '50%',
                                mt: 6,
                            }}
                            alt="Globe"
                            src={globeImage} // Use the imported globe image
                        />
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default HomePage;
