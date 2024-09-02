import React from 'react';
import { redirectToSpotifyLogin } from '../../api/spotifyAuth';

const ConnectButton: React.FC = () => {
  return <button className="mt-7 hover:italic hover:font-bold" onClick={redirectToSpotifyLogin}>connect to spotify</button>;
};

export default ConnectButton;
