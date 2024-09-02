import React, { ReactNode, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/authContext';
import { PlaybackProvider } from './contexts/playbackContext';

import Landing from '../layouts/landing';
import HomeLayout from '../layouts/home';
import BaseLayout from '../layouts/base';
import { PlaylistDetailLayout } from '../layouts/playlistDetail';
import SpotifyCallback from '../api/callback';

// ProtectedRoute component
const PrivateRoute: React.FC<{children: ReactNode}> = ({ children }) => {
  const { token, loading, logout } = useContext(AuthContext);
  if(loading) {
    return <div>loading...</div>
  }
  if(!token) {
    logout();
  }
  return <>{children}</>
}

// App component
const App: React.FC = () => {
  return (
      <Router>
        <AuthProvider>
          <PlaybackProvider>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/callback" element={<SpotifyCallback />} />
            <Route path="/home" element={<PrivateRoute><BaseLayout><HomeLayout/></BaseLayout></PrivateRoute>} />
            <Route path="/playlist/:playlistId" element={
              <PrivateRoute>
                <BaseLayout>
                  <PlaylistDetailLayout/>
                </BaseLayout>
              </PrivateRoute>
            }/>
            <Route path="*" element={<div>not found</div>} />
            </Routes>
          </PlaybackProvider>
        
        </AuthProvider>
      </Router>
  );
};

export default App;