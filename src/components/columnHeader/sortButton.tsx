import React from 'react';
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";


interface SortButtonProps {
  label: string;
  column: string;
  currentSort: string | null;
  currentOrder: 'asc' | 'desc' | null;
  onClick: (column: string) => void;
}

export const SortButton: React.FC<SortButtonProps> = ({ label, column, currentSort, currentOrder, onClick }) => {
  return (
    <button
      className="flex w-full bg-black text-white px-4 py-1 justify-center rounded-full items-center min-w-0 hover:italic"
      onClick={() => onClick(column)}
    >
      <p className='truncate mr-2'>{label}</p>
      {currentSort === column && (
        currentOrder === 'asc' ? <FaChevronCircleUp/>: <FaChevronCircleDown/>
      )}
    </button>
  );
};