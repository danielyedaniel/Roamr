import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    Snackbar,
    Box,
    Container,
    CssBaseline,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
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

const RatingPage = () => {
    const [locations, setLocations] = useState([]);
    const [ratings, setRatings] = useState({});
    const [sortAndDisplayByRatingsCount, setSortAndDisplayByRatingsCount] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentLocationID, setCurrentLocationID] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        fetchLocations();
    }, [sortAndDisplayByRatingsCount]);

    const fetchLocations = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/location${sortAndDisplayByRatingsCount ? 'count' : 'rating'}`
            );
            setLocations(response.data);
        } catch (error) {
            console.error('There was an error fetching the locations!', error);
        }
    };

    const handleRatingChange = (e) => {
        setRatings({
            ...ratings,
            [currentLocationID]: e.target.value,
        });
    };

    const submitRating = async () => {
        const userID = localStorage.getItem('user_id');
        const rating = ratings[currentLocationID];
        const ratingValue = Number(rating);
        if (ratingValue < 0 || ratingValue > 5) {
            console.error('Rating must be between 0 & 5!');
            setSnackbarMessage('Rating must be between 0 & 5!');
            setSnackbarSeverity('error');
            return;
        }
        console.log('Submitting rating:', rating, 'for location ID:', currentLocationID);
        if (rating === undefined || rating === null) {
            console.error('Rating is undefined or null!');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/rating', {
                user_id: Number(userID),
                location_id: currentLocationID,
                rating: Number(rating),
            });
            if (response.status === 201) {
                setSnackbarMessage('Rating submitted successfully!');
                setSnackbarSeverity('success');
                fetchLocations();
            } else {
                setSnackbarMessage(`Failed to submit rating. Status: ${response.status}`);
                setSnackbarSeverity('error');
            }
        } catch (error) {
            console.error('There was an error adding the rating!', error);
            setSnackbarMessage(`Failed to submit rating. Error: ${error.message}`);
            setSnackbarSeverity('error');
        } finally {
            setOpenDialog(false);
            setSnackbarOpen(true);
        }
    };

    const openRatingDialog = (locationID) => {
        setCurrentLocationID(locationID);
        setOpenDialog(true);
    };

    const toggleSortAndDisplay = () => {
        setSortAndDisplayByRatingsCount(prevValue => !prevValue);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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
                            Location Ratings
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={toggleSortAndDisplay}
                            sx={{ mb: 2 }}
                        >
                            {sortAndDisplayByRatingsCount ? "Sort by Average Rating" : "Sort by Ratings Count"}
                        </Button>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>City</TableCell>
                                        <TableCell>Country</TableCell>
                                        <TableCell>Latitude</TableCell>
                                        <TableCell>Longitude</TableCell>
                                        <TableCell>{sortAndDisplayByRatingsCount ? 'Ratings Count' : 'Average Rating'}</TableCell>
                                        <TableCell>Add Your Rating</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {locations.map((location) => (
                                        <TableRow key={location.LocationID}>
                                            <TableCell>{location.City}</TableCell>
                                            <TableCell>{location.Country}</TableCell>
                                            <TableCell>{location.Latitude}</TableCell>
                                            <TableCell>{location.Longitude}</TableCell>
                                            {sortAndDisplayByRatingsCount ? (
                                                <TableCell>{location.rating_count || 'N/A'}</TableCell>
                                            ) : (
                                                <TableCell>{location.average_rating || 'N/A'}</TableCell>
                                            )}
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => openRatingDialog(location.LocationID)}
                                                >
                                                    Add Rating
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Container>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>
                        Add Rating
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseDialog}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            type="number"
                            label="Rating"
                            value={ratings[currentLocationID] || ''}
                            onChange={handleRatingChange}
                            inputProps={{ min: 0, max: 5, step: 0.1 }}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={submitRating} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default RatingPage;