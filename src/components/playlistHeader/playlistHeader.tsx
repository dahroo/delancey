import { FaSpotify } from "react-icons/fa";

interface PlaylistHeaderProps {
    name: string;
    description: string;
    image: string; // URL of the image
    owner: string; // Owner's display name
    trackCount: number;
    totalDuration: string;
    playlistURL: string;
    onRefresh: () => void;
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
    name, 
    description, 
    image, 
    owner, 
    trackCount, 
    totalDuration, 
    playlistURL,
    onRefresh
}) => {
    return (
        <div className="flex border border-black w-full min-h-[100px] overflow-hidden">
            <div className="flex flex-row items-center gap-2 overflow-hidden w-full">
                <img src={image} alt="Playlist cover" style={{ width: 100, height: 100 }} className="flex-none"/>
                <div className="flex flex-col overflow-hidden w-full">
                    <a href={playlistURL} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:italic truncate">{name}</a>
                    <p className="text-sm">{description}</p>
                    <p className="text-sm">{trackCount} tracks, {totalDuration}</p>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-sm">c.o. {owner}</p>
                        <div className="flex flex-row items-center">
                            <button onClick={onRefresh} className="hover:italic hover:font-bold">REFRESH PLAYLIST</button>
                            <FaSpotify className="mr-3 ml-3"/>
                        </div>

                    </div>
                    
                </div>
            </div>
        </div>
        
    )
}