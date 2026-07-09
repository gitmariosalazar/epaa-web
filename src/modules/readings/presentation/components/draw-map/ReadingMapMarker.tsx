import React from 'react';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import '@/modules/readings/presentation/styles/ReadingMap.css';

interface ReadingMapMarkerProps {
  type: 'capture' | 'connection';
  onClick?: () => void;
}

export const ReadingMapMarker: React.FC<ReadingMapMarkerProps> = ({
  type,
  onClick
}) => {
  return (
    <div
      className={['reading-marker-container', `type-${type}`].join(' ')}
      onClick={onClick}
      style={
        {
          cursor: 'pointer',
          '--marker-color': type === 'capture' ? '#3b82f6' : '#10b981',
          '--marker-glow': type === 'capture' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(16, 185, 129, 0.5)'
        } as React.CSSProperties
      }
      role="button"
    >
      <div className="reading-marker-pulse-ring" />
      <div className="reading-marker-pulse-ring ring-2" />

      <div className="reading-marker-core">
        {type === 'capture' ? (
          <FaLocationCrosshairs size={14} color="#fff" />
        ) : (
          <FaHome size={14} color="#fff" />
        )}
      </div>
    </div>
  );
};
