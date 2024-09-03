import React from "react";
import { PlaylistPreview } from "../../api/types";
import { PlaylistPreviewCard } from "./playlistPreview";
import { Footer } from "../footer/footer";

// Define a type for the props
interface PlaylistGridProps {
  playlists: PlaylistPreview[]; // Array of unique IDs
}


const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists }) => {
  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-2 w-full"
        style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr ))',
            gridAutoRows: '1fr',
        }}
      >
        {playlists.map((preview) => (
          <PlaylistPreviewCard key={preview.id} playlist={preview} />
        ))}
      </div>
      <Footer/>
    </div>
  );
};


export default PlaylistGrid;
