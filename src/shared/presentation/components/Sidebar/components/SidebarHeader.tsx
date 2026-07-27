import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { ChevronLeft } from 'lucide-react';
import { FaList } from 'react-icons/fa';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  toggleSidebar
}) => (
  <Box
    sx={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: isCollapsed ? 'center' : 'space-between',
      px: isCollapsed ? 1 : 2,
      borderBottom: 1,
      borderColor: 'divider',
      flexShrink: 0
    }}
  >
    {!isCollapsed && (
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          fontSize: '1.25rem',
          letterSpacing: '-0.025em',
          color: 'primary.main',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        EPAA-AA
      </Typography>
    )}
    <Tooltip
      title={isCollapsed ? 'Expandir' : 'Contraer'}
      placement="right"
      arrow
    >
      <IconButton
        onClick={toggleSidebar}
        size="small"
        sx={{
          color: 'text.secondary',
          '&:hover': { color: 'text.primary', bgcolor: 'action.hover' }
        }}
      >
        {isCollapsed ? <FaList size={20} /> : <ChevronLeft size={20} />}
      </IconButton>
    </Tooltip>
  </Box>
);
