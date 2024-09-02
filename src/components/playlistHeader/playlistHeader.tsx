interface PlaylistHeaderProps {
    name: string;
    description: string;
    image: string; // URL of the image
    owner: string; // Owner's display name
    trackCount: number;
    totalDuration: string;
    playlistURL: string;
}

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({name, description, image, owner, trackCount, totalDuration, playlistURL}) => {
    return (
        <div className="flex flex-row items-center border border-black gap-2">
            <img src={image} alt="Playlist cover" style={{ width: 100, height: 100 }} className="flex-none"/>
            <div className="flex flex-col">
                <a href={playlistURL} target="_blank" rel="noopener noreferrer" className="text-xl font-bold hover:italic">{name}</a>
                <p className="text-sm">{description}</p>
                <p className="text-sm">{trackCount} tracks, {totalDuration}</p>
                <p className="text-sm">c.o. {owner}</p>
            </div>
        </div>
    )
}