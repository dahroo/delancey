import React from 'react';
import { redirectToSpotifyLogin } from '../../api/spotifyAuth';

const ConnectButton: React.FC = () => {
  return <button className="mt-7 flex items-center justify-center rounded-full bg-black px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-300" onClick={redirectToSpotifyLogin}>connect to spotify</button>;
};

export default ConnectButton;
