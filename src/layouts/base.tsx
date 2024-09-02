import React from 'react';
import Navbar from '../components/navbar/navbar';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='h-screen w-screen grid grid-rows-[auto_1fr]'>
      <Navbar/>
      <div className='row-span-1 overflow-auto'>
        {children}
      </div>
    </div>
  );
};

export default BaseLayout;
