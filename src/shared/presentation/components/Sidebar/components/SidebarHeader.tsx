import React from 'react';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { ChevronLeft } from 'lucide-react';
import { FaList } from 'react-icons/fa';
import './SidebarHeader.css';
import { IoWater } from 'react-icons/io5';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  toggleSidebar
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      className={`sidebar-header ${isCollapsed ? 'collapsed' : 'expanded'} ${isDark ? 'dark' : ''
        }`}
    >
      {!isCollapsed && (
        <div className="brand-wrapper">
          <div className="icon-water-wrapper">
            <IoWater size={22} />
          </div>
          <div className="brand-text-container">
            <span className="brand-title">EPAA-AA</span>
            <span className="brand-subtitle">Antonio Ante</span>
          </div>
        </div>
      )}
      <Tooltip
        title={isCollapsed ? 'Expandir' : 'Contraer'}
        placement="right"
        arrow
      >
        <IconButton
          onClick={toggleSidebar}
          size="small"
          className={`toggle-button ${isCollapsed ? 'collapsed' : 'expanded'}`}
        >
          {isCollapsed ? <FaList size={18} /> : <ChevronLeft size={20} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};
