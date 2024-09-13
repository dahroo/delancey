import React, { useContext, useCallback } from 'react';
import LogoutButton from './logoutButton';
import { AuthContext } from '../../app/contexts/authContext';
import { PlaybackContext } from '../../app/contexts/playbackContext';
import { FaChevronCircleLeft, FaChevronCircleRight, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { HomeButton } from './homeButton';

const Navbar: React.FC = () => {
  const { profile } = useContext(AuthContext);
  const { 
    currentTrack,
    isPlaying,
    progressMs,
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleSeek
  } = useContext(PlaybackContext);

  const handleSeekClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTrack) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const positionMs = Math.floor(percentage * currentTrack.durationMs);
      handleSeek(positionMs);
    }
  }, [currentTrack, handleSeek]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) return "happy late night";
    if (hour >= 6 && hour < 12) return "good morning";
    if (hour >= 12 && hour < 17) return "good afternoon";
    return "good evening";
  };

  if (!profile) return <div>guest</div>;

  return (
    <nav className='row-span-1 w-full grid grid-rows-[auto_auto_auto] border-b-2 border-black text-xl font-bold p-3'>
      {/* profile */}
      <div className='flex flex-row justify-between items-center bg-white pl-2 pr-2 mb-2'>
        <p>{getGreeting()}, {profile.display_name}</p>
        <div className='flex flex-row'>
          <HomeButton />
          <LogoutButton />
        </div>
      </div>
      
      {/* song name/controls */}
      {currentTrack && (
        <div className='flex items-center pl-2 pr-2 bg-gray-300 rounded-full px-4 py-1 mb-2 mx-1'>
          <div className="mr-4 truncate flex-grow">
            {currentTrack.name} - {currentTrack.artists.join(', ')}
          </div>
          <button onClick={handlePrevious} className="p-1 rounded-full hover:bg-gray-200 transition-colors"> 
            <FaChevronCircleLeft size={24}/> 
          </button>
          <button onClick={handlePlayPause} className="p-1 rounded-full hover:bg-gray-200 transition-colors mx-1">
            {isPlaying ? <FaPauseCircle size={24}/> : <FaPlayCircle size={24}/>}
          </button>
          <button onClick={handleNext} className="p-1 rounded-full hover:bg-gray-200 transition-colors"> 
            <FaChevronCircleRight size={24}/> 
          </button>
        </div>
      )}
      
      {/* progress bar */}
      {currentTrack && (
        <div className="px-2">
          <div 
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative"
            onClick={handleSeekClick}
          >
            <div 
              className="h-full bg-blue-700 rounded-full relative"
              style={{ width: `${(progressMs / currentTrack.durationMs) * 100}%` }}
            >
              <div 
                className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-700 rounded-full shadow-md"
              ></div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;