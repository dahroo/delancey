import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeCodeForToken } from './spotifyAuth';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');

      if (code) {
        const accessToken = await exchangeCodeForToken(code);
        if (accessToken) {
          localStorage.setItem("spotify_access_token", accessToken);
          // Token exchange successful
          console.log('Access token obtained bruv');
          // Navigate to a success page or your app's main page
          navigate('/home'); 
          console.log('called navigate to home')
        } else {
          // Token exchange failed
          console.error('Failed to obtain access token');
          navigate('/'); // Redirect to login page or error page
        }
      } else {
        // No code in URL, something went wrong
        console.error('No code found in URL');
        navigate('/'); // Redirect to login page or error page
      }
    };
    handleCallback();
  }, [navigate, location]);

  return <div>loading...</div>;
};

export default SpotifyCallback;