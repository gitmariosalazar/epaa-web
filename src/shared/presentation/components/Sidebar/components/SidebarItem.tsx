import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { NavItem } from '@/shared/domain/models/Navigation';

interface SidebarItemProps {
  item: NavItem;
  isCollapsed: boolean;
  level?: number;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  level = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const toggleSubMenu = () => {
    // Only toggle manually when the sidebar is NOT collapsed
    if (isCollapsed) return;
    setIsExpanded((prev) => !prev);
  };

  const renderIcon = (icon: React.ReactNode | React.ElementType) => {
    if (!icon) return null;
    // Check if it's a component (function) or a Lucide icon (object that isn't a React Element)
    if (
      typeof icon === 'function' ||
      (typeof icon === 'object' && !React.isValidElement(icon))
    ) {
      const IconComp = icon as React.ElementType;
      return <IconComp size={18} />;
    }
    return icon as React.ReactNode;
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
            <span className="sidebar__icon">{renderIcon(item.icon)}</span>
            {(!isCollapsed || level > 0) && (
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
            {item.subItems.map((subItem, idx) => 
              subItem.subItems ? (
                <SidebarItem key={idx} item={subItem} isCollapsed={isCollapsed} level={level + 1} />
              ) : (
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
                  <span className="sidebar__icon">
                    {renderIcon(subItem.icon)}
                  </span>
                  <span className="sidebar__label">{subItem.label}</span>
                </NavLink>
              )
            )}
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
            <span className="sidebar__icon">{renderIcon(item.icon)}</span>
            {(!isCollapsed || level > 0) && (
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
