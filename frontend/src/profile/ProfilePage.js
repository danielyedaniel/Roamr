import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Container, CssBaseline } from '@mui/material';
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
        h4: {
            fontSize: '2rem',
            fontWeight: 500,
            color: '#333', // Darker text for contrast
        },
    },
});

const ProfilePage = () => {
    const [posts, setPosts] = useState([]);
    const userID = parseInt(localStorage.getItem('user_id'), 10);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/posts/user?user_id=${userID}`);
            setPosts(response.data);
        } catch (error) {
            console.error("There was an error fetching the posts!", error);
        }
    };

    const deletePost = async (postID) => {
        console.log(`Delete button clicked for postID: ${postID}`);
        try {
            await axios.delete(`http://localhost:8000/deletePost?postID=${postID}`);
            setPosts([]);
            fetchPosts();
        } catch (error) {
            console.error("There was an error deleting the post!", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
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
                        <Typography variant="h4" gutterBottom>
                            User Posts
                        </Typography>
                        <TableContainer component={Paper} sx={{ mt: 4 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>City</TableCell>
                                        <TableCell>Country</TableCell>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {posts.map(post => (
                                        <TableRow key={post.PostID}>
                                            <TableCell>{post.city}</TableCell>
                                            <TableCell>{post.country}</TableCell>
                                            <TableCell><img src={post.image} alt="Post" style={{ width: '100px', height: '100px' }} /></TableCell>
                                            <TableCell>{post.Description}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="secondary" onClick={() => deletePost(post.PostID)}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default ProfilePage;
