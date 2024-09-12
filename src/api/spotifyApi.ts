import axios from 'axios';
import {
        PlaylistPreview, 
        SimplifiedPlaylistObject, 
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
        const largestImage = item.images.reduce((largest: SpotifyApi.ImageObject | null, image: SpotifyApi.ImageObject) => {
          // If the current image has no width, consider it as width 0
          const currentWidth = image.width ?? 0;
          
          // If there's no largest image yet, or if the current image is wider
          if (!largest || currentWidth > (largest.width ?? 0)) {
            return image;
          }
          
          return largest;
        }, null);
      
        imageUrl = largestImage?.url ?? '';
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

export async function getPlaylist(playlistId: string): Promise<SimplifiedPlaylist | null> {


  try {
    const playlist = await callSpotifyApi(api => 
      api.getPlaylist(playlistId)
        .then(response => response.body)
    );

    if (!playlist) {
      console.error('Failed to fetch playlist');
      return null;
    }
  
    const { description, images, name, owner, tracks, external_urls } = playlist;

    const simplifiedOwner = {
      display_name: owner.display_name,
      id: owner.id,
    };

    const trackIds = tracks.items
    .map((item: SpotifyApi.PlaylistTrackObject) => item.track?.id)
    .filter((id): id is string => id != null);
  
    const audioFeatures = await callSpotifyApi(api => 
      api.getAudioFeaturesForTracks(trackIds)
        .then(response => response.body)
    );

    if(!audioFeatures) {
      console.error('Failed to fetch audio features');
      return null;
    }

    const audioFeaturesMap = new Map(
      audioFeatures.audio_features.map((feature: SpotifyApi.AudioFeaturesObject) => [feature.id, feature])
    );

    const simplifiedTracks: Playlists_TrackObject[] = tracks.items
    .filter((item): item is SpotifyApi.PlaylistTrackObject & { track: NonNullable<SpotifyApi.PlaylistTrackObject['track']> } => 
      item !== null && item.track !== null
    )
    .map((PlaylistTrackObject) => {
      const track = PlaylistTrackObject.track;
      const trackId = track.id;
      const audioFeatures = audioFeaturesMap.get(trackId);
  
      return {
        id: trackId ?? '',
        external_urls: track.external_urls ?? {},
        uri: track.uri ?? '',
        duration_ms: track.duration_ms ?? 0,
        name: track.name ?? '',
        popularity: track.popularity ?? 0,
        artists: (track.artists ?? []).map((artist) => ({
          name: artist?.name ?? 'Unknown Artist'
        })),
        album: {
          images: track.album?.images ?? [],
          name: track.album?.name ?? 'Unknown Album'
        },
        audioFeatures: audioFeatures ?? null
      };
    });

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


