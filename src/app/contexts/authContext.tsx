import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpotifyProfile } from '../../api/spotifyApi';
import { disconnectPlayer } from '../../api/playbackSDK';

interface AuthContextType {
  token: string | null;
  profile: SpotifyApi.CurrentUsersProfileResponse | null;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  token: null,
  profile: null,
  logout: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

const TOKEN_STORAGE_KEY = 'spotify_access_token';

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setProfile(null);
    navigate('/');
    disconnectPlayer();
  }, [navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
      getSpotifyProfile()
        .then(setProfile)
        .catch(error => {
          console.error('Error fetching profile:', error);
          logout();
        });
    } else {
      logout();
    }
  }, [logout]);

  const contextValue: AuthContextType = {
    token,
    profile,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {token ? children : null}
    </AuthContext.Provider>
  );
};