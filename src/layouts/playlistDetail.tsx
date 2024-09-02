import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../app/contexts/authContext';
import { PlaybackContext } from '../app/contexts/playbackContext';
import { getPlaylist } from '../api/spotifyApi';
import { SimplifiedPlaylist, Playlists_TrackObject } from '../api/types';
import { PlaylistHeader } from '../components/playlistHeader/playlistHeader';
import { TrackGrid } from '../components/trackGrid/trackGrid';
import { formatDuration } from '../utils/utils';
import { deletePlaylistItem } from '../api/spotifyApi';

const getTrackCount = (tracks: Playlists_TrackObject[] ) => tracks.length;

const getTotalDuration = ( tracks: Playlists_TrackObject[] ) => {
    return tracks.reduce((total, track) => total + track.duration_ms, 0);
};

export const PlaylistDetailLayout: React.FC = () => {
    const { playlistId } = useParams<{ playlistId: string | undefined }>();
    const [playlist, setPlaylist] = useState<SimplifiedPlaylist | null>();
    const { token, logout, profile } = useContext(AuthContext);
    const { handlePlayTrackInContext } = useContext(PlaybackContext)

    const handlePlayTrack = useCallback((trackUri: string) => {
        if (!token) {
            console.error('Authentication error: Token is missing');
            logout();
            return; 
        }
        if (playlist && playlistId) {
            handlePlayTrackInContext(playlistId, trackUri);
        }
    }, [playlist, playlistId, token, logout, handlePlayTrackInContext]);

    const fetchPlaylistDetails = useCallback(async () => {
        if (!token) {
            console.error('Authentication error: Token is missing');
            logout();
            return; 
        }
        if (playlistId) {
            try {
                const fetchedPlaylist = await getPlaylist(token, playlistId);
                setPlaylist(fetchedPlaylist);
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        }
    }, [playlistId, token, logout]);  

    useEffect(() => {
        fetchPlaylistDetails();
    }, [fetchPlaylistDetails]); 

    const handleTrackRemoved = useCallback(async (trackId: string) => {
        if (!playlist || !playlistId || !token) return;

        // Optimistically update the UI
        setPlaylist(prevPlaylist => {
            if (!prevPlaylist) return null;
            return {
                ...prevPlaylist,
                tracks: prevPlaylist.tracks.filter(track => track.id !== trackId)
            };
        });

        // Perform the actual API call
        try {
            await deletePlaylistItem(token, playlistId, trackId);
        } catch (error) {
            console.error('Error removing track:', error);
            // If the API call fails, revert the optimistic update
            fetchPlaylistDetails();
        }
    }, [playlist, playlistId, token, fetchPlaylistDetails]);

    if (!playlist) {
        return <div className='justify-center w-full h-full flex flex-row items-center'>loading...</div>;
    }

    if (!playlistId) {
        return <div>Playlist ID is missing.</div>;
    }

    const trackCount = getTrackCount(playlist.tracks);
    const totalDuration = formatDuration(getTotalDuration(playlist.tracks));
    const isOwner = playlist.owner.id === profile?.id;

    return (
        <div className='h-full w-full grid grid-rows-[auto_auto_1fr]'>
            <PlaylistHeader
                name={playlist.name}
                description={playlist.description || "<no description provided>"}
                image={playlist.images[0].url} // Ensure there is an image, or handle the case when it's missing
                owner={playlist.owner.display_name || "<anonymous>"}
                trackCount={trackCount}
                totalDuration={totalDuration}
                playlistURL={playlist.external_urls['spotify']}
            />
            <TrackGrid 
                tracks={playlist.tracks} 
                onTrackRemoved={handleTrackRemoved} 
                onPlay={handlePlayTrack}
                isOwner={isOwner}
            />
        </div>
    );
};

export default PlaylistDetailLayout;
