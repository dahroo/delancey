import axios from 'axios';

let player: Spotify.Player | null = null;
let deviceId: string | null = null;

export const initializePlayer = (token: string, onPlayerStateChanged: (state: Spotify.PlaybackState) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token); },
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        deviceId = device_id;
        resolve();
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        deviceId = null;
      });

      player.addListener('player_state_changed', onPlayerStateChanged);

      player.connect();
    };

    script.onerror = reject;
  });
};

export const playTrackInContext = async (playlistUri: string, trackUri: string, token: string): Promise<void> => {
  if (!player || !deviceId) {
    throw new Error('Player or device ID not available');
  }

  await player.resume();
  await axios.put(
    `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    { 
      context_uri: playlistUri,
      offset: { uri: trackUri }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );
};

export const togglePlayPause = async (): Promise<void> => {
  if (!player) {
    throw new Error('Player not available');
  }
  await player.togglePlay();
};

export const previousTrack = async (): Promise<void> => {
  if (!player) {
    throw new Error('Player not available');
  }
  await player.previousTrack();
};

export const nextTrack = async (): Promise<void> => {
  if (!player) {
    throw new Error('Player not available');
  }
  await player.nextTrack();
};

export const seekToPosition = async (positionMs: number): Promise<void> => {
  if (!player) {
    throw new Error('Player not available');
  }
  await player.seek(positionMs);
};

export const getPlaybackState = async (): Promise<Spotify.PlaybackState | null> => {
  if (!player) {
    throw new Error('Player not available');
  }
  return await player.getCurrentState();
};

export const stopPlayback = async (token: string): Promise<void> => {
  if (deviceId) {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  }
};

export const disconnectPlayer = async (): Promise<void> => {
  if (player) {
    player.disconnect();
    player = null;
    deviceId = null;
  }
};