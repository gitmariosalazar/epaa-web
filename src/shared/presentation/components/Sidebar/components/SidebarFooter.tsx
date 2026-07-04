import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import { User, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/shared/presentation/context/AuthContext';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed
}) => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        p: 0.75,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.25,
        flexShrink: 0
      }}
    >
      <Tooltip
        title={isCollapsed ? t('sidebar.profile') : ''}
        placement="right"
        arrow
      >
        <NavLink
          to="/profile"
          end
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          {({ isActive }) => (
            <ListItemButton
              selected={isActive}
              sx={{
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 1 : 1.5,
                py: 0.875,
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'action.selected'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : 36,
                  color: 'inherit',
                  justifyContent: 'center'
                }}
              >
                <User size={20} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={t('sidebar.profile')}
                  slotProps={{
                    primary: { sx: { fontSize: '0.9375rem', fontWeight: 500 } }
                  }}
                />
              )}
            </ListItemButton>
          )}
        </NavLink>
      </Tooltip>

      <Tooltip
        title={isCollapsed ? t('sidebar.signOut') : ''}
        placement="right"
        arrow
      >
        <ListItemButton
          onClick={logout}
          sx={{
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            px: isCollapsed ? 1 : 1.5,
            py: 0.875,
            color: 'error.main',
            '&:hover': {
              bgcolor: 'rgba(239,68,68,0.08)',
              color: 'error.main'
            }
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: isCollapsed ? 0 : 36,
              color: 'inherit',
              justifyContent: 'center'
            }}
          >
            <LogOut size={20} />
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary={t('sidebar.signOut')}
              slotProps={{
                primary: { sx: { fontSize: '0.9375rem', fontWeight: 500 } }
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    </Box>
  );
};
