import React from 'react';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";


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
      className="flex items-center w-full flex-grow min-w-0 hover:italic hover:font-bold"
      onClick={() => onClick(column)}
    >
      <p className='mr-2 truncate'>{label}</p>
      {currentSort === column && (
        currentOrder === 'asc' ? <FaChevronUp/>: <FaChevronDown/>
      )}
    </button>
  );
};