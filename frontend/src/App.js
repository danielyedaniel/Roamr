import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './login/LoginForm';
import HomePage from './home/HomePage';
import SearchPage from './search/SearchPage';
import PostPage from './post/PostPage';
import ProfilePage from './profile/ProfilePage';
import Locations from './locations/Locations';
import MapPage from './map/MapPage';
import RatingPage from './rating/RatingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/rating" element={<RatingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
