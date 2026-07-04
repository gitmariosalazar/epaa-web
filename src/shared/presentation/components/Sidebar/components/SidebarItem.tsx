// ──────────────────────────────────────────────────────────────────────────────
// SidebarItem — Presentation Layer
//
// SOLID:
//  S — Each sub-component (NavIcon, FlyoutMenuItem, FlyoutMenuHeader) has
//      one reason to change.
//  O — Extends to any NavItem depth without modifying this file.
//  L — FlyoutMenuItem can substitute SidebarItem in flyout contexts.
//  I — Props interfaces are minimal and purpose-specific.
//  D — Depends on NavItem domain abstraction, not concrete implementations.
//
// KEY FIX: MUI Menu renders in a Portal (document.body) by default, so it
// is NEVER clipped by the sidebar's overflow or any parent container.
// The flyout appears automatically where there is screen space.
// ──────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Popover
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { NavItem } from '@/shared/domain/models/Navigation';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface SidebarItemProps {
  item: NavItem;
  isCollapsed: boolean;
  level?: number;
}

interface FlyoutMenuItemProps {
  item: NavItem;
  onClose: () => void;
}

// ── NavIcon — Single Responsibility: renders any icon type ───────────────────

const NavIcon: React.FC<{ icon: NavItem['icon']; size?: number }> = ({
  icon,
  size = 18
}) => {
  if (!icon) return null;
  if (
    typeof icon === 'function' ||
    (typeof icon === 'object' && !React.isValidElement(icon))
  ) {
    const IconComp = icon as React.ElementType;
    return <IconComp size={size} />;
  }
  return <>{icon}</>;
};

// ── FlyoutMenuHeader — Section label inside a Portal flyout ──────────────────

const FlyoutMenuHeader: React.FC<{ title: string }> = ({ title }) => (
  <>
    <Typography
      variant="caption"
      sx={{
        px: 1.5,
        pt: 0.75,
        pb: 0.5,
        display: 'block',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.09em',
        color: 'text.secondary',
        opacity: 0.75,
        userSelect: 'none'
      }}
    >
      {title}
    </Typography>
    <Divider sx={{ mb: 0.5 }} />
  </>
);

// ── FlyoutMenuItem — Recursive item inside a Portal flyout menu ───────────────

const FlyoutMenuItem: React.FC<FlyoutMenuItemProps> = ({ item, onClose }) => {
  const [nestedAnchor, setNestedAnchor] = useState<HTMLElement | null>(null);
  const nestedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  const openNested = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (nestedTimerRef.current) clearTimeout(nestedTimerRef.current);
    setNestedAnchor(e.currentTarget);
  }, []);

  const startCloseNested = useCallback(() => {
    nestedTimerRef.current = setTimeout(() => setNestedAnchor(null), 250);
  }, []);

  const cancelCloseNested = useCallback(() => {
    if (nestedTimerRef.current) clearTimeout(nestedTimerRef.current);
  }, []);

  useEffect(
    () => () => {
      if (nestedTimerRef.current) clearTimeout(nestedTimerRef.current);
    },
    []
  );

  if (item.subItems?.length) {
    const hasActiveChild = item.subItems.some(
      (child) =>
        child.to === location.pathname ||
        child.subItems?.some((gc) => gc.to === location.pathname)
    );

    return (
      <>
        <MenuItem
          onMouseEnter={openNested}
          onMouseLeave={startCloseNested}
          selected={hasActiveChild}
          sx={{ justifyContent: 'space-between', pr: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NavIcon icon={item.icon} />
            {item.label}
          </Box>
          <ChevronRight size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
        </MenuItem>

        {/* Portal-based cascade: never clipped by any parent overflow */}
        <Popover
          open={Boolean(nestedAnchor)}
          anchorEl={nestedAnchor}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          onClose={() => setNestedAnchor(null)}
          disablePortal={false}
          disableRestoreFocus
          slotProps={{
            paper: {
              elevation: 6,
              sx: {
                borderRadius: 2,
                minWidth: 210,
                backgroundImage: 'none'
              }
            },
            root: { sx: { pointerEvents: 'none' } }
          }}
          sx={{ pointerEvents: 'none' }}
        >
          <Box
            onMouseEnter={cancelCloseNested}
            onMouseLeave={startCloseNested}
            sx={{ p: 0.5, pointerEvents: 'auto' }}
          >
            <FlyoutMenuHeader title={item.label} />
            {item.subItems.map((subItem, idx) => (
              <FlyoutMenuItem
                key={subItem.to ?? idx}
                item={subItem}
                onClose={onClose}
              />
            ))}
          </Box>
        </Popover>
      </>
    );
  }

  // Leaf item: navigates directly
  return (
    <NavLink
      to={item.to!}
      end
      onClick={onClose}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      {({ isActive }) => (
        <MenuItem selected={isActive} sx={{ gap: 1 }}>
          <NavIcon icon={item.icon} />
          {item.label}
        </MenuItem>
      )}
    </NavLink>
  );
};

// ── SidebarItem — Orchestrates expanded vs collapsed rendering ─────────────────

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  level = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [flyoutAnchor, setFlyoutAnchor] = useState<HTMLElement | null>(null);
  const flyoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const muiTheme = useMuiTheme();

  const hasChildren = Boolean(item.subItems?.length);

  const isActiveParent =
    hasChildren &&
    item.subItems!.some(
      (child) =>
        child.to === location.pathname ||
        child.subItems?.some(
          (gc) =>
            gc.to === location.pathname ||
            gc.subItems?.some((ggc) => ggc.to === location.pathname)
        )
    );

  // Auto-expand when a child route is active
  useEffect(() => {
    if (isActiveParent && !isCollapsed) {
      setIsExpanded(true);
    }
  }, [isActiveParent, isCollapsed]);

  const openFlyout = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    setFlyoutAnchor(e.currentTarget);
  }, []);

  const startCloseFlyout = useCallback(() => {
    flyoutTimerRef.current = setTimeout(() => setFlyoutAnchor(null), 250);
  }, []);

  const cancelCloseFlyout = useCallback(() => {
    if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
  }, []);

  const closeFlyout = useCallback(() => setFlyoutAnchor(null), []);

  useEffect(
    () => () => {
      if (flyoutTimerRef.current) clearTimeout(flyoutTimerRef.current);
    },
    []
  );

  // ── COLLAPSED ROOT: icon only, Portal flyout on hover ─────────────────────

  if (isCollapsed && level === 0) {
    if (hasChildren) {
      return (
        <>
          <Tooltip
            title={item.label}
            placement="right"
            arrow
            open={flyoutAnchor ? false : undefined}
          >
            <ListItemButton
              onMouseEnter={openFlyout}
              onMouseLeave={startCloseFlyout}
              sx={{
                justifyContent: 'center',
                px: 1,
                py: 1,
                color: isActiveParent ? 'primary.main' : 'text.secondary',
                bgcolor: isActiveParent ? 'action.selected' : 'transparent',
                '&:hover': { color: 'text.primary' }
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 0, color: 'inherit', justifyContent: 'center' }}
              >
                <NavIcon icon={item.icon} />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>

          {/*
           * MUI Menu uses createPortal → appended to document.body.
           * Immune to parent overflow:hidden and z-index stacking contexts.
           * Automatically flips when near screen edges (MUI positioning engine).
           *
           * Fixes applied:
           *  - No ml gap: button right-edge touches paper left-edge, no dead zone
           *  - pointerEvents:none on root/backdrop: backdrop never interrupts hover
           *  - autoFocus:false + autoFocusItem:false: no focus stealing → no aria-hidden warning
           */}
          <Menu
            anchorEl={flyoutAnchor}
            open={Boolean(flyoutAnchor)}
            onClose={closeFlyout}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            autoFocus={false}
            disablePortal={false}
            disableRestoreFocus
            disableScrollLock
            sx={{ pointerEvents: 'none' }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: {
                  borderRadius: 2,
                  minWidth: 224,
                  backgroundImage: 'none'
                }
              },
              root: { sx: { pointerEvents: 'none' } }
            }}
          >
            <Box
              onMouseEnter={cancelCloseFlyout}
              onMouseLeave={startCloseFlyout}
              sx={{ p: 0.5, pointerEvents: 'auto' }}
            >
              <FlyoutMenuHeader title={item.label} />
              {item.subItems!.map((subItem, idx) => (
                <FlyoutMenuItem
                  key={subItem.to ?? idx}
                  item={subItem}
                  onClose={closeFlyout}
                />
              ))}
            </Box>
          </Menu>
        </>
      );
    }

    // Collapsed leaf
    return (
      <Tooltip title={item.label} placement="right" arrow>
        <NavLink
          to={item.to!}
          end
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
          {({ isActive }) => (
            <ListItemButton
              selected={isActive}
              sx={{
                justifyContent: 'center',
                px: 1,
                py: 1,
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'action.selected',
                  borderLeft: '3px solid',
                  borderLeftColor: 'primary.main'
                }
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 0, color: 'inherit', justifyContent: 'center' }}
              >
                <NavIcon icon={item.icon} />
              </ListItemIcon>
            </ListItemButton>
          )}
        </NavLink>
      </Tooltip>
    );
  }

  // ── EXPANDED / NESTED: full labels visible ────────────────────────────────

  if (hasChildren) {
    return (
      <>
        <ListItemButton
          onClick={() => setIsExpanded((prev) => !prev)}
          sx={{
            px: 1.5,
            py: 0.875,
            pl: level > 0 ? 1.5 + level * 0.5 : 1.5,
            color: isActiveParent ? 'primary.main' : 'text.secondary',
            bgcolor:
              isActiveParent && !isExpanded ? 'action.selected' : 'transparent',
            '&:hover': { color: 'text.primary' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <NavIcon icon={item.icon} />
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            slotProps={{
              primary: {
                sx: {
                  fontSize: level > 0 ? '0.875rem' : '0.9375rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              }
            }}
          />
          <Box
            component="span"
            sx={{
              display: 'flex',
              color: 'text.disabled',
              ml: 0.5,
              flexShrink: 0
            }}
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </Box>
        </ListItemButton>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List
            disablePadding
            sx={{
              ml: level === 0 ? 2.5 : 1.5,
              pl: 1,
              borderLeft: `1px solid ${muiTheme.palette.divider}`
            }}
          >
            {item.subItems!.map((subItem, idx) => (
              <SidebarItem
                key={subItem.to ?? idx}
                item={subItem}
                isCollapsed={false}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  // ── Expanded leaf ─────────────────────────────────────────────────────────

  return (
    <NavLink
      to={item.to!}
      end
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      {({ isActive }) => (
        <ListItemButton
          selected={isActive}
          sx={{
            px: 1.5,
            py: 0.75,
            pl: level > 0 ? 1.5 + level * 0.5 : 1.5,
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
            '&.Mui-selected': {
              color: 'primary.main',
              bgcolor: 'action.selected',
              borderLeft: '3px solid',
              borderLeftColor: 'primary.main',
              pl: `calc(${level > 0 ? 1.5 + level * 0.5 : 1.5}rem - 3px)`
            },
            '&.Mui-selected:hover': { bgcolor: 'action.selected' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            <NavIcon icon={item.icon} />
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            slotProps={{
              primary: {
                sx: {
                  fontSize: level > 0 ? '0.875rem' : '0.9375rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              }
            }}
          />
        </ListItemButton>
      )}
    </NavLink>
  );
};
