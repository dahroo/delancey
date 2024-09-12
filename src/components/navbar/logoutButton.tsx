import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../app/contexts/authContext';
import { IoLogOut } from "react-icons/io5";

const LogoutButton: React.FC = () => {
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout(); // Clear the token via context
  };

  return (
    <button 
      onClick={handleLogout} 
      className='ml-3 flex items-center justify-center rounded-full bg-black p-3 text-white transition-all duration-300 ease-in-out hover:bg-red-700'>
      <IoLogOut />
    </button>
  );
};

export default LogoutButton;
