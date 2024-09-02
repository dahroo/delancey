import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void; // Callback to communicate the search term to the parent
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className='relative w-full'>
      <input
        type="text"
        placeholder="search your playlists..."
        value={value}
        className="w-full focus:outline-none focus:ring-0 pl-7"
        onChange={(e) => onChange(e.target.value)}
      /> 
      <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
        <FaSearch />
      </div> 
    </div>
    
  );
};

export default SearchBar;
