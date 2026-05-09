import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip } from '../../common/Tooltip/Tooltip';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  toggleSidebar
}) => {
  return (
    <div className="sidebar__header">
     <div className="sidebar__logo">{isCollapsed ? 'EA' : 'EPAA-AA'}</div>
     <Tooltip content={isCollapsed ? 'Expandir' : 'Contraer'} position="bottom" themeColor='info'>
       <button className="sidebar__toggle" onClick={toggleSidebar}>
         {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
       </button>
     </Tooltip>
    </div>
  );
};
