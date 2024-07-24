import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Snackbar, Box, Container, CssBaseline } from '@mui/material';
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

const LocationsPage = () => {
    const [locations, setLocations] = useState([]);
    const [open, setOpen] = useState(false);
    const [newLocation, setNewLocation] = useState({ country: '', city: '', latitude: '', longitude: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/locations');
            setLocations(response.data);
        } catch (error) {
            console.error("There was an error fetching the locations!", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLocation({ ...newLocation, [name]: value });
    };

    const handleAddLocation = async () => {
        try {
            const locationData = {
                ...newLocation,
                latitude: parseFloat(newLocation.latitude),
                longitude: parseFloat(newLocation.longitude)
            };

            const response = await axios.post('http://localhost:8000/location', locationData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Location added successfully:', response.data);
            setSnackbarMessage('Location added successfully!');
            setSnackbarOpen(true);
            fetchLocations();
            setOpen(false);
        } catch (error) {
            console.error("There was an error adding the location!", error);
            setSnackbarMessage('There was an error adding the location.');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
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
                            All Locations
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
                            Add Location
                        </Button>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Country</TableCell>
                                        <TableCell>City</TableCell>
                                        <TableCell>Latitude</TableCell>
                                        <TableCell>Longitude</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {locations.map(location => (
                                        <TableRow key={location.location_id}>
                                            <TableCell>{location.country}</TableCell>
                                            <TableCell>{location.city}</TableCell>
                                            <TableCell>{location.latitude}</TableCell>
                                            <TableCell>{location.longitude}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogTitle>Add New Location</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                To add a new location, please enter the country, city, latitude, and longitude.
                            </DialogContentText>
                            <TextField autoFocus margin="dense" name="country" label="Country" fullWidth value={newLocation.country} onChange={handleInputChange} />
                            <TextField margin="dense" name="city" label="City" fullWidth value={newLocation.city} onChange={handleInputChange} />
                            <TextField margin="dense" name="latitude" label="Latitude" fullWidth value={newLocation.latitude} onChange={handleInputChange} />
                            <TextField margin="dense" name="longitude" label="Longitude" fullWidth value={newLocation.longitude} onChange={handleInputChange} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
                            <Button onClick={handleAddLocation} color="primary">Add Location</Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                        message={snackbarMessage}
                        action={
                            <Button color="inherit" size="small" onClick={handleSnackbarClose}>
                                CLOSE
                            </Button>
                        }
                    />
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default LocationsPage;
