import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';

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
        <div>
            <Typography variant="h4" gutterBottom>User Posts</Typography>
            {Array.isArray(posts) && posts.length > 0 ? (
                <TableContainer component={Paper}>
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
                                    <TableCell>{post.image}</TableCell>
                                    <TableCell>{post.Description}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="secondary" onClick={() => deletePost(post.PostID)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">No posts available.</Typography>
            )}
        </div>
    );
};

export default ProfilePage;
