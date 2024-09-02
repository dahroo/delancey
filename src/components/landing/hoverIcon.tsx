import { useState } from 'react';
import { IconType } from 'react-icons';

interface HoverIconProps {
  icon: IconType;
  size?: number;
  color?: string;
  hoverColor?: string;
}

const HoverIcon: React.FC<HoverIconProps> = ({ 
  icon: Icon, 
  size = 24, 
  color = 'black', 
  hoverColor = 'blue' 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        isHovered ? 'transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon
        size={size}
        color={isHovered ? hoverColor : color}
        className="transition-colors duration-500 ease-in-out"
      />
    </div>
  );
};

export default HoverIcon;