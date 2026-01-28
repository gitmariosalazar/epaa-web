import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Shield,
  LayoutDashboard,
  LogOut,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  User
} from 'lucide-react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { useTranslation } from 'react-i18next';
import '@/shared/presentation/styles/Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar
}) => {
  const { logout } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: t('sidebar.dashboard'),
      to: '/'
    },
    {
      icon: <FileText size={20} />,
      label: 'Reports', // Use t('sidebar.reports') if available, hardcoded fallback for now
      to: '/reports'
    },
    { icon: <Users size={20} />, label: t('sidebar.users'), to: '/users' },
    { icon: <Shield size={20} />, label: t('sidebar.roles'), to: '/roles' },
    {
      icon: <CheckCircle size={20} />,
      label: t('sidebar.permissions'),
      to: '/permissions'
    },
    {
      icon: <Settings size={20} />,
      label: t('sidebar.settings'),
      to: '/settings'
    },
    {
      icon: <User size={20} />,
      label: 'Profile',
      to: '/profile'
    }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">{isCollapsed ? 'EA' : 'EPAA-AA'}</div>
        <button className="sidebar__toggle" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            title={isCollapsed ? item.label : ''}
          >
            <span className="sidebar__icon">{item.icon}</span>
            {!isCollapsed && (
              <span className="sidebar__label">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button
          className="sidebar__link sidebar__link--logout"
          onClick={logout}
          title={isCollapsed ? 'Sign Out' : ''}
        >
          <span className="sidebar__icon">
            <LogOut size={20} />
          </span>
          {!isCollapsed && (
            <span className="sidebar__label">{t('sidebar.signOut')}</span>
          )}
        </button>
      </div>
    </aside>
  );
};
