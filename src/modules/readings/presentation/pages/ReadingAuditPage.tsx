import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Search, BarChart2, History } from 'lucide-react';

import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Button } from '@/shared/presentation/components/Button/Button';
import { TbChartPieFilled } from 'react-icons/tb';
import { FaList } from 'react-icons/fa';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

import { AuditReadingsTable } from '../components/AuditReadingsTable';
import { AuditHistoryTable } from '../components/AuditHistoryTable';
import { useAuditReadings } from '../hooks/useAuditReadings';

// ── Tab type (OCP: add new tabs here without changing any component logic) ────
type AuditTab = 'summary' | 'history';

// ── Client-side status filter ─────────────────────────────────────────────────
type StatusFilter = 'all' | 'complete' | 'pending';

/**
 * ReadingAuditPage
 *
 * Summary tab  → API filters: Mes + Sector | client filters: Estado
 * History tab  → API filters: Sector + Últimos meses | client filters: Mes + Estado
 *
 * OCP: new tabs = one entry in AUDIT_TABS, no existing logic changes.
 * SRP: presentation only.
 */
export const ReadingAuditPage: React.FC = () => {
  const { t } = useTranslation();

  const AUDIT_TABS: TabItem<AuditTab>[] = useMemo(
    () => [
      {
        id: 'summary',
        label: t('readings.audit.tabSummary', 'Resumen del Mes'),
        icon: <BarChart2 size={16} />
      },
      {
        id: 'history',
        label: t('readings.audit.tabHistory', 'Historial por Sector'),
        icon: <History size={16} />
      }
    ],
    [t]
  );

  const [activeTab, setActiveTab] = useState<AuditTab>('summary');
  const currentMonthStr = dateService.getCurrentMonthString();

  // ── API filter states ──────────────────────────────────────────────────────
  const [month, setMonth] = useState(currentMonthStr);
  const [sector, setSector] = useState('');
  const [historyMonths, setHistoryMonths] = useState('12');

  // ── Client-side filter states ──────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sectorFilter, setSectorFilter] = useState(''); // summary right-side
  const [historyMonthFilter, setHistoryMonthFilter] = useState(''); // '' = todos los meses

  const {
    auditData,
    isLoading,
    historyData,
    isHistoryLoading,
    isInitializing,
    error,
    fetchAudit,
    fetchHistory,
    initAudit,
    clearAudit
  } = useAuditReadings();

  const summaryProgress = useSimulatedProgress(isLoading);
  const historyProgress = useSimulatedProgress(isHistoryLoading);

  // Tab change: reset all local state so each tab starts completely fresh
  useEffect(() => {
    setSector('');
    setStatusFilter('all');
    setSectorFilter('');
    setHistoryMonthFilter(''); // sin restricción de mes al cambiar tab
    clearAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Month change: clear stale data
  useEffect(() => {
    clearAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  // ── Derived: month with -01 suffix for API ─────────────────────────────────
  const monthValidate = month + '-01';

  // ── Client-side filtered data ──────────────────────────────────────────────
  const filteredAuditData = useMemo(() => {
    let result = auditData;
    if (sectorFilter) {
      result = result.filter((row) => String(row.sectorId) === sectorFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter((row) =>
        statusFilter === 'complete' ? row.isComplete : !row.isComplete
      );
    }
    return result;
  }, [auditData, sectorFilter, statusFilter]);

  const filteredHistoryData = useMemo(() => {
    let result = historyData;

    // Filter by month (client-side, since API returns N months of history)
    if (historyMonthFilter) {
      result = result.filter((row) => {
        const rowMonth = row.readingMonth
          ? new Date(row.readingMonth).toISOString().substring(0, 7)
          : '';
        return rowMonth.includes(historyMonthFilter);
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((row) =>
        statusFilter === 'complete' ? row.isComplete : !row.isComplete
      );
    }

    return result;
  }, [historyData, historyMonthFilter, statusFilter]);

  // ── Fetch handlers ─────────────────────────────────────────────────────────
  const handleSummaryFetch = () => fetchAudit(monthValidate, sector);

  const handleHistoryFetch = () => {
    if (!sector) return;
    fetchHistory(
      Number(sector),
      historyMonths ? Number(historyMonths) : undefined
    );
  };

  const handleInitialize = async () => {
    await initAudit(monthValidate);
    if (activeTab === 'summary') await fetchAudit(monthValidate, sector);
  };

  // ── Derived flags ──────────────────────────────────────────────────────────
  const canFetchSummary = !isLoading && Boolean(monthValidate);
  const canFetchHistory = !isHistoryLoading && Boolean(sector);
  const activeLoading = activeTab === 'summary' ? isLoading : isHistoryLoading;
  const activeProgress =
    activeTab === 'summary' ? summaryProgress : historyProgress;

  // ── Status filter options ──────────────────────────────────────────────────
  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: t('readings.audit.statusAll', 'Todos') },
    {
      value: 'complete',
      label: t('readings.audit.statusComplete', 'Completados')
    },
    { value: 'pending', label: t('readings.audit.statusPending', 'Pendientes') }
  ];

  return (
    <PageLayout
      className="reading-images-page"
      header={
        <Tabs
          tabs={AUDIT_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      }
      filters={
        <div className="entry-filters">
          <div className="filter-section-left">
            {/* ── MES (solo en summary — API param) ── */}
            {activeTab === 'summary' && (
              <div className="filter-group">
                <label className="filter-label">
                  {t('readingData.filters.month', 'Mes')}
                </label>
                <div className="filter-input-wrapper">
                  <DatePicker
                    size="compact"
                    view="month"
                    value={month ? `${month}-01` : ''}
                    onChange={(val: string) => setMonth(val.substring(0, 7))}
                  />
                </div>
              </div>
            )}

            {/* ── SECTOR (API param — required for history, optional for summary) ── */}
            <div className="filter-group">
              <label className="filter-label">
                {t('readingData.filters.sector', 'Sector')}
              </label>
              <div className="filter-input-wrapper">
                <Input
                  size="compact"
                  placeholder={
                    activeTab === 'history'
                      ? t('readings.audit.sectorRequired', 'Nro. de sector')
                      : t(
                          'readingData.filters.sectorPlaceholder',
                          'Todos los sectores'
                        )
                  }
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  leftIcon={<TbChartPieFilled size={18} />}
                />
              </div>
            </div>

            {/* ── ÚLTIMOS N MESES (history API param) ── */}
            {activeTab === 'history' && (
              <div className="filter-group">
                <label className="filter-label">
                  {t('readings.audit.lastMonths', 'Últimos meses')}
                </label>
                <div className="filter-input-wrapper">
                  <Input
                    size="compact"
                    placeholder="12"
                    value={historyMonths}
                    onChange={(e) => setHistoryMonths(e.target.value)}
                    style={{ width: 80 }}
                  />
                </div>
              </div>
            )}

            {/* ── BUTTONS ── */}
            <div className="filter-group">
              <label className="filter-label" style={{ visibility: 'hidden' }}>
                &nbsp;
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  onClick={
                    activeTab === 'summary'
                      ? handleSummaryFetch
                      : handleHistoryFetch
                  }
                  disabled={
                    activeTab === 'summary'
                      ? !canFetchSummary
                      : !canFetchHistory
                  }
                  size="compact"
                  isLoading={activeLoading}
                >
                  {!activeLoading && <Search size={18} />}
                  {activeLoading ? t('common.loading') : t('common.fetch')}
                </Button>

                {activeTab === 'summary' && (
                  <Button
                    onClick={handleInitialize}
                    disabled={true}
                    size="compact"
                    variant="dashed"
                    isLoading={isInitializing}
                    title={t(
                      'readings.audit.initTooltip',
                      'Genera las metas de lectura para el mes seleccionado'
                    )}
                  >
                    {!isInitializing && <ClipboardList size={16} />}
                    {isInitializing
                      ? t('readings.audit.initializing', 'Inicializando...')
                      : t('readings.audit.initialize', 'Inicializar período')}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: client-side filters ── */}
          <div className="filter-section-right">
            {/* Mes filter (history only: months from fetched results) */}
            {activeTab === 'history' && (
              <div className="filter-group">
                <label className="filter-label">
                  {t('readings.audit.filterMonth', 'Mes')}
                </label>
                <div className="filter-input-wrapper">
                  <Select
                    size="compact"
                    leftIcon={<FaList size={16} />}
                    value={historyMonthFilter}
                    onChange={(e) => setHistoryMonthFilter(e.target.value)}
                  >
                    <option value="">
                      {t('readings.audit.allMonths', 'Todos los meses')}
                    </option>
                    {[
                      ...new Set(
                        historyData
                          .map((r) =>
                            r.readingMonth
                              ? new Date(r.readingMonth)
                                  .toISOString()
                                  .substring(0, 7)
                              : ''
                          )
                          .filter(Boolean)
                      )
                    ]
                      .sort()
                      .map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                  </Select>
                </div>
              </div>
            )}

            {/* Sector filter (summary only: refines already-fetched rows) */}
            {activeTab === 'summary' && (
              <div className="filter-group">
                <label className="filter-label">
                  {t('readingData.filters.sector', 'Sector')}
                </label>
                <div className="filter-input-wrapper">
                  <Select
                    size="compact"
                    leftIcon={<TbChartPieFilled size={18} />}
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                  >
                    <option value="">
                      {t('readingData.filters.sectorPlaceholder', 'Todos')}
                    </option>
                    {[...new Set(auditData.map((r) => String(r.sectorId)))]
                      .sort((a, b) => Number(a) - Number(b))
                      .map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </Select>
                </div>
              </div>
            )}

            {/* Estado filter (both tabs) */}
            <div className="filter-group">
              <label className="filter-label">
                {t('readings.audit.statusLabel', 'Estado')}
              </label>
              <div className="filter-input-wrapper">
                <Select
                  size="compact"
                  leftIcon={<FaList size={16} />}
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                >
                  <option value="all">
                    {t('readings.audit.statusAll', 'Todos')}
                  </option>
                  <option value="complete">
                    {t('readings.audit.statusComplete', 'Completados')}
                  </option>
                  <option value="pending">
                    {t('readings.audit.statusPending', 'Pendientes')}
                  </option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      }
    >
      {error ? (
        <div
          className="entry-data-error"
          style={{ color: 'red', marginTop: '0rem' }}
        >
          <strong>Error: </strong> {error}
        </div>
      ) : activeLoading ? (
        <div
          className="entry-data-loading"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '0rem'
          }}
        >
          <CircularProgress
            progress={activeProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Cargando datos...')}
          />
        </div>
      ) : (
        <>
          {activeTab === 'summary' && (
            <AuditReadingsTable
              data={filteredAuditData}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'history' && (
            <AuditHistoryTable
              data={filteredHistoryData}
              isLoading={isHistoryLoading}
            />
          )}
        </>
      )}
    </PageLayout>
  );
};
