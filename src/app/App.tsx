import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import { PlaybackProvider } from './contexts/playbackContext';

import Landing from '../layouts/landing';
import HomeLayout from '../layouts/home';
import BaseLayout from '../layouts/base';
import { PlaylistDetailLayout } from '../layouts/playlistDetail';
import SpotifyCallback from '../api/callback';

const ProtectedRoutes: React.FC = () => (
  <AuthProvider>
    <PlaybackProvider>
      <Routes>
        <Route path="/home" element={
          <BaseLayout>
            <HomeLayout />
          </BaseLayout>
        } />
        <Route path="/playlist/:playlistId" element={
          <BaseLayout>
            <PlaylistDetailLayout />
          </BaseLayout>
        } />
        <Route path="*" element={<div>not found</div>} />
      </Routes>
    </PlaybackProvider>
  </AuthProvider>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/callback" element={<SpotifyCallback />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </Router>
  );
};

export default App;