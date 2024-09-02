import axios from 'axios';
import { SpotifyUserProfile, 
        PlaylistPreview, 
        SimplifiedPlaylistObject, 
        Image, 

        SimplifiedArtist,
        SimplifiedPlaylist,
        Playlists_TrackObject,
        TrackAudioFeatures
} from './types';

const apiEndpoint = 'https://api.spotify.com/v1';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getSpotifyProfile(token: string): Promise<SpotifyUserProfile | null> {
  try {
    const response = await axios.get(`${apiEndpoint}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify profile:', error);
    return null;
  }
}

export async function getUserPlaylists(token: string): Promise<PlaylistPreview[] | null> {
  try {
    const response = await axios.get(`${apiEndpoint}/me/playlists`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const playlists = response.data.items.map((item: SimplifiedPlaylistObject): PlaylistPreview => {
      const largestImage = item.images.reduce((largest: Image | null, image: Image) => {
        return (!largest || image.width > largest.width) ? image : largest;
      }, null);

      return {
        id: item.id,
        imageUrl: largestImage ? largestImage.url : '', // In case there are no images, return an empty string.
        name: item.name,
        ownerDisplayName: item.owner.display_name || 'anonymous'
      };
    });

    return playlists;
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    return null;
  }
}

export async function getAudioFeatures(token: string, trackId: string): Promise<TrackAudioFeatures | null> {
  try {
      const response = await axios.get(`${apiEndpoint}/audio-features/${trackId}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      const features = response.data;
      return {
          acousticness: features.acousticness,
          danceability: features.danceability,
          energy: features.energy,
          instrumentalness: features.instrumentalness,
          liveness: features.liveness,
          loudness: features.loudness,
          speechiness: features.speechiness,
          tempo: features.tempo,
          valence: features.valence,
          mode: features.mode,
          key: features.key
      };
  } catch (error) {
      console.error('Error fetching audio features:', error);
      return null;
  }
}

export async function getPlaylist(token: string, playlistId: string): Promise<SimplifiedPlaylist | null> {
  try {
      const response = await axios.get(`${apiEndpoint}/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${token}` },
      });

      const { description, images, name, owner, tracks, external_urls } = response.data;

      const simplifiedOwner = {
          display_name: owner.display_name,
          id: owner.id,
      };

      const simplifiedTracks: Playlists_TrackObject[] = [];

      for (const PlaylistTrackObject of tracks.items) {
          await delay(200); // Delay before each API call to manage rate limits

          const audioFeatures = await getAudioFeatures(token, PlaylistTrackObject.track.id);

          simplifiedTracks.push({
              id: PlaylistTrackObject.track.id,
              uri: PlaylistTrackObject.track.uri,
              duration_ms: PlaylistTrackObject.track.duration_ms,
              name: PlaylistTrackObject.track.name,
              popularity: PlaylistTrackObject.track.popularity,
              artists: PlaylistTrackObject.track.artists.map((artist: SimplifiedArtist) => ({
                  name: artist.name
              })),
              album: {
                  images: PlaylistTrackObject.track.album.images,
                  name: PlaylistTrackObject.track.album.name
              },
              audioFeatures: audioFeatures
          });
      }

      return {
          description,
          external_urls,
          images,
          name,
          owner: simplifiedOwner,
          tracks: simplifiedTracks
      };
  } catch (error) {
      console.error('Error fetching playlist details:', error);
      return null;
  }
}

export async function deletePlaylistItem(token: string, playlistId: string, itemId: string): Promise<boolean> {
  const url = `${apiEndpoint}/playlists/${playlistId}/tracks`;
  const data = {
    tracks: [{ uri: `spotify:track:${itemId}` }]
  };
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: data // In axios.delete, data must be passed in the options object
    });
    return response.status === 200; // Or check for other appropriate success status codes based on Spotify's API
  } catch (error) {
    console.error('Error removing track from playlist:', error);
    return false;
  }
}

export const getCurrentUser = async (token: string): Promise<string> => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data.id;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

