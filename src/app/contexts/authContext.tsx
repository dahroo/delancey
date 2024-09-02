import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewToken } from '../../api/spotifyAuth';
import { stopPlayback, disconnectPlayer } from '../../api/playbackSDK';

import { getSpotifyProfile } from '../../api/spotifyApi';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  loading: boolean;
  logout: () => void;
  profile: SpotifyApi.CurrentUsersProfileResponse | null;
}

const defaultAuthContext: AuthContextType = {
  token: null,
  setToken: () => {},
  loading: true,
  logout: () => {},
  profile: null
}


export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    if (token) {
      await stopPlayback(token); // Stop the playback
      await disconnectPlayer(); // Disconnect the player
    }
    setToken(null);
    setProfile(null);
    localStorage.removeItem('spotify_access_token');
    navigate('/');
  }, [navigate, token])

  const refreshToken = useCallback(async () => {
    try {
      const newToken = await getNewToken();
      if (newToken) {
        setToken(newToken);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('spotify_access_token');
      const expirationTime = localStorage.getItem('token_expiration');
      
      if (storedToken && expirationTime) {
        const currentTime = new Date().getTime();
        if (currentTime < parseInt(expirationTime)) {
          setToken(storedToken);
          if (!profile) {
            getSpotifyProfile().then((data) => {
              if (data) {
                setProfile(data);
              } else {
                console.log("Failed to fetch profile data");
                setProfile(null);
              }
            });
          } 
        } else {
          await refreshToken();
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Set up a timer to refresh the token 5 minutes before it expires
    const refreshTimer = setInterval(() => {
      const expirationTime = localStorage.getItem('token_expiration');
      if (expirationTime) {
        const timeUntilExpiration = parseInt(expirationTime) - new Date().getTime();
        if (timeUntilExpiration < 300000) { // 5 minutes in milliseconds
          refreshToken();
        }
      }
    }, 600000); // Check every 10 minutes

    return () => clearInterval(refreshTimer);
  }, [refreshToken, profile]);

  return (
    <AuthContext.Provider value={{ token, setToken, loading, logout, profile }}>
      {children}
    </AuthContext.Provider>
  );
};


