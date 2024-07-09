import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

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
            <Container component="main" maxWidth="sm">
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
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Post
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default PostPage;
