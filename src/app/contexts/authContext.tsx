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
        refreshToken();
      }
    }
    setLoading(false);
  }, [refreshToken, profile]);

  useEffect(() => {
    if (token) {
      const expirationTime = new Date().getTime() + 3600 * 1000; // 1 hour from now
      localStorage.setItem('token_expiration', expirationTime.toString());

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

      // Set up a timer to refresh the token 5 minutes before it expires
      const refreshTimer = setTimeout(() => {
        refreshToken();
      }, 3300 * 1000); // 55 minutes

      return () => clearTimeout(refreshTimer);
    }
  }, [token, refreshToken, profile]);


  return (
    <AuthContext.Provider value={{ token, setToken, loading, logout, profile }}>
      {children}
    </AuthContext.Provider>
  );
};


