import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { NavItem } from '@/shared/domain/models/Navigation';

interface SidebarItemProps {
  item: NavItem;
  isCollapsed: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const toggleSubMenu = () => {
    if (isCollapsed) return;
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="sidebar__item-wrapper">
      {item.subItems ? (
        <>
          <div
            className={`sidebar__link sidebar__parent-item ${
              item.subItems.some((child) => child.to === location.pathname)
                ? 'sidebar__link--active-parent'
                : ''
            }`}
            onClick={toggleSubMenu}
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
            {isCollapsed && (
              <div className="sidebar__flyout-header">{item.label}</div>
            )}
            {item.subItems.map((subItem) => (
              <NavLink
                key={subItem.to}
                to={subItem.to!}
                end
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
        </>
      ) : (
        <>
          <NavLink
            to={item.to!}
            end
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            {!isCollapsed && (
              <span className="sidebar__label">{item.label}</span>
            )}
          </NavLink>
          {isCollapsed && (
            <div className="sidebar__floating-label">{item.label}</div>
          )}
        </>
      )}
    </div>
  );
};
