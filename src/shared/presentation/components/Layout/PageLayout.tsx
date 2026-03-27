import React from 'react';
import './PageLayout.css';

export interface PageLayoutProps {
  /**
   * Optional sticky header row. Usually houses components like <Tabs /> 
   * or page-level titles that must permanently stay visible.
   */
  header?: React.ReactNode;
  
  /**
   * Optional sticky filters row. Displays permanently right below the header.
   */
  filters?: React.ReactNode;
  
  /**
   * The primary scrollable content of the page (e.g. Tables, Dashboards, Charts).
   */
  children: React.ReactNode;
  
  /**
   * Custom CSS classes appended to the root layout container.
   */
  className?: string;
}

/**
 * A highly reusable, SOLID layout wrapper guaranteeing that Headers and Filters
 * remain vertically anchored relative to the viewport while the inner Content body naturally scrolls.
 * Replaces unreliable `position: sticky` layouts with secure flex-shrink geometries.
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  header,
  filters,
  children,
  className = ''
}) => {
  return (
    <div className={`epaa-page-layout ${className}`.trim()}>
      {header && (
        <section className="epaa-page-layout__header">
          {header}
        </section>
      )}
      
      {filters && (
        <section className="epaa-page-layout__filters">
          {filters}
        </section>
      )}

      <main className="epaa-page-layout__body">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
