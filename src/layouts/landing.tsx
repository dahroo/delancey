import React from 'react';
import ConnectButton from '../components/landing/connectButton';
import { BsSuitSpadeFill } from "react-icons/bs";
import HoverIcon from '../components/landing/hoverIcon';

const Landing: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center ml-3 mr-3 mb-48'>
      <h1 className='text-5xl mt-48'>delancey</h1>

      <div className='max-w-[400px] text-justify mt-7'>
        <p className='italic text-gray-700'>"I saw the angel in the marble and carved until I set him free." -- Michelangelo</p>

        <p className='mt-7'>the missing link between spotify and your perfect set. </p>
        <p> sort your playlists by bpm and tempo, amongst other features. </p>

        <p className='mt-7'> 
          delancey is best used reductively - pruning playlists into coherence, rather than building coherence from scratch.
        </p>

        <p className='mt-7'> 
          delancey is <a href='https://github.com/dahroo/delancey' target="_blank" rel="noopener noreferrer" className='text-gray-700 hover:italic'>open-source. </a>
          at the moment, delancey is in beta and only available with spotify premium.
          contact <a href='https://x.com/zzblyx' target="_blank" rel="noopener noreferrer" className='text-gray-700 hover:italic'>@zzblyx</a> to register.
        </p>
      </div>
      <ConnectButton />
      <div className='mt-7'>
        <HoverIcon icon={BsSuitSpadeFill} size={16} color="black" hoverColor='blue' />
      </div>

    </div>
  );
};

export default Landing;
