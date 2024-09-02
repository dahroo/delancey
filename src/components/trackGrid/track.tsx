import React from 'react';
import { Playlists_TrackObject } from '../../api/types';
import { formatDuration, pitchClassToKey } from '../../utils/utils';
import { useState } from 'react';

interface TrackProps {
    track: Playlists_TrackObject;
    removeTrack: (trackId: string) => void;
    selectedFeatures: string[];
    onPlay: (trackUri: string) => void;
    isOwner: boolean;
}

export const TrackCard: React.FC<TrackProps> = ({ track, removeTrack, selectedFeatures, onPlay, isOwner }) => {
    const [isHovered, setIsHovered] = useState(false);
    console.log(track)
    const getFeatureValue = (feature: string) => {
        if (!track.audioFeatures) return "N/A";
        return track.audioFeatures[feature as keyof typeof track.audioFeatures]?.toFixed(2) || "N/A";
    };

    return (
        <div 
            id={track.id} 
            className="grid grid-cols-10 gap-1 items-center border border-black hover:bg-gray-200 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onPlay(track.uri)}
        >
            <div className="col-span-2 flex items-center">
                <img src={track.album.images[0].url} alt="Cover" style={{ width: 50, height: 50 }} className="flex-none"/>
                <div className="ml-2 overflow-hidden">
                    <a 
                        className="text-lg font-bold block whitespace-nowrap overflow-hidden text-ellipsis hover:italic"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={track.external_urls['spotify']}
                    >
                        {track.name}
                    </a>
                    <p className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{track.artists.map(artist => artist.name).join(', ')}</p>
                </div>
            </div>
            {/* User Chosen Features */}
            {selectedFeatures.map((feature, index) => (
                <p key={index} className="col-span-1 text-sm">{getFeatureValue(feature)}</p>
            ))}
            {/* Popularity */}
            <p className="col-span-1 text-sm">{track.popularity}</p>
            {/* Key + Mode */}
            <p className="col-span-1 text-sm">
                {track.audioFeatures ? `${pitchClassToKey(track.audioFeatures.key)} 
                ${track.audioFeatures.mode === 1 ? 'maj' : 'min'}` : "Key/Mode N/A"}
            </p>
            {/* BPM */}
            <p className="col-span-1 text-sm">
                {track.audioFeatures ? track.audioFeatures.tempo.toFixed(1) : "BPM N/A"}
            </p>
            {/* Duration */}
            <p className="col-span-1 text-sm">{formatDuration(track.duration_ms)}</p>
            {/* Remove */}
            {isOwner && (
                <div 
                    className="col-span-1 cursor-pointer text-sm hover:italic hover:font-bold" 
                    style={{ opacity: isHovered ? 1 : 0 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        removeTrack(track.id);
                    }}
                >
                    remove
                </div>
            )}

        </div>
    );
}
