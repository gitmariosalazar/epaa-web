import React from 'react';
import { Box, Divider, List, Typography } from '@mui/material';
import type { NavSection } from '@/shared/domain/models/Navigation';
import { SidebarItem } from './SidebarItem';

interface SidebarNavProps {
  sections: NavSection[];
  isCollapsed: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  sections,
  isCollapsed
}) => (
  <Box
    component="nav"
    sx={{
      flex: 1,
      overflowY: 'auto',
      overflowX: isCollapsed ? 'visible' : 'hidden',
      px: 0.75,
      py: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 0.25,
      // Thin custom scrollbar
      '&::-webkit-scrollbar': { width: 4 },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': {
        background: 'divider',
        borderRadius: 10
      }
    }}
  >
    {sections.map((section, index) => (
      <Box key={index} sx={{ mb: 0.5 }}>
        {!isCollapsed && !section.hideTitle && (
          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              py: 0.5,
              display: 'block',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'text.secondary',
              opacity: 0.5,
              mt: index > 0 ? 0.5 : 0,
              userSelect: 'none'
            }}
          >
            {section.title}
          </Typography>
        )}
        {isCollapsed && index > 0 && <Divider sx={{ my: 0.75, mx: 0.5 }} />}
        <List
          disablePadding
          sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}
        >
          {section.items.map((item, itemIndex) => (
            <SidebarItem
              key={itemIndex}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </List>
      </Box>
    ))}
  </Box>
);
