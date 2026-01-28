import React from 'react';
import '@/shared/presentation/styles/Avatar.css';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = 'md',
  className = '',
  onClick
}) => {
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getRandomColor = (name: string) => {
    const colors = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#ec4899'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = imageUrl ? 'transparent' : getRandomColor(name || 'User');

  return (
    <div
      className={`avatar avatar--${size} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{ backgroundColor: bgColor }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="avatar__image" />
      ) : (
        <span className="avatar__initials">{getInitials(name || 'User')}</span>
      )}
    </div>
  );
};
