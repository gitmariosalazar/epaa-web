import React from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header';
import { Outlet } from 'react-router-dom';
import '@/shared/presentation/styles/Layout.css';

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(window.innerWidth < 768);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`dashboard-layout ${isCollapsed ? 'dashboard-layout--collapsed' : ''}`}
    >
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="dashboard-content-wrapper">
        <Header />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
