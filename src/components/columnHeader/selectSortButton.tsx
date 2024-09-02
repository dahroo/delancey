import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown, FaMinus } from 'react-icons/fa';

interface SelectSortButtonProps {
  label: string;
  column: string;
  currentSort: string | null;
  currentOrder: 'asc' | 'desc' | null;
  onSort: (column: string) => void;
  onSelect: (column: string) => void;
  options: string[];
}

export const SelectSortButton: React.FC<SelectSortButtonProps> = ({
  label,
  column,
  currentSort,
  currentOrder,
  onSort,
  onSelect,
  options
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderSortIcon = () => {
    if (currentSort !== column) {
      return <FaMinus/>;
    }
    return currentOrder === 'asc' ? <FaChevronUp/> : <FaChevronDown/>;
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex flex-row">
        <button
          className="flex-grow min-w-0 overflow-hidden text-ellipsis whitespace-nowrap items-center text-left hover:italic hover:font-bold"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className=''>{label}</span>
        </button>
        <button
          className="items-center hover:bg-gray-100 pl-2 pr-2 flex-shrink-0"
          onClick={() => onSort(column)}
        >
          {renderSortIcon()}
        </button>
      </div>

      {isOpen && (
        <div className="absolute min-w-[139px] flex flex-col z-10 bg-white border-b border-l border-r border-black w-full">
          {options.map((option) => (
            <button
              key={option}
              className="border-b border-gray-200 last:border-b-0 text-left hover:font-bold hover:italic"
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};