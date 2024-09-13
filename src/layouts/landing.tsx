import React, { useEffect } from 'react';
import ConnectButton from '../components/landing/connectButton';
import { BsSuitSpadeFill } from "react-icons/bs";
import HoverIcon from '../components/landing/hoverIcon';
import "./gradientStyles.css";

const gradientStyles = {
  gradientBg: {
    width: '100vw',
    height: '100vh',
    position: 'relative' as const,
    overflow: 'hidden',
    background: 'linear-gradient(40deg, rgb(108, 0, 162), rgb(0, 17, 82))',
  },
  gradientsContainer: {
    filter: 'url(#goo) blur(40px)',
    width: '100%',
    height: '100%',
  },
  gradientCircle: {
    position: 'absolute' as const,
    width: '80%',
    height: '80%',
    mixBlendMode: 'hard-light' as const,
    top: '10%',
    left: '10%',
    opacity: 1,
  },
  g1: {
    background: 'radial-gradient(circle at center, rgba(18, 113, 255, 0.8) 0, rgba(18, 113, 255, 0) 50%) no-repeat',
    animation: 'moveVertical 30s ease infinite',
  },
  g2: {
    background: 'radial-gradient(circle at center, rgba(221, 74, 255, 0.8) 0, rgba(221, 74, 255, 0) 50%) no-repeat',
    transformOrigin: 'calc(50% - 400px) 50%',
    animation: 'moveInCircle 20s reverse infinite',
  },
  g3: {
    background: 'radial-gradient(circle at center, rgba(100, 220, 255, 0.8) 0, rgba(100, 220, 255, 0) 50%) no-repeat',
    transformOrigin: 'calc(50% + 400px) 50%',
    animation: 'moveInCircle 40s linear infinite',
  },
  g4: {
    background: 'radial-gradient(circle at center, rgba(200, 50, 50, 0.8) 0, rgba(200, 50, 50, 0) 50%) no-repeat',
    transformOrigin: 'calc(50% - 200px) 50%',
    animation: 'moveHorizontal 40s ease infinite',
    opacity: 0.7,
  },
  g5: {
    background: 'radial-gradient(circle at center, rgba(180, 180, 50, 0.8) 0, rgba(180, 180, 50, 0) 50%) no-repeat',
    width: '160%',
    height: '160%',
    top: '-30%',
    left: '-30%',
    transformOrigin: 'calc(50% - 800px) calc(50% + 200px)',
    animation: 'moveInCircle 20s ease infinite',
  },
  interactive: {
    position: 'absolute' as const,
    background: 'radial-gradient(circle at center, rgba(140, 100, 255, 0.8) 0, rgba(140, 100, 255, 0) 50%) no-repeat',
    mixBlendMode: 'hard-light' as const,
    width: '100%',
    height: '100%',
    top: '-50%',
    left: '-50%',
    opacity: 0.7,
  },
};

const Landing: React.FC = () => {
  useEffect(() => {
    const interBubble = document.querySelector<HTMLDivElement>('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    function move() {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      if (interBubble) {
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
      requestAnimationFrame(move);
    }

    window.addEventListener('mousemove', (event) => {
      tgX = event.clientX;
      tgY = event.clientY;
    });

    move();

    return () => {
      window.removeEventListener('mousemove', () => {});
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div style={gradientStyles.gradientBg}>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div style={gradientStyles.gradientsContainer}>
          <div style={{...gradientStyles.gradientCircle, ...gradientStyles.g1}}></div>
          <div style={{...gradientStyles.gradientCircle, ...gradientStyles.g2}}></div>
          <div style={{...gradientStyles.gradientCircle, ...gradientStyles.g3}}></div>
          <div style={{...gradientStyles.gradientCircle, ...gradientStyles.g4}}></div>
          <div style={{...gradientStyles.gradientCircle, ...gradientStyles.g5}}></div>
          <div style={gradientStyles.interactive} className="interactive"></div>
        </div>
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pb-48 pl-3 pr-3 text-white">
        <h1 className="text-5xl mt-48">delancey</h1>

        <div className="max-w-[400px] text-justify mt-7">
          <p className="italic text-gray-300">"I saw the angel in the marble and carved until I set him free." -- Michelangelo</p>

          <p className="mt-7">the missing link between spotify and your perfect set. </p>
          <p> sort your playlists by bpm, key, danceability, and much more.</p>

          <p className="mt-7"> 
            delancey is best on desktop/pc. delancey is <a href="https://github.com/dahroo/delancey" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:italic">open-source. </a>
            at the moment, delancey is in beta and only available with spotify premium.
            contact <a href="https://x.com/zzblyx" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:italic">@zzblyx</a> to register.
          </p>
        </div>
        <ConnectButton />
        <div className="mt-7">
          <HoverIcon icon={BsSuitSpadeFill} size={16} color="white" hoverColor="blue" />
        </div>
      </div>
    </div>
  );
};

export default Landing;