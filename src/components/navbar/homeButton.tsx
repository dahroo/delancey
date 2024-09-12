import { useNavigate } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";

export const HomeButton: React.FC = () => {

    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/home')
    }

    return (
    <button 
        onClick={handleHome} 
        className='flex items-center justify-center rounded-full bg-black p-3 text-white transition-all duration-300 ease-in-out hover:bg-blue-700'>
        <GoHomeFill size={20}/>
    </button>
    );
};

