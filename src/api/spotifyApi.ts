import axios from 'axios';
import {
        PlaylistPreview, 
        SimplifiedPlaylistObject, 
        Image, 

        SimplifiedArtist,
        SimplifiedPlaylist,
        Playlists_TrackObject,
        TrackAudioFeatures
} from './types';

import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi: SpotifyWebApi = new SpotifyWebApi({
  clientId: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_REDIRECT_URI
})

async function callSpotifyApi<T>(
  apiMethod: (api: SpotifyWebApi) => Promise<T>
): Promise<T | null> {
  const token = localStorage.getItem('spotify_access_token');
  if (!token) {
    console.error('No Spotify access token found');
    return null;
  }
  
  spotifyApi.setAccessToken(token);
  
  try {
    return await apiMethod(spotifyApi);
  } catch (error) {
    console.error('Error calling Spotify API:', error);
    return null;
  }
}

const apiEndpoint = 'https://api.spotify.com/v1';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getSpotifyProfile(): Promise<SpotifyApi.CurrentUsersProfileResponse | null> {
  return callSpotifyApi(api => api.getMe().then(response => response.body));
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<SpotifyApi.RemoveTracksFromPlaylistResponse | null> {
  const result = await callSpotifyApi(api => 
    api.removeTracksFromPlaylist(playlistId, [{ uri: `spotify:track:${trackId}` }])
      .then(response => response.body)
  );
  if (result === null) {
    console.error('Failed to remove track from playlist');
    return null;
  }
  return result;
}


export async function getUserPlaylists(token: string): Promise<PlaylistPreview[] | null> {

  try {
    const response = await axios.get(`${apiEndpoint}/me/playlists`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const playlists = response.data.items.map((item: SimplifiedPlaylistObject): PlaylistPreview => {
      let imageUrl = '';
      
      if (item.images && item.images.length > 0) {
        const largestImage = item.images.reduce((largest: Image | null, image: Image) => {
          return (!largest || image.width > largest.width) ? image : largest;
        }, null);
        
        imageUrl = largestImage ? largestImage.url : '';
      }

      return {
        id: item.id,
        imageUrl: imageUrl,
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
              external_urls: PlaylistTrackObject.track.external_urls,
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


