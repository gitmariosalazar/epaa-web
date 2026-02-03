import React, { useState } from 'react';
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
  User,
  ChevronDown,
  Lock
} from 'lucide-react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { useTranslation } from 'react-i18next';
import '@/shared/presentation/styles/Sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  to?: string;
  subItems?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleSidebar
}) => {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Security: false
  });

  const toggleSubMenu = (label: string) => {
    if (isCollapsed) return;
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const navSections: NavSection[] = [
    {
      title: 'General',
      items: [
        {
          icon: <LayoutDashboard size={20} />,
          label: t('sidebar.dashboard'),
          to: '/'
        },
        {
          icon: <FileText size={20} />,
          label: 'Reports',
          to: '/reports'
        }
      ]
    },
    {
      title: 'Administration',
      items: [
        {
          icon: <Lock size={20} />,
          label: 'Security',
          subItems: [
            {
              icon: <Users size={18} />,
              label: t('sidebar.users'),
              to: '/users'
            },
            {
              icon: <Shield size={18} />,
              label: t('sidebar.roles'),
              to: '/roles'
            },
            {
              icon: <CheckCircle size={18} />,
              label: t('sidebar.permissions'),
              to: '/permissions'
            },
            {
              icon: <Settings size={18} />,
              label: t('sidebar.settings'),
              to: '/settings'
            }
          ]
        }
      ]
    },
    {
      title: 'User',
      items: [
        {
          icon: <User size={20} />,
          label: 'Profile',
          to: '/profile'
        }
      ]
    }
  ];

  const renderNavItem = (item: NavItem) => {
    if (item.subItems) {
      const isExpanded = expandedMenus[item.label];
      const hasActiveChild = item.subItems.some(
        (child) => child.to === window.location.pathname
      );

      return (
        <div key={item.label} className="sidebar__item-wrapper">
          <div
            className={`sidebar__link sidebar__parent-item ${
              hasActiveChild ? 'sidebar__link--active-parent' : ''
            }`}
            onClick={() => toggleSubMenu(item.label)}
            title={isCollapsed ? item.label : ''}
          >
            <span className="sidebar__icon">{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className="sidebar__label">{item.label}</span>
                <span className="sidebar__chevron">
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              </>
            )}
          </div>

          <div
            className={`sidebar__sub-menu ${
              isExpanded && !isCollapsed ? 'sidebar__sub-menu--open' : ''
            }`}
          >
            {item.subItems.map((subItem) => (
              <NavLink
                key={subItem.to}
                to={subItem.to!}
                className={({ isActive }) =>
                  `sidebar__link sidebar__sub-link ${
                    isActive ? 'sidebar__link--active' : ''
                  }`
                }
              >
                <span className="sidebar__icon">{subItem.icon}</span>
                <span className="sidebar__label">{subItem.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      );
    }

    return (
      <NavLink
        key={item.to}
        to={item.to!}
        className={({ isActive }) =>
          `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
        }
        title={isCollapsed ? item.label : ''}
      >
        <span className="sidebar__icon">{item.icon}</span>
        {!isCollapsed && <span className="sidebar__label">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <div className="sidebar__logo">{isCollapsed ? 'EA' : 'EPAA-AA'}</div>
        <button className="sidebar__toggle" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar__nav">
        {navSections.map((section, index) => (
          <div key={index} className="sidebar__section">
            {!isCollapsed &&
              section.title !== 'General' &&
              section.title !== 'User' && (
                <div className="sidebar__section-title">{section.title}</div>
              )}
            {/* Optional: Add a separator for collapsed state or just rely on spacing */}
            {isCollapsed && index > 0 && <div className="sidebar__divider" />}

            {section.items.map((item) => renderNavItem(item))}
          </div>
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
