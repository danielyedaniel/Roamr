import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, CssBaseline } from '@mui/material';
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

const PostPage = () => {
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userID = parseInt(localStorage.getItem('user_id'), 10);

        try {
            const locationResponse = await fetch('http://localhost:8000/locationSearch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ city: city, country: country }),
            });

            if (!locationResponse.ok) {
                const errorText = await locationResponse.text();
                throw new Error(`Location search error: ${errorText}`);
            }

            const locationData = await locationResponse.json();
            console.log('Location search response:', locationData);

            const locationID = locationData[0].LocationID;

            const postData = {
                user_id: userID,
                description: description,
                image: image,
                location_id: locationID,
            };

            const postResponse = await fetch('http://localhost:8000/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(postData),
            });

            if (postResponse.ok) {
                navigate('/home');
            } else {
                const errorText = await postResponse.text();
                throw new Error(`Post creation error: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Container component="main" maxWidth="sm">
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
                            Create a Post
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="description"
                                label="Description"
                                name="description"
                                autoComplete="description"
                                autoFocus
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <input
                                accept="image/*"
                                id="image"
                                type="file"
                                onChange={handleImageChange}
                                style={{ marginTop: '16px', marginBottom: '16px' }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="city"
                                label="City"
                                name="city"
                                autoComplete="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="country"
                                label="Country"
                                name="country"
                                autoComplete="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Post
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default PostPage;
