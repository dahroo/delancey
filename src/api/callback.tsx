import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeCodeForToken } from './spotifyAuth';
import { AuthContext } from '../app/contexts/authContext';

const SpotifyCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useContext(AuthContext);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');

      if (code) {
        const accessToken = await exchangeCodeForToken(code);
        if (accessToken) {
          setToken(accessToken);
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
  }, [navigate, location, setToken]);

  return <div>loading...</div>;
};

export default SpotifyCallback;