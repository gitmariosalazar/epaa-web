import type { AuditSector } from '@/modules/readings/domain/models/ReadingAudit';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Target
} from 'lucide-react';
import React from 'react';
import './DashBoardProgressReadings.css';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { ConvertMonth } from '@/shared/utils/datetime/Converts';

interface DashBoardProgressReadingsProps {
  data: AuditSector[];
  loading: boolean;
}

export const DashBoardProgressReadings: React.FC<
  DashBoardProgressReadingsProps
> = ({ data, loading }) => {
  const totalData = data.reduce(
    (acc, item) => {
      return {
        expectedTotal: acc.expectedTotal + item.expectedTotal,
        completed: acc.completed + item.completedTotal,
        pendings: acc.pendings + item.pendingTotal,
        advanced: acc.advanced + item.progressPercentage
      };
    },
    { expectedTotal: 0, completed: 0, pendings: 0, advanced: 0 }
  );

  const totalPercentage =
    totalData.expectedTotal > 0
      ? (totalData.completed / totalData.expectedTotal) * 100
      : 0;

  if (loading) {
    return (
      <div className="db-progress-loading">
        <CircularProgress label="Cargando..." />
      </div>
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        icon={<Search />}
        message="Por el momento no hay datos para mostrar"
        description="Intenta ajustar los filtros o parámetros para ver los datos"
      />
    );
  }

  const formatNumber = (num: number) =>
    new Intl.NumberFormat('es-EC').format(num);

  return (
    <div className="db-progress-container fade-in">
      <div className="db-progress-header">
        <h2 className="db-progress-title">Progreso de Toma de Lecturas</h2>
        <div className="progress-period">
          <ColorChip
            label={`Periodo: ${ConvertMonth(
              data[0].readingMonth.toString().split('-')[1]
            )} - ${data[0].readingMonth.toString().split('-')[0]}`.toUpperCase()}
            icon={<Calendar />}
            color="teal"
            borderRadius="10px"
          />
        </div>
        <span
          className="db-progress-badge"
          style={{
            color: getTrafficLightColor(totalPercentage),
            borderColor: getTrafficLightColor(totalPercentage)
          }}
        >
          {totalPercentage.toFixed(2)}% Completado
        </span>
      </div>

      <div className="db-progress-bar-wrapper">
        <ProgressBar
          value={totalPercentage}
          height="1.25rem"
          widthSize="full"
          color={getTrafficLightColor(totalPercentage)}
        />
      </div>

      <div className="db-progress-grid">
        {/* Total Esperado */}
        <div className="db-progress-card">
          <div className="db-progress-card-top">
            <h4>Total Esperado</h4>
            <div
              className="db-progress-card-icon"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: '#6366f1'
              }}
            >
              <Target strokeWidth={2} />
            </div>
          </div>
          <div className="db-progress-card-body">
            <h3 style={{ color: '#6366f1' }}>
              {formatNumber(totalData.expectedTotal)}
            </h3>
            <p>Lecturas proyectadas</p>
          </div>
        </div>

        {/* Total Completado */}
        <div className="db-progress-card">
          <div className="db-progress-card-top">
            <h4>Total Completado</h4>
            <div
              className="db-progress-card-icon"
              style={{
                backgroundColor: 'rgba(74, 222, 128, 0.15)',
                color: '#4ade80'
              }}
            >
              <CheckCircle2 strokeWidth={2} />
            </div>
          </div>
          <div className="db-progress-card-body">
            <h3 style={{ color: '#4ade80' }}>
              {formatNumber(totalData.completed)}
            </h3>
            <p>Lecturas efectivas</p>
          </div>
        </div>

        {/* Total Pendiente */}
        <div className="db-progress-card">
          <div className="db-progress-card-top">
            <h4>Total Pendiente</h4>
            <div
              className="db-progress-card-icon"
              style={{
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                color: '#fbbf24'
              }}
            >
              <Clock strokeWidth={2} />
            </div>
          </div>
          <div className="db-progress-card-body">
            <h3 style={{ color: '#fbbf24' }}>
              {formatNumber(totalData.pendings)}
            </h3>
            <p>Por leer (Pendientes)</p>
          </div>
        </div>

        {/* Total Avanzado */}
        <div className="db-progress-card">
          <div className="db-progress-card-top">
            <h4>Avance General</h4>
            <div
              className="db-progress-card-icon"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6'
              }}
            >
              <BarChart3 strokeWidth={2} />
            </div>
          </div>
          <div className="db-progress-card-body">
            <h3 style={{ color: '#3b82f6' }}>{totalPercentage.toFixed(2)}%</h3>
            <p>Porcentaje de cobertura</p>
          </div>
        </div>
      </div>
    </div>
  );
};
