import React from 'react';
import '../styles/PaymentsPage.css';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { useOverduePaymentsViewModel } from '../hooks/useOverduePaymentsViewModel';
import { OverduePaymentFilters } from '../components/OverduePaymentFilters';
import { OverduePaymentsTable } from '../components/OverduePaymentsTable';
import { PendingReadingsModal } from '../components/PendingReadingsModal';

export const OverduePaymentsPage: React.FC = () => {
  const { t } = useTranslation();

  const {
    overduePayments,
    isLoading,
    error,
    hasMore,
    sortConfig,
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    handleClearSearch,
    handleSort,
    handleLoadMore,
    // Pending bills
    pendingReadings,
    isPendingLoading,
    pendingError,
    fetchPendingReadings
  } = useOverduePaymentsViewModel();

  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(
    null
  );
  const [selectedClientName, setSelectedClientName] = React.useState<
    string | undefined
  >();

  const handleOpenPendingModal = (searchValue: string) => {
    console.log('✅ handleOpenPendingModal llamado con:', searchValue);
    console.log('Opening Pending Modal for:', searchValue);
    console.trace('Open Pending Modal Trace');
    // Find the client by matching either clientId or cadastralKey
    const client = overduePayments.find(
      (p) => p.clientId === searchValue || p.cadastralKey === searchValue
    );
    const resolvedId = client?.clientId || searchValue;
    console.log('Resolved Client ID:', resolvedId);
    setSelectedClientId(resolvedId);
    setSelectedClientName(client?.name);
    fetchPendingReadings(searchValue);
  };

  const handleClosePendingModal = () => {
    setSelectedClientId(null);
    setSelectedClientName(undefined);
  };

  const loadingProgress = useSimulatedProgress(isLoading);

  return (
    <div className="payments-page">
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 0 4px'
        }}
      >
        <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />
        <h2
          style={{
            margin: 0,
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--text)'
          }}
        >
          {t('accounting.overdue.pageTitle', 'Pagos en Mora')}
        </h2>
      </div>

      {/* ── Filters ── */}
      <OverduePaymentFilters
        searchField={searchField}
        setSearchField={setSearchField}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleClearSearch={handleClearSearch}
      />

      {/* ── Content ── */}
      {error ? (
        <div className="payments-error-container">
          <div className="payments-error-dot" />
          <span className="payments-error-text">{error}</span>
        </div>
      ) : isLoading && overduePayments.length === 0 ? (
        <div className="payments-loading">
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Loading...')}
          />
        </div>
      ) : (
        <OverduePaymentsTable
          data={overduePayments}
          isLoading={isLoading}
          sortConfig={sortConfig}
          onSort={(key) => handleSort(key)}
          onEndReached={handleLoadMore}
          onViewPendingReadings={handleOpenPendingModal}
          hasMore={hasMore}
        />
      )}

      {/* ── Pending Readings Modal ── */}
      <PendingReadingsModal
        isOpen={selectedClientId !== null}
        onClose={handleClosePendingModal}
        data={pendingReadings}
        isLoading={isPendingLoading}
        error={pendingError}
        clientName={selectedClientName}
        clientId={selectedClientId || undefined}
      />
    </div>
  );
};
