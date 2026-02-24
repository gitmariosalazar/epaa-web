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

  if (item.subItems) {
    const hasActiveChild = item.subItems.some(
      (child) => child.to === location.pathname
    );

    return (
      <div className="sidebar__item-wrapper">
        <div
          className={`sidebar__link sidebar__parent-item ${
            hasActiveChild ? 'sidebar__link--active-parent' : ''
          }`}
          onClick={toggleSubMenu}
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
      </div>
    );
  }

  return (
    <NavLink
      to={item.to!}
      end
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
