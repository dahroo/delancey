import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../app/contexts/authContext';

const LogoutButton: React.FC = () => {
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout(); // Clear the token via context
  };

  return (
    <button onClick={handleLogout} className='ml-5 hover:italic hover:font-bold'>
      log out
    </button>
  );
};

export default LogoutButton;
