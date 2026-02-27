/**
 * Shared Tabs Component
 *
 * Follows:
 * - Single Responsibility: only manages tab state + rendering
 * - Open/Closed: extensible via props (icons, className, renderContent)
 * - Interface Segregation: consumers only pass what they need
 * - Dependency Inversion: consumers provide tab definitions as data
 */

import React from 'react';
import '@/shared/presentation/styles/Tabs.css';

// ── Types ───────────────────────────────────────────────────────────────────

export interface TabItem<T extends string = string> {
  /** Unique identifier used as the tab value */
  id: T;
  /** Label displayed inside the tab button */
  label: string;
  /** Optional icon rendered before the label */
  icon?: React.ReactNode;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  /** List of tab definitions */
  tabs: TabItem<T>[];
  /** Currently active tab id */
  activeTab: T;
  /** Called when the user clicks a tab */
  onTabChange: (id: T) => void;
  /** Additional className for the root element */
  className?: string;
}

// ── Component ───────────────────────────────────────────────────────────────

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}: TabsProps<T>): React.ReactElement {
  return (
    <div className={`tabs ${className}`.trim()}>
      <div className="tabs__list" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`tabs__tab ${isActive ? 'tabs__tab--active' : ''}`}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              type="button"
            >
              {tab.icon && (
                <span className="tabs__tab-icon" aria-hidden="true">
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Panel helper ─────────────────────────────────────────────────────────────

export interface TabPanelProps {
  /** The tab id this panel belongs to */
  tabId: string;
  /** The currently active tab id */
  activeTab: string;
  children: React.ReactNode;
}

/**
 * Optional panel wrapper. Use when you want the Tabs component to manage
 * visibility. You can also skip this and handle content switching yourself.
 */
export const TabPanel: React.FC<TabPanelProps> = ({
  tabId,
  activeTab,
  children
}) => {
  const isActive = tabId === activeTab;
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${tabId}`}
      aria-labelledby={`tab-${tabId}`}
      className={`tabs__panel ${isActive ? 'tabs__panel--active' : ''}`}
    >
      {children}
    </div>
  );
};
