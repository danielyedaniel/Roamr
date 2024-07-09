import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const LoginForm = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = isSignUp ? 'http://localhost:8000/signup' : 'http://localhost:8000/login';
        const payload = isSignUp
            ? { username, password, email, firstName, lastName, profilePicture }
            : { username, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json(); // Parse the JSON response
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.userID);
                localStorage.setItem('username', data.username);
                localStorage.setItem('email', data.email);
                localStorage.setItem('firstName', data.firstName);
                localStorage.setItem('lastName', data.lastName);
                localStorage.setItem('profilePicture', data.profilePicture);
                navigate('/home');
            } else {
                const errorText = await response.text();
                console.error('Error:', errorText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleSignUp = () => {
        setIsSignUp((prev) => !prev);
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
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {isSignUp && (
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="firstName"
                                    label="First Name"
                                    id="firstName"
                                    autoComplete="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="lastName"
                                    label="Last Name"
                                    id="lastName"
                                    autoComplete="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="profilePicture"
                                    label="Profile Picture"
                                    id="profilePicture"
                                    autoComplete="profilePicture"
                                    value={profilePicture}
                                    onChange={(e) => setProfilePicture(e.target.value)}
                                />
                            </>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 1, mb: 2 }}
                            onClick={toggleSignUp}
                        >
                            {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default LoginForm;
