import React from 'react';
import { SortButton } from './sortButton';
import { SelectSortButton } from './selectSortButton';

interface ColumnHeaderProps {
  currentSort: string | null;
  currentOrder: 'asc' | 'desc' | null;
  onSort: (column: string) => void;
  onSelectFeature: (index: number, feature: string) => void;
  selectedFeatures: string[];
}

const audioFeatures = [
  'acousticness', 'danceability', 'energy', 'instrumentalness',
  'liveness', 'loudness', 'speechiness', 'valence'
];

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ 
  currentSort, 
  currentOrder, 
  onSort,
  onSelectFeature,
  selectedFeatures
}) => {

  return (
    <div className="grid grid-cols-10 items-center border border-black sticky top-0 bg-white">
      <div className='col-span-2 m-2'>
        <SortButton label="track" column="name" currentSort={currentSort} currentOrder={currentOrder} onClick={onSort} />
      </div>
      {[0, 1, 2].map((index) => (
        <div key={index} className={`col-span-1 m-2`}>
          <SelectSortButton
            label={selectedFeatures[index] || "<select>"}
            column={selectedFeatures[index]}
            currentSort={currentSort}
            currentOrder={currentOrder}
            onSort={onSort}
            onSelect={(feature) => onSelectFeature(index, feature)}
            options={audioFeatures}
          />
        </div>
      ))}
      <div className='m-2'>
        <SortButton label="popularity" column="popularity" currentSort={currentSort} currentOrder={currentOrder} onClick={onSort} />
      </div>
      <div className='m-2'>
        <SortButton label="key" column="key" currentSort={currentSort} currentOrder={currentOrder} onClick={onSort} />
      </div>
      <div className='m-2'>
        <SortButton label="bpm" column="bpm" currentSort={currentSort} currentOrder={currentOrder} onClick={onSort} />
      </div>
      <div className='m-2'>
        <SortButton label="duration" column="duration" currentSort={currentSort} currentOrder={currentOrder} onClick={onSort} />
      </div>
    </div>
  );
};