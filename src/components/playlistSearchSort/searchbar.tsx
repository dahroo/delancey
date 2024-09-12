import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void; // Callback to communicate the search term to the parent
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className='w-full flex justify-center items-center'>
      <input
        type="text"
        placeholder="search your playlists..."
        value={value}
        className="flex flex-grow min-w-[400px] m-3 text-xl rounded-full bg-black text-white placeholder-gray-400 p-2 focus:outline-none focus:ring-0 pl-5"
        onChange={(e) => onChange(e.target.value)}
      /> 
    </div>
    
  );
};

export default SearchBar;
