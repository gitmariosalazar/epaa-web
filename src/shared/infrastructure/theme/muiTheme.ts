// ──────────────────────────────────────────────────────────────────────────────
// MUI Theme Factory — Infrastructure Layer
// Single Responsibility: Translates app color tokens into a MUI theme object.
// Open/Closed: New themes can be created by calling this factory with a new mode.
// Dependency Inversion: Consumers depend on the Theme abstraction, not concrete values.
// ──────────────────────────────────────────────────────────────────────────────

import { createTheme, type Theme } from '@mui/material/styles';

export const createAppMuiTheme = (mode: 'light' | 'dark'): Theme =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#3b82f6',
        dark: '#2563eb',
        light: mode === 'dark' ? '#60a5fa' : '#93c5fd'
      },
      error: { main: '#ef4444' },
      warning: { main: '#f59e0b' },
      success: { main: '#10b981' },
      background: {
        default: mode === 'dark' ? '#020617' : '#f8fafc',
        paper: mode === 'dark' ? '#0f172a' : '#ffffff'
      },
      text: {
        primary: mode === 'dark' ? '#f8fafc' : '#0f172a',
        secondary: mode === 'dark' ? '#94a3b8' : '#475569',
        disabled: mode === 'dark' ? '#64748b' : '#94a3b8'
      },
      divider: mode === 'dark' ? '#1e293b' : '#e2e8f0',
      action: {
        hover: mode === 'dark' ? '#1e293b' : '#f1f5f9',
        selected:
          mode === 'dark' ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.10)',
        selectedOpacity: mode === 'dark' ? 0.15 : 0.1
      }
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontSize: 14,
      fontWeightMedium: 500,
      fontWeightBold: 700
    },
    shape: { borderRadius: 8 },
    components: {
      MuiList: {
        defaultProps: { disablePadding: true }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            minHeight: 40,
            transition: 'background-color 150ms, color 150ms'
          }
        }
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: { color: 'inherit' }
        }
      },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
          placement: 'right',
          enterDelay: 200,
          enterNextDelay: 0
        }
      },
      MuiMenu: {
        defaultProps: { elevation: 4 },
        styleOverrides: {
          paper: {
            borderRadius: '10px',
            minWidth: 220,
            backgroundImage: 'none'
          },
          list: { padding: '4px' }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            gap: '8px',
            fontSize: '0.875rem',
            fontWeight: 500,
            minHeight: 38
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: { margin: '4px 0' }
        }
      }
    }
  });
