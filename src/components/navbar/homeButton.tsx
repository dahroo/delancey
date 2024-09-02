import { useNavigate } from 'react-router-dom';

export const HomeButton: React.FC = () => {

    const navigate = useNavigate();

    const handleHome = () => {
        navigate('/home')
    }

    return (
    <button onClick={handleHome} className='hover:italic hover:font-bold'>
        home
    </button>
    );
};

