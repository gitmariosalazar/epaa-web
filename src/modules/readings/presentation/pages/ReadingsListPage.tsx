import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, Calculator, List } from 'lucide-react';

// ── Componentes Compartidos ──────────────────────────────────────────────────
import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';

// ── Importación del Contexto de Lecturas ─────────────────────────────────────
// Importamos nuestro filtro pulido (Filtro Segregado) y el Hook que orquesta (Adaptador)
import {
  ReadingDataFilters,
  type ReadingDataTab
} from '../components/ReadinsFilters';
import { useReadingsList } from '../hooks/useReadingsList';

// Importación de Tipos Limpios del Dominio
import type {
  PendingReadingConnection,
  TakenReadingConnection
} from '../../domain/models/Reading';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

// =========================================================================
// 1. CONFIGURACIÓN ESTÁTICA (OCP - Open/Closed Principle)
// =========================================================================
// Mantenemos la estructura de pestañas generada dentro del componente.

// ── Definición de Columnas de las Tablas (SRP - Responsabilidad Única) ──
// Cada interfaz de modelo del dominio tiene su propia definición de tabla.

// (Migrating columns inside the component to use translations)

// =========================================================================
// 2. COMPONENTE PRINCIPAL (La Página Controller)
// =========================================================================
export const ReadingsListPage: React.FC = () => {
  const { t } = useTranslation();

  const PENDING_COLUMNS: Column<PendingReadingConnection>[] = useMemo(
    () => [
      { header: t('readings.columns.cadastralKey'), accessor: 'cadastralKey' },
      {
        header: t('readings.columns.meter'),
        accessor: (r) => r.meterNumber || t('readings.columns.noMeter')
      },
      {
        header: t('readings.columns.client'),
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.clientName} size="sm" />
            <div>
              <div style={{ fontWeight: 300 }}>{row.clientName}</div>
              <div
                style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}
              >
                {row.cardId}
              </div>
            </div>
          </div>
        )
      },
      { header: t('readings.columns.sector'), accessor: 'sector' },
      { header: t('readings.columns.account'), accessor: 'account' },
      { header: t('readings.columns.address'), accessor: 'address' },
      {
        header: t('readings.columns.average'),
        accessor: (r) => `${r.averageConsumption} m³`
      }
    ],
    [t]
  );

  const TAKEN_COLUMNS: Column<TakenReadingConnection>[] = useMemo(
    () => [
      { header: t('readings.columns.cadastralKey'), accessor: 'cadastralKey' },
      {
        header: t('readings.columns.meter'),
        accessor: (r) => r.meterNumber || t('readings.columns.noMeter')
      },
      {
        header: t('readings.columns.client'),
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.clientName} size="sm" />
            <div>
              <div style={{ fontWeight: 300 }}>{row.clientName}</div>
              <div
                style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}
              >
                {row.cardId}
              </div>
            </div>
          </div>
        )
      },
      {
        header: t('readings.columns.readingDate'),
        accessor: (r) =>
          r.readingDate ? dateService.formatToLocaleString(r.readingDate) : '-'
      },
      {
        header: t('readings.columns.prevReading'),
        accessor: 'previousReading'
      },
      { header: t('readings.columns.currReading'), accessor: 'currentReading' },
      {
        header: t('readings.columns.consumption'),
        accessor: (r) => `${r.calculatedConsumption} m³`
      },
      {
        header: t('readings.columns.novelty'),
        accessor: (r) => r.novelty || t('readings.columns.none')
      }
    ],
    [t]
  );

  const READINGS_TABS: TabItem<ReadingDataTab>[] = useMemo(
    () => [
      {
        id: 'pending',
        label: t('readings.tabs.pending'),
        icon: <Clock size={16} />
      },
      {
        id: 'completed',
        label: t('readings.tabs.completed'),
        icon: <CheckCircle size={16} />
      },
      {
        id: 'estimated',
        label: t('readings.tabs.estimated'),
        icon: <Calculator size={16} />
      },
      { id: 'all', label: t('readings.tabs.all'), icon: <List size={16} /> }
    ],
    [t]
  );

  // ── A. ESTADO DE LOS FILTROS VISUALES ──────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ReadingDataTab>('pending');

  // Asumimos el mes actual como "YYYY-MM"
  const currentMonthStr = dateService.getCurrentMonthString();
  const [month, setMonth] = useState(currentMonthStr);
  const [sector, setSector] = useState('');

  console.log('month', month);
  console.log('sector', sector);

  // ── B. OBTENCIÓN DE DATOS DEL HOOK (Clean Architecture - Controller) ───────
  const {
    pendingReadings,
    completedReadings,
    estimatedReadings,
    isLoading,
    error,
    fetchReadings
  } = useReadingsList();

  // El indicador de progreso circular
  const loadingProgress = useSimulatedProgress(isLoading);

  // ── C. EFECTOS AUTOMÁTICOS ─────────────────────────────────────────────────
  // Cuando se cambia de pestaña, limpiar los sub-filtros visuales (Sector),
  // pero mantener el Mes intacto.
  useEffect(() => {
    setSector('');
  }, [activeTab]);

  // Al montar la página, podemos hacer un fetch inicial automático si lo deseamos.
  // useEffect(() => {
  //   fetchReadings(month);
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── D. FILTRADO LOCAL (Memoria) ────────────────────────────────────────────
  // Utilizamos `useMemo` para no recalcular la lista si solo cambiaron otros estados.
  const filterBySector = <T extends { sector: number }>(list: T[]) => {
    if (!sector) return list;
    return list.filter((item) => String(item.sector).includes(sector));
  };

  const filteredPending = useMemo(
    () => filterBySector(pendingReadings),
    [pendingReadings, sector]
  );
  const filteredCompleted = useMemo(
    () => filterBySector(completedReadings),
    [completedReadings, sector]
  );
  const filteredEstimated = useMemo(
    () => filterBySector(estimatedReadings),
    [estimatedReadings, sector]
  );

  // Unimos todo en caso de que quieran ver todas
  const filteredAll = useMemo(() => {
    return [
      ...filteredPending.map((item) => ({ ...item, _type: 'Pendiente' })),
      ...filteredCompleted.map((item) => ({ ...item, _type: 'Tomada' }))
    ];
  }, [filteredPending, filteredCompleted]);

  // ── E. RENDERIZACIÓN DE LA VISTA ───────────────────────────────────────────
  return (
    <div
      className="entry-data-page"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* 1. SECCIÓN DE PESTAÑAS */}
      <Tabs
        tabs={READINGS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 2. SECCIÓN DE FILTROS (Inyectando Props por ISP) */}
      <ReadingDataFilters
        activeTab={activeTab}
        month={month}
        onMonthChange={setMonth}
        sector={sector}
        onSectorChange={setSector}
        onFetch={() => fetchReadings(activeTab, month, sector)}
        isLoading={isLoading}
      />

      {/* 3. SECCIÓN DE RESULTADOS O ERRORES */}
      {error ? (
        <div
          className="entry-data-error"
          style={{ color: 'red', marginTop: '1rem' }}
        >
          <strong>Error: </strong> {error}
        </div>
      ) : isLoading ? (
        <div
          className="entry-data-loading"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '3rem'
          }}
        >
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Cargando datos...')}
          />
        </div>
      ) : (
        /* 4. RENDERIZADO DE TABLAS DINÁMICO SEGÚN LA PESTAÑA ACTIVA */
        <>
          {activeTab === 'pending' && (
            <Table<PendingReadingConnection>
              data={filteredPending}
              columns={PENDING_COLUMNS}
              isLoading={isLoading}
              pagination
              pageSize={10}
            />
          )}

          {activeTab === 'completed' && (
            <Table<TakenReadingConnection>
              data={filteredCompleted}
              columns={TAKEN_COLUMNS}
              isLoading={isLoading}
              pagination
              pageSize={10}
            />
          )}

          {activeTab === 'estimated' && (
            <Table<TakenReadingConnection>
              data={filteredEstimated}
              columns={TAKEN_COLUMNS}
              isLoading={isLoading}
              pagination
              pageSize={10}
            />
          )}

          {activeTab === 'all' && (
            <Table<any>
              data={filteredAll}
              columns={[
                { header: 'Estado', accessor: '_type' },
                { header: 'Clave Catastral', accessor: 'cadastralKey' },
                { header: 'Cliente', accessor: 'clientName' },
                { header: 'Medidor', accessor: (r) => r.meterNumber || 'S/M' }
              ]}
              isLoading={isLoading}
              pagination
              pageSize={10}
            />
          )}
        </>
      )}
    </div>
  );
};
