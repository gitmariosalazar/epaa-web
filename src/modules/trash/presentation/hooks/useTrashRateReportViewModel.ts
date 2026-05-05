import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTrashRateReportContext } from '../context/TrashRateReportContext';
import { useTabDataState } from './useTabDataState';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import { TrashRateAuditReportParams } from '../../domain/dto/params/TrashRateAuditParams';
import type { AuditDateFilter } from '../../domain/dto/params/TrashRateAuditParams';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import type {
  TrashRateAuditRow,
  MonthlySummaryRow,
  MissingValorRow,
  CreditNoteRow,
  TopDebtorRow,
  ClientTrashDetailRow,
  TrashDashboardKpi
} from '../../domain/models/trash-rate-report.model';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarRange,
  FileWarning,
  FileX,
  Users,
  User
} from 'lucide-react';
import React from 'react';
import type { AuditAccountingSubTab } from '@/shared/utils/tabs-accounting/tabs';

// ── Tab principal ─────────────────────────────────────────────────────────────
export type TrashRateTab =
  | 'dashboard'
  | 'auditReport'
  | 'monthlySummary'
  | 'missingValor'
  | 'creditNotes'
  | 'topDebtors'
  | 'clientDetail';

// ISP: cada sub-tab solo tiene los filtros que le pertenecen.
export interface AuditSubTabFilters {
  diagnosticFilter: 'DIFFERENT_AND_NO_RECORD' | 'ALL';
  dateFilter: AuditDateFilter;
  paymentStatus: string;
  diagnostic: string;
  searchQuery: string;
}

// OCP: factory de estado inicial — extender = agregar clave aquí.
const makeInitialSubTabFilters = (): AuditSubTabFilters => ({
  diagnosticFilter: 'ALL',
  dateFilter: 'incomeDate',
  paymentStatus: '',
  diagnostic: '',
  searchQuery: ''
});

// ── Todos los sub-tabs en orden de declaración ────────────────────────────────
export const AUDIT_SUB_TABS: AuditAccountingSubTab[] = [
  'Pagados (Recaudados)',
  'Pendientes (Cartera Corriente)',
  'En Mora (Cartera Vencida)',
  'Todos (Pagados y Pendientes)'
];

// Solo Pagados y Todos tienen filtro de columna de fecha (ISP).
export const auditSubTabHasDateFilter = (tab: AuditAccountingSubTab): boolean =>
  tab === 'Pagados (Recaudados)' || tab === 'Todos (Pagados y Pendientes)';

function applySortConfig<T>(
  data: T[],
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null
): T[] {
  if (!sortConfig) return data;
  return [...data].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// ── ViewModel ─────────────────────────────────────────────────────────────────
// DIP: depende del contexto (abstracción), no de la implementación concreta.
// SRP: orquesta tabs y delega el ciclo de vida de datos a useTabDataState<T>.
export const useTrashRateReportViewModel = () => {
  const { t } = useTranslation();
  // Acceso a los use cases via contexto (DIP)
  const context = useTrashRateReportContext();

  // ── Tabs de navegación principal ──────────────────────────────────────────
  const TRASH_TABS: TabItem<TrashRateTab>[] = useMemo(
    () => [
      {
        id: 'dashboard',
        label: t('trashRateReport.tabs.dashboard', 'KPI Dashboard'),
        icon: React.createElement(LayoutDashboard, { size: 16 })
      },
      {
        id: 'auditReport',
        label: t('trashRateReport.tabs.auditReport', 'Auditoría de Tasas'),
        icon: React.createElement(ClipboardList, { size: 16 })
      },
      {
        id: 'monthlySummary',
        label: t('trashRateReport.tabs.monthlySummary', 'Resumen Mensual'),
        icon: React.createElement(CalendarRange, { size: 16 })
      },
      {
        id: 'missingValor',
        label: t('trashRateReport.tabs.missingValor', 'Sin Valor'),
        icon: React.createElement(FileWarning, { size: 16 })
      },
      {
        id: 'creditNotes',
        label: t('trashRateReport.tabs.creditNotes', 'Notas de Crédito'),
        icon: React.createElement(FileX, { size: 16 })
      },
      {
        id: 'topDebtors',
        label: t('trashRateReport.tabs.topDebtors', 'Top Deudores'),
        icon: React.createElement(Users, { size: 16 })
      },
      {
        id: 'clientDetail',
        label: t('trashRateReport.tabs.clientDetail', 'Detalle Cliente'),
        icon: React.createElement(User, { size: 16 })
      }
    ],
    [t]
  );

  // ── Estado de navegación ──────────────────────────────────────────────────
  const [activeTab, setActiveTabRaw] = useState<TrashRateTab>('dashboard');
  const [auditSubTab, setAuditSubTabRaw] = useState<AuditAccountingSubTab>(
    'Pagados (Recaudados)'
  );

  // ── Estado de fecha compartido (cada tab puede tener sus propias fechas) ──
  const today = dateService.getCurrentDateString();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [top, setTop] = useState<string>('100');
  const [limit] = useState<string>('50');
  const [offset] = useState<string>('0');

  // ── ISP: estado de filtros independiente por sub-tab de auditoría ─────────
  // OCP: nuevo sub-tab = nueva entrada de estado aquí.
  const [pagadosFilters, setPagadosFilters] = useState<AuditSubTabFilters>(
    makeInitialSubTabFilters()
  );
  const [pendientesFilters, setPendientesFilters] =
    useState<AuditSubTabFilters>(makeInitialSubTabFilters());
  const [enMoraFilters, setEnMoraFilters] = useState<AuditSubTabFilters>(
    makeInitialSubTabFilters()
  );
  const [todosFilters, setTodosFilters] = useState<AuditSubTabFilters>(
    makeInitialSubTabFilters()
  );

  // SRP: getter/setter del slice activo de filtros de sub-tab.
  const activeSubTabFilters = useMemo((): AuditSubTabFilters => {
    switch (auditSubTab) {
      case 'Pagados (Recaudados)':
        return pagadosFilters;
      case 'Pendientes (Cartera Corriente)':
        return pendientesFilters;
      case 'En Mora (Cartera Vencida)':
        return enMoraFilters;
      case 'Todos (Pagados y Pendientes)':
        return todosFilters;
    }
  }, [
    auditSubTab,
    pagadosFilters,
    pendientesFilters,
    enMoraFilters,
    todosFilters
  ]);

  const setActiveSubTabFilters = useCallback(
    (patch: Partial<AuditSubTabFilters>) => {
      const updater = (prev: AuditSubTabFilters) => ({ ...prev, ...patch });
      switch (auditSubTab) {
        case 'Pagados (Recaudados)':
          setPagadosFilters(updater);
          break;
        case 'Pendientes (Cartera Corriente)':
          setPendientesFilters(updater);
          break;
        case 'En Mora (Cartera Vencida)':
          setEnMoraFilters(updater);
          break;
        case 'Todos (Pagados y Pendientes)':
          setTodosFilters(updater);
          break;
      }
    },
    [auditSubTab]
  );

  // ISP: setters simples para la vista
  const setDiagnosticFilter = (v: 'DIFFERENT_AND_NO_RECORD' | 'ALL') =>
    setActiveSubTabFilters({ diagnosticFilter: v });
  const setDateFilter = (v: AuditDateFilter) =>
    setActiveSubTabFilters({ dateFilter: v });
  const setPaymentStatus = (v: string) =>
    setActiveSubTabFilters({ paymentStatus: v });
  const setDiagnosticLocal = (v: string) =>
    setActiveSubTabFilters({ diagnostic: v });
  const setSearchQuery = (v: string) =>
    setActiveSubTabFilters({ searchQuery: v });

  // Filtros específicos por tab
  const [missingPaymentStatus, setMissingPaymentStatus] = useState('');
  const [creditCoverage, setCreditCoverage] = useState('');
  const [clientSearchParams, setClientSearchParams] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // ISP: filtro exclusivo de Vista General — qué tipo de registros mostrar.
  // Estado independiente: resetea al cambiar de sub-tab o tab principal.
  const [todosPaymentTypeChoice, setTodosPaymentTypeChoice] =
    useState<'all' | 'pagados' | 'pendientes'>('all');

  // ── NÚCLEO: un useTabDataState<T> por tab (SRP + ISP) ────────────────────
  // Cada hook posee SU PROPIO estado: data, isLoading, error, hasFetched.
  // Cambiar de tab NO limpia el estado de otro tab — son completamente aislados.
  const dashboardTab = useTabDataState<TrashDashboardKpi>();
  const auditTab = useTabDataState<TrashRateAuditRow>();
  const monthlyTab = useTabDataState<MonthlySummaryRow>();
  const missingTab = useTabDataState<MissingValorRow>();
  const creditTab = useTabDataState<CreditNoteRow>();
  const topDebtorsTab = useTabDataState<TopDebtorRow>();
  const clientDetailTab = useTabDataState<ClientTrashDetailRow>();

  // ── Helpers de parámetros ─────────────────────────────────────────────────
  const dateParams = useCallback(
    () =>
      new DateRangeParams(
        startDate,
        endDate,
        undefined,
        Number(limit) || 50,
        Number(offset) || 0
      ),
    [startDate, endDate, limit, offset]
  );

  const auditParams = useCallback(
    () =>
      new TrashRateAuditReportParams(
        startDate,
        endDate,
        activeSubTabFilters.diagnosticFilter,
        auditSubTab,
        auditSubTabHasDateFilter(auditSubTab)
          ? activeSubTabFilters.dateFilter
          : 'incomeDate'
      ),
    [
      startDate,
      endDate,
      activeSubTabFilters.diagnosticFilter,
      auditSubTab,
      activeSubTabFilters.dateFilter
    ]
  );

  // ── Acción principal: Consultar ───────────────────────────────────────────
  // SRP: handleFetch solo enruta — el ciclo de vida lo gestiona useTabDataState.
  const handleFetch = useCallback(() => {
    switch (activeTab) {
      case 'dashboard':
        dashboardTab.fetch(() =>
          context.getDashboardKPITrashRate.execute(
            new DateRangeParams(startDate, endDate)
          )
        );
        break;
      case 'auditReport':
        auditTab.fetch(() =>
          context.getTrashRateAuditReport.execute(auditParams())
        );
        break;
      case 'monthlySummary':
        monthlyTab.fetch(() =>
          context.getMonthlySummaryReport.execute(dateParams())
        );
        break;
      case 'missingValor':
        missingTab.fetch(() =>
          context.getMissingValorBills.execute(dateParams())
        );
        break;
      case 'creditNotes':
        creditTab.fetch(() =>
          context.getActiveCreditNotes.execute(dateParams())
        );
        break;
      case 'topDebtors':
        topDebtorsTab.fetch(() =>
          context.getTopDebtorReport.execute(
            new DateRangeParams(
              startDate,
              endDate,
              Number(top) || 100,
              Number(limit) || 50,
              Number(offset) || 0
            )
          )
        );
        break;
      case 'clientDetail':
        clientDetailTab.fetch(() =>
          context.getClientDetailSearch.execute(clientSearchParams)
        );
        break;
    }
  }, [
    activeTab,
    startDate,
    endDate,
    top,
    limit,
    offset,
    clientSearchParams,
    auditParams,
    dateParams,
    context,
    dashboardTab,
    auditTab,
    monthlyTab,
    missingTab,
    creditTab,
    topDebtorsTab,
    clientDetailTab
  ]);

  // ── Cambio de tab principal ───────────────────────────────────────────────
  // OCP: limpiar el tab SALIENTE garantiza estado limpio al regresar.
  // NO se llama clearAll() — cada tab es dueño de su estado.
  const setActiveTab = useCallback(
    (tab: TrashRateTab) => {
      // Limpia el tab al que el usuario acaba de salir para que al volver
      // se muestre limpio hasta que presione Consultar.
      switch (activeTab) {
        case 'dashboard':
          dashboardTab.clear();
          break;
        case 'auditReport':
          auditTab.clear();
          break;
        case 'monthlySummary':
          monthlyTab.clear();
          break;
        case 'missingValor':
          missingTab.clear();
          break;
        case 'creditNotes':
          creditTab.clear();
          break;
        case 'topDebtors':
          topDebtorsTab.clear();
          break;
        case 'clientDetail':
          clientDetailTab.clear();
          break;
      }
      setSortConfig(null);
      setMissingPaymentStatus('');
      setCreditCoverage('');
      setPagadosFilters(makeInitialSubTabFilters());
      setPendientesFilters(makeInitialSubTabFilters());
      setEnMoraFilters(makeInitialSubTabFilters());
      setTodosFilters(makeInitialSubTabFilters());
      setTodosPaymentTypeChoice('all'); // ISP: reset del filtro exclusivo de Vista General
      setActiveTabRaw(tab);
    },
    [
      activeTab,
      dashboardTab,
      auditTab,
      monthlyTab,
      missingTab,
      creditTab,
      topDebtorsTab,
      clientDetailTab
    ]
  );

  // Cambio de sub-tab → reset sort + resetea todosPaymentTypeChoice (OCP: nuevo sub-tab = cero cambios extra)
  const setAuditSubTab = useCallback(
    (tab: AuditAccountingSubTab) => {
      // Limpiar datos para que el usuario consulte con los parámetros del nuevo sub-tab.
      auditTab.clear();
      setSortConfig(null);
      setTodosPaymentTypeChoice('all'); // ISP: solo aplica a Todos, pero reset global es inofensivo
      setAuditSubTabRaw(tab);
    },
    [auditTab]
  );

  // ── Estado de carga y error del tab activo ────────────────────────────────
  // ISP: la View solo recibe isLoading/error/hasFetched del tab que está visible.
  const activeTabState = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return dashboardTab;
      case 'auditReport':
        return auditTab;
      case 'monthlySummary':
        return monthlyTab;
      case 'missingValor':
        return missingTab;
      case 'creditNotes':
        return creditTab;
      case 'topDebtors':
        return topDebtorsTab;
      case 'clientDetail':
        return clientDetailTab;
    }
  }, [
    activeTab,
    dashboardTab,
    auditTab,
    monthlyTab,
    missingTab,
    creditTab,
    topDebtorsTab,
    clientDetailTab
  ]);

  // ── Listas de dropdown derivadas de los datos cargados ────────────────────
  const auditPaymentStatusList = useMemo(
    () =>
      Array.from(
        new Set(auditTab.data.map((r) => r.paymentStatus || ''))
      ).filter(Boolean) as string[],
    [auditTab.data]
  );
  const auditDiagnosticList = useMemo(
    () =>
      Array.from(new Set(auditTab.data.map((r) => r.diagnostic || ''))).filter(
        Boolean
      ) as string[],
    [auditTab.data]
  );
  const missingPaymentStatusList = useMemo(
    () =>
      Array.from(
        new Set(missingTab.data.map((r) => r.paymentStatus || ''))
      ).filter(Boolean) as string[],
    [missingTab.data]
  );
  const creditCoverageList = useMemo(
    () =>
      Array.from(
        new Set(creditTab.data.map((r) => r.creditCoverage || ''))
      ).filter(Boolean) as string[],
    [creditTab.data]
  );

  // ── Datos filtrados por tab (filtros locales post-carga) ──────────────────
  const filteredAuditReport = useMemo(() => {
    let r = auditTab.data;
    const { paymentStatus, diagnostic, searchQuery } = activeSubTabFilters;
    if (paymentStatus) r = r.filter((i) => i.paymentStatus === paymentStatus);
    if (diagnostic) r = r.filter((i) => i.diagnostic === diagnostic);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(
        (i) =>
          i.cardId?.toLowerCase().includes(q) ||
          i.customerName?.toLowerCase().includes(q) ||
          i.cadastralKey?.toLowerCase().includes(q)
      );
    }
    // ISP: todosPaymentTypeChoice solo aplica cuando el sub-tab activo es "Todos".
    // Un registro es "pagado" si tiene fecha de pago; "pendiente" si no la tiene.
    if (auditSubTab === 'Todos (Pagados y Pendientes)') {
      if (todosPaymentTypeChoice === 'pagados')
        r = r.filter((i) => i.paymentDate !== null);
      else if (todosPaymentTypeChoice === 'pendientes')
        r = r.filter((i) => i.paymentDate === null);
    }
    return applySortConfig(r, sortConfig);
  }, [auditTab.data, activeSubTabFilters, sortConfig, auditSubTab, todosPaymentTypeChoice]);

  const filteredMonthlySummary = useMemo(
    () => applySortConfig(monthlyTab.data, sortConfig),
    [monthlyTab.data, sortConfig]
  );

  const filteredMissingValor = useMemo(() => {
    let r = missingTab.data;
    if (missingPaymentStatus)
      r = r.filter((i) => i.paymentStatus === missingPaymentStatus);
    return applySortConfig(r, sortConfig);
  }, [missingTab.data, missingPaymentStatus, sortConfig]);

  const filteredCreditNotes = useMemo(() => {
    let r = creditTab.data;
    if (creditCoverage)
      r = r.filter((i) => i.creditCoverage === creditCoverage);
    return applySortConfig(r, sortConfig);
  }, [creditTab.data, creditCoverage, sortConfig]);

  const filteredTopDebtors = useMemo(
    () => applySortConfig(topDebtorsTab.data, sortConfig),
    [topDebtorsTab.data, sortConfig]
  );

  const filteredClientDetail = useMemo(
    () => applySortConfig(clientDetailTab.data, sortConfig),
    [clientDetailTab.data, sortConfig]
  );

  const handleSort = (key: string, direction: 'asc' | 'desc') =>
    setSortConfig({ key, direction });

  // ── Interfaz pública del ViewModel ────────────────────────────────────────
  return {
    t,
    // Estado del tab activo (ISP: la view no necesita saber de otros tabs)
    isLoading: activeTabState.isLoading,
    error: activeTabState.error,
    hasFetched: activeTabState.hasFetched,
    // Navegación
    translatedTabs: TRASH_TABS,
    activeTab,
    setActiveTab,
    // Audit sub-tab
    auditSubTab,
    setAuditSubTab,
    // Rango de fechas compartido
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    top,
    setTop,
    // Filtros del sub-tab activo de auditoría
    activeSubTabFilters,
    setDiagnosticFilter,
    setDateFilter,
    setPaymentStatus,
    setDiagnosticLocal,
    setSearchQuery,
    // Filtro exclusivo de Vista General (Todos)
    todosPaymentTypeChoice,
    setTodosPaymentTypeChoice,
    // Listas de dropdown derivadas
    auditPaymentStatusList,
    auditDiagnosticList,
    // Filtros missingValor
    missingPaymentStatus,
    setMissingPaymentStatus,
    missingPaymentStatusList,
    // Filtros creditNotes
    creditCoverage,
    setCreditCoverage,
    creditCoverageList,
    // Filtros clientDetail
    clientSearchParams,
    setClientSearchParams,
    // Sort / PDF
    sortConfig,
    showPdfPreview,
    setShowPdfPreview,
    // Datos filtrados por tab
    filteredAuditReport,
    filteredMonthlySummary,
    filteredMissingValor,
    filteredCreditNotes,
    filteredTopDebtors,
    filteredClientDetail,
    dashboardKPITrashRate: dashboardTab.data,
    // Acciones
    handleFetch,
    handleSort
  };
};
