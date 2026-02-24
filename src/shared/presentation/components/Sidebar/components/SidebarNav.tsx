import React from 'react';
import { useTranslation } from 'react-i18next';
import type { NavSection } from '@/shared/domain/models/Navigation';
import { SidebarItem } from './SidebarItem';

interface SidebarNavProps {
  sections: NavSection[];
  isCollapsed: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  sections,
  isCollapsed
}) => {
  const { t } = useTranslation();

  return (
    <nav className="sidebar__nav">
      {sections.map((section, index) => (
        <div key={index} className="sidebar__section">
          {!isCollapsed &&
            section.title !== t('sidebar.general') &&
            section.title !== t('sidebar.user') && (
              <div className="sidebar__section-title">{section.title}</div>
            )}
          {isCollapsed && index > 0 && <div className="sidebar__divider" />}

          {section.items.map((item, itemIndex) => (
            <SidebarItem
              key={itemIndex}
              item={item}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      ))}
    </nav>
  );
};
