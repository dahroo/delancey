import React, { useState, useRef, useEffect } from 'react';
import { FaChevronCircleUp, FaChevronCircleDown, FaMinus } from 'react-icons/fa';

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current && buttonRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      const leftOffset = buttonRect.left + (buttonRect.width / 2) - (dropdownRect.width / 2);
      const topOffset = buttonRect.bottom + window.scrollY + 10;

      dropdownRef.current.style.left = `${leftOffset}px`;
      dropdownRef.current.style.top = `${topOffset}px`;
    }
  }, [isOpen]);

  const renderSortIcon = () => {
    if (currentSort !== column) {
      return <FaMinus size={24}/>;
    }
    return currentOrder === 'asc' ? <FaChevronCircleUp size={24}/> : <FaChevronCircleDown size={24}/>;
  };

  return (
    <div className="relative" ref={buttonRef}>
      <div className="flex flex-row">
        <button
          className="flex-grow min-w-0 overflow-hidden text-ellipsis whitespace-nowrap items-center text-center bg-blue-700 text-white px-4 py-1 rounded-full hover:italic"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className=''>{label}</span>
        </button>
        <button
          className="items-center hover:bg-gray-100 rounded-full pl-2 pr-2 ml-1 flex-shrink-0"
          onClick={() => onSort(column)}
        >
          {renderSortIcon()}
        </button>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed min-w-[180px] flex flex-col z-10 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
        >
          {options.map((option) => (
            <button
              key={option}
              className="px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-100 focus:outline-none transition-colors duration-150 ease-in-out"
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