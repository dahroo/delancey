import React from "react";
import { PlaylistPreview } from "../../api/types";
import { useNavigate } from "react-router-dom";

interface PlaylistPreviewCardProps {
    playlist: PlaylistPreview
}

export const PlaylistPreviewCard: React.FC<PlaylistPreviewCardProps> = ({ playlist }) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate(`/playlist/${playlist.id}`);
    }

    return (
        <div 
            className="flex flex-row w-full bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"
            onClick={handleCardClick}
        >
            <div className="relative w-32 h-32 flex-shrink-0">
                {playlist.imageUrl ? (
                    <img 
                        src={playlist.imageUrl} 
                        alt={`Cover for ${playlist.name}`} 
                        className="absolute top-0 left-0 w-full h-full object-cover" 
                    />
                ) : (
                    <div className="absolute top-0 left-0 w-full h-full bg-black" />
                )}
            </div>
            <div className="flex flex-col justify-center px-4 overflow-hidden">
                <p className="text-3xl font-bold truncate">{playlist.name}</p>
                <p className="text-lg text-gray-600 truncate">{playlist.ownerDisplayName}</p>
            </div>
        </div>
    )
}