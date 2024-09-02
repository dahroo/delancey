import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNewToken } from '../../api/spotifyAuth';
import { stopPlayback, disconnectPlayer } from '../../api/playbackSDK';
import { getCurrentUser } from '../../api/spotifyApi';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  loading: boolean;
  logout: () => void;
  userId: string | null;
}

const defaultAuthContext: AuthContextType = {
  token: null,
  setToken: () => {},
  loading: true,
  logout: () => {},
  userId: null
}


export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    if (token) {
      await stopPlayback(token); // Stop the playback
      await disconnectPlayer(); // Disconnect the player
    }
    setToken(null);
    setUserId(null);
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

  const fetchUserId = useCallback(async (accessToken: string) => {
    try {
      const userId = await getCurrentUser(accessToken);
      setUserId(userId);
      localStorage.setItem('spotify_user_id', userId);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    const expirationTime = localStorage.getItem('token_expiration');
    const storedUserId = localStorage.getItem('spotify_user_id');
    
    if (storedToken && expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime < parseInt(expirationTime)) {
        setToken(storedToken);
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          fetchUserId(storedToken);
        }
      } else {
        refreshToken();
      }
    }
    setLoading(false);
  }, [refreshToken, fetchUserId]);

  useEffect(() => {
    if (token) {
      const expirationTime = new Date().getTime() + 3600 * 1000; // 1 hour from now
      localStorage.setItem('token_expiration', expirationTime.toString());

      if (!userId) {
        fetchUserId(token);
      }
      
      // Set up a timer to refresh the token 5 minutes before it expires
      const refreshTimer = setTimeout(() => {
        refreshToken();
      }, 3300 * 1000); // 55 minutes

      return () => clearTimeout(refreshTimer);
    }
  }, [token, refreshToken, userId, fetchUserId]);

  return (
    <AuthContext.Provider value={{ token, setToken, loading, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};


