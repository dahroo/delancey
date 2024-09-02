import React, { useState, useCallback, useMemo } from 'react';
import { TrackCard } from './track';
import { Playlists_TrackObject } from '../../api/types';
import { ColumnHeader } from '../columnHeader/columnHeader';

interface TrackGridProps {
  tracks: Playlists_TrackObject[];
  onTrackRemoved: (trackId: string) => void;
  onPlay: (trackUri: string) => void;
  isOwner: boolean;
}

export const TrackGrid: React.FC<TrackGridProps> = ({ tracks, onTrackRemoved, onPlay, isOwner }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['', '', '']);

  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  }, [sortColumn, sortOrder]);

  const handleSelectFeature = useCallback((index: number, feature: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = [...prev];
      newFeatures[index] = feature;
      return newFeatures;
    });
  }, []);

  const sortedTracks = useMemo(() => {
    if (!sortColumn || !sortOrder) return tracks;

    return [...tracks].sort((a, b) => {
        let aValue, bValue;
  
        if (selectedFeatures.includes(sortColumn)) {
          aValue = a.audioFeatures?.[sortColumn as keyof typeof a.audioFeatures] ?? 0;
          bValue = b.audioFeatures?.[sortColumn as keyof typeof b.audioFeatures] ?? 0;
        } else {
          switch (sortColumn) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'popularity':
              aValue = a.popularity;
              bValue = b.popularity;
              break;
            case 'key':
              aValue = a.audioFeatures?.key ?? -1;
              bValue = b.audioFeatures?.key ?? -1;
              break;
            case 'bpm':
              aValue = a.audioFeatures?.tempo ?? 0;
              bValue = b.audioFeatures?.tempo ?? 0;
              break;
            case 'duration':
              aValue = a.duration_ms;
              bValue = b.duration_ms;
              break;
            default:
              return 0;
          }
        }
  
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [tracks, sortColumn, sortOrder, selectedFeatures]);

  return (
    <div className="flex flex-col">
        <ColumnHeader
            currentSort={sortColumn}
            currentOrder={sortOrder} 
            onSort={handleSort} 
            onSelectFeature={handleSelectFeature}
            selectedFeatures={selectedFeatures}
        />
      <div className="flex-1 overflow-y-auto">
        {sortedTracks.map(track => (
            <TrackCard 
                key={track.id} 
                track={track} 
                removeTrack={onTrackRemoved} 
                selectedFeatures={selectedFeatures}
                onPlay={onPlay}
                isOwner={isOwner}
            />
        ))}
      </div>
    </div>
  );
};