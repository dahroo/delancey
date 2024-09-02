import React, { createContext, useState, useCallback, useEffect, useContext, useRef } from 'react';
import * as PlaybackSDK from '../../api/playbackSDK';
import { AuthContext } from '../../app/contexts/authContext';

interface PlaybackContextType {
  currentTrack: { name: string; artists: string[]; durationMs: number } | null;
  isPlaying: boolean;
  progressMs: number;
  handlePlayPause: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleSeek: (positionMs: number) => void;
  handlePlayTrackInContext: (playlistId: string, trackUri: string) => void;
}

const DefaultPlaybackContext: PlaybackContextType = {
    currentTrack: null,
    isPlaying: false,
    progressMs: 0,
    handlePlayPause: () => {},
    handlePrevious: () => {},
    handleNext: () => {},
    handleSeek: () => {},
    handlePlayTrackInContext: () => {},
};

export const PlaybackContext = createContext<PlaybackContextType>(DefaultPlaybackContext);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<{ name: string; artists: string[]; durationMs: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMs, setProgressMs] = useState(0);
  const { token, logout } = useContext(AuthContext);
  const playerInitialized = useRef(false);

  const updatePlaybackState = useCallback(async () => {
    const state = await PlaybackSDK.getPlaybackState();
    if (state) {
      setCurrentTrack({
        name: state.track_window.current_track.name,
        artists: state.track_window.current_track.artists.map(artist => artist.name),
        durationMs: state.duration,
      });
      setIsPlaying(!state.paused);
      setProgressMs(state.position);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      console.error('Authentication error: Token is missing');
      logout();
      return;
    }

    if (!playerInitialized.current) {
        PlaybackSDK.initializePlayer(token, updatePlaybackState)
        .then(() => {
        playerInitialized.current = true;
        console.log('Spotify player initialized');
        })
        .catch(error => console.error('Failed to initialize Spotify player:', error));
    }

    const interval = setInterval(updatePlaybackState, 1000);
    return () => clearInterval(interval);
  }, [token, logout, updatePlaybackState]);

  const handlePlayPause = useCallback(() => {
    PlaybackSDK.togglePlayPause()
      .then(updatePlaybackState)
      .catch(error => console.error('Failed to toggle play/pause:', error));
  }, [updatePlaybackState]);

  const handlePrevious = useCallback(() => {
    PlaybackSDK.previousTrack()
      .then(updatePlaybackState)
      .catch(error => console.error('Failed to go to previous track:', error));
  }, [updatePlaybackState]);

  const handleNext = useCallback(() => {
    PlaybackSDK.nextTrack()
      .then(updatePlaybackState)
      .catch(error => console.error('Failed to go to next track:', error));
  }, [updatePlaybackState]);

  const handleSeek = useCallback((positionMs: number) => {
    PlaybackSDK.seekToPosition(positionMs)
      .then(updatePlaybackState)
      .catch(error => console.error('Failed to seek:', error));
  }, [updatePlaybackState]);

  const handlePlayTrackInContext = useCallback((playlistId: string, trackUri: string) => {
    if (!token) {
      console.error('Authentication error: Token is missing');
      logout();
      return;
    }
    PlaybackSDK.playTrackInContext(`spotify:playlist:${playlistId}`, trackUri, token)
      .then(updatePlaybackState)
      .catch(error => console.error('Failed to play track in playlist context:', error));
  }, [token, logout, updatePlaybackState]);

  const value = {
    currentTrack,
    isPlaying,
    progressMs,
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleSeek,
    handlePlayTrackInContext,
  };

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
};

