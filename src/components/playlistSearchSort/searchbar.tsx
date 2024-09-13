import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void; // Callback to communicate the search term to the parent
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className='flex flex-grow justify-center items-center my-3 mx-3'>
      <input
        type="text"
        placeholder="search your playlists..."
        value={value}
        className="flex flex-grow min-w-[300px] text-xl rounded-full bg-gray-200 text-black placeholder-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-700 pl-5"
        onChange={(e) => onChange(e.target.value)}
      /> 
    </div>
    
  );
};

export default SearchBar;
