interface ExternalUrl {
  spotify: string;
}
interface PlaylistOwnerFollowers {
  href: string | null; // Always null as per Spotify's current API
  total: number;
}
interface PlaylistOwner {
  external_urls: ExternalUrl;
  followers: PlaylistOwnerFollowers;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string | null;
}
interface PlaylistTracksLink {
  href: string;
  total: number;
}
export interface SimplifiedArtist {
  name: string;
}
interface SimplifiedAlbum {
  images: SpotifyApi.ImageObject[];
  name: string;
}
export interface SpotifyUserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
      filter_enabled: boolean,
      filter_locked: boolean
  },
  external_urls: { spotify: string; };
  followers: { href: string; total: number; };
  href: string;
  id: string;
  images: SpotifyApi.ImageObject[];
  product: string;
  type: string;
  uri: string;
}

export interface PlaylistPreview {
  id: string;
  imageUrl: string;
  name: string;
  ownerDisplayName: string;
}

export interface SimplifiedPlaylistObject {
  collaborative: boolean;
  description: string | null;
  external_urls: ExternalUrl;
  href: string;
  id: string;
  images: SpotifyApi.ImageObject[];
  name: string;
  owner: PlaylistOwner;
  public: boolean | null;
  snapshot_id: string;
  tracks: PlaylistTracksLink;
  type: string;
  uri: string;
}

export interface Playlists_TrackObject {
  id: string;
  external_urls: ExternalUrl;
  duration_ms: number;
  name: string;
  popularity: number;
  artists: SimplifiedArtist[];
  album: SimplifiedAlbum;
  audioFeatures: TrackAudioFeatures | null;
  uri: string;
}

export interface Playlists_PlaylistTrackObject {
  track: Playlists_TrackObject;
}
export interface Playlists_tracks_items {
  items: Playlists_PlaylistTrackObject[];
}

export interface SimplifiedPlaylist {
  description: string | null;
  external_urls: ExternalUrl
  images: SpotifyApi.ImageObject[];
  name: string;
  owner: SimpleOwner;
  tracks: Playlists_TrackObject[];
}

interface SimpleOwner {
  id: string;
  display_name: string | undefined;
}

export interface TrackAudioFeatures {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
  mode: number;
  key: number;
}
