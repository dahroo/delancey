import React from 'react';
import LogoutButton from './logoutButton';
import { getSpotifyProfile } from '../../api/spotifyApi';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../app/contexts/authContext';
import { PlaybackContext } from '../../app/contexts/playbackContext';
import { SpotifyUserProfile } from '../../api/types';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoPauseSharp, IoPlaySharp } from "react-icons/io5";
import { HomeButton } from './homeButton';

const Navbar: React.FC = () => {
  const [profile, setProfile] = useState<SpotifyUserProfile | null>(null);
  const { token } = useContext(AuthContext);
  const { 
    currentTrack,
    isPlaying,
    progressMs,
    handlePlayPause,
    handlePrevious,
    handleNext,
    handleSeek
  } = useContext(PlaybackContext);

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTrack) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const positionMs = Math.floor(percentage * currentTrack.durationMs);
      handleSeek(positionMs);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) return "happy late night";
    if (hour >= 6 && hour < 12) return "good morning";
    if (hour >= 12 && hour < 17) return "good afternoon";
    return "good evening";
  };


  useEffect(() => {
    if (token) {
      getSpotifyProfile(token).then((data) => setProfile(data));
    }
  }, [token]); 

  if (!profile) return <div>guest</div>;

  return (
    <nav className='row-span-1 w-full grid grid-rows-[auto_auto_1fr] gap-px bg-black p-px border border-black'>
      {/*profile*/}
      <div className='flex flex-row justify-between bg-white pl-1 pr-1'>
        <p>{getGreeting()}, {profile.display_name}</p>
        <div className='flex flex-row'>
          <HomeButton />
          <LogoutButton />
        </div>

      </div>
      {/*song name/controls*/}
      {currentTrack && (
        <div className='flex items-center bg-white pl-1 pr-1'>
          <div className="mr-4">
            {currentTrack.name} - {currentTrack.artists.join(', ')}
          </div>
          <button onClick={handlePrevious} className="pl-2 pr-2 pt-1 pb-1 hover:bg-gray-200"> <FaChevronLeft/> </button>
          <button onClick={handlePlayPause} className="pl-2 pr-2 pt-1 pb-1 hover:bg-gray-200">
            {isPlaying ? <IoPauseSharp/> : <IoPlaySharp/>}
          </button>
          <button onClick={handleNext} className="pl-2 pr-2 pt-1 pb-1 hover:bg-gray-200"> <FaChevronRight/> </button>
        </div>
      )}
      {/*progress bar*/}
      {currentTrack && (
        <div 
          className="w-full min-h-[18px] bg-gray-200 cursor-pointer" 
          onClick={handleSeekClick}
        >
          <div 
            className="h-full bg-green-500" 
            style={{ width: `${(progressMs / currentTrack.durationMs) * 100}%` }}
          ></div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
