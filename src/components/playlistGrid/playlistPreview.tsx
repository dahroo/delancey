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
        <div className="grid grid-rows-4 min-w-[200px] w-full h-full border-2 border-black group cursor-pointer"
             onClick={handleCardClick}>
            <div className="row-span-3 min-w-[200px] min-h-[200px]">
                <img src={playlist.imageUrl} alt={`Cover for ${playlist.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="row-span-1 bg-gray-100 flex flex-col justify-center items-center group-hover:bg-gray-300">
                <p className="text-sm font-bold truncate max-w-[200px] text-center px-2">{playlist.name}</p>
                <p className="text-xs text-gray-600 truncate w-full text-center">{playlist.ownerDisplayName}</p>
            </div>
        </div>
    )
}