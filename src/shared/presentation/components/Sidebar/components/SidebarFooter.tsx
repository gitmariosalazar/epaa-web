import React from 'react';
import { NavLink } from 'react-router-dom';
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
    <div className="sidebar__footer">
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
        }
        title={isCollapsed ? t('sidebar.profile') : ''}
      >
        <span className="sidebar__icon">
          <User size={20} />
        </span>
        {!isCollapsed && (
          <span className="sidebar__label">{t('sidebar.profile')}</span>
        )}
      </NavLink>
      <button
        className="sidebar__link sidebar__link--logout"
        onClick={logout}
        title={isCollapsed ? t('sidebar.signOut') : ''}
      >
        <span className="sidebar__icon">
          <LogOut size={20} />
        </span>
        {!isCollapsed && (
          <span className="sidebar__label">{t('sidebar.signOut')}</span>
        )}
      </button>
    </div>
  );
};
