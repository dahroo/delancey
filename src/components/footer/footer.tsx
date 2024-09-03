import HoverIcon from "../landing/hoverIcon";
import { BsSuitSpadeFill } from "react-icons/bs";

export const Footer: React.FC = () => {
  return (

    <div className='flex flex-col items-center justify-center mt-3 mb-3 text-sm'>
        <HoverIcon icon={BsSuitSpadeFill} size={16} color="black" hoverColor='blue' />
        delancey, courtesy of spotify.
    </div>
  );
};

