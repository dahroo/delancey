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
    <div className="w-full p-4 overflow-hidden">
      <div className="flex flex-col space-y-4">
        {playlists.map((preview) => (
          <PlaylistPreviewCard key={preview.id} playlist={preview} />
        ))}
      </div>
      <Footer />
    </div>
  );
};


export default PlaylistGrid;
