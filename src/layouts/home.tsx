import { useEffect, useState, useContext } from 'react';
import { PlaylistPreview } from '../api/types';
import { AuthContext } from '../app/contexts/authContext';
import { getUserPlaylists } from '../api/spotifyApi';
import PlaylistGrid from '../components/playlistGrid/playlistGrid';
import SearchBar from '../components/playlistSearchSort/searchbar';

const HomeLayout: React.FC = () => {
  const [playlists, setPlaylists] = useState<PlaylistPreview[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<PlaylistPreview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { token, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      console.error('Authentication error: Token is missing');
      logout();
      return; 
    }
    const fetchPlaylists = async () => {
      const fetchedPlaylists = await getUserPlaylists(token);
      if (fetchedPlaylists) {
        setPlaylists(fetchedPlaylists);
      }
    };
    fetchPlaylists();
  }, [token, logout]);

  useEffect(() => {
    const filtered = playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlaylists(filtered);
  }, [searchTerm, playlists]);

  return (
    <div className='w-full h-full grid-rows-[auto_1fr]'>
      <div className='row-span-1 '>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className='row-span-1'>
        <PlaylistGrid playlists={filteredPlaylists}/>
      </div>
    </div>
  );
};


export default HomeLayout;
