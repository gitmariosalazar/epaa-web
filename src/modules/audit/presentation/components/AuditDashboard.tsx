import React from 'react';
import { useAuditViewModel } from '../hooks/useAuditViewModel';
import { type AuditTab } from '../context/AuditContext';
import { SessionLogsTable } from './SessionLogsTable';
import { DataLogsTable } from './DataLogsTable';
import { ShieldAlert, DatabaseBackup, ListFilter } from 'lucide-react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import { AuditFilters } from './AuditFilters';
import styles from '../styles/AuditDashboard.module.css';
import '../styles/Audit.css';

export const AuditDashboard: React.FC = () => {
  const { state, actions } = useAuditViewModel();
  const {
    activeTab,
    isLoading,
    searchQuery,
    searchField,
    selectedOperation,
    selectedEvent,
    userIdFilter,
    usernameFilter,
    startDate,
    endDate
  } = state;

  const tabs: TabItem<string>[] = [
    {
      id: 'sessions',
      label: 'Registro de Sesiones',
      icon: <ShieldAlert size={18} />
    },
    {
      id: 'data',
      label: 'Cambios en Base de Datos',
      icon: <DatabaseBackup size={18} />
    }
  ];

  const headerContent = (
    <div className={styles.headerContainer}>
      {/* ── Breadcrumbs ── */}
      <div className={styles.breadcrumbs}>
        <span>Seguridad</span>
        <span>/</span>
        <span>Auditoría</span>
        <span>/</span>
        <span className={styles.breadcrumbActive}>Trazabilidad</span>
      </div>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>Monitoreo de Auditoría</h1>
        <p className={styles.subtitle}>
          Seguimiento de accesos y modificaciones en tiempo real para garantizar la integridad de los datos.
        </p>
      </div>

      <div className={styles.tabsRow}>
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => actions.setActiveTab(id as AuditTab)}
        />
        <div className={styles.viewingMeta}>
          <ListFilter size={16} />
          <span>Viendo {activeTab === 'sessions' ? 'Sesiones' : 'Datos'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout
      className="connections-page-content"
      header={headerContent}
      filters={
        <AuditFilters
          activeTab={activeTab}
          isLoading={isLoading}
          searchQuery={searchQuery}
          searchField={searchField}
          selectedOperation={selectedOperation}
          selectedEvent={selectedEvent}
          userIdFilter={userIdFilter}
          usernameFilter={usernameFilter}
          startDate={startDate}
          endDate={endDate}
          onSearchQueryChange={actions.setSearchQuery}
          onSearchFieldChange={actions.setSearchField}
          onOperationChange={actions.setSelectedOperation}
          onEventChange={actions.setSelectedEvent}
          onUserIdChange={actions.setUserIdFilter}
          onUsernameChange={actions.setUsernameFilter}
          onStartDateChange={actions.setStartDate}
          onEndDateChange={actions.setEndDate}
          onFetch={actions.handleFetch}
        />
      }
    >
      <div className="audit-panel-container">
        {activeTab === 'sessions' ? <SessionLogsTable /> : <DataLogsTable />}
      </div>
    </PageLayout>
  );
};
