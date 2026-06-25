import React from 'react';
import { Search, ShieldAlert, RefreshCw, Plus, AlertCircle, Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { IncidentCategoryResponse } from '../../domain/schemas/dtos/response/incident-category-type.response';
import '../styles/IncidentFilters.css';

interface IncidentFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedPriority: string;
  onPriorityChange: (val: string) => void;
  selectedIncidentTypeId: string;
  onIncidentTypeIdChange: (val: string) => void;
  categories: IncidentCategoryResponse[];
  onRefresh: () => void;
  onReportIncident: () => void;
  isLoading: boolean;
}

export const IncidentFilters: React.FC<IncidentFiltersProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedIncidentTypeId,
  onIncidentTypeIdChange,
  categories,
  onRefresh,
  onReportIncident,
  isLoading
}) => {
  const { t } = useTranslation();

  return (
    <div className="incident-filters-wrapper">
      {/* Title & Primary Actions */}
      <div className="incident-filters-header">
        <div className="title-group-incident">
          <ShieldAlert size={24} className="title-icon-incidents" />
          <h2>{t('incidents.title', 'Gestión de Incidentes Técnicos')}</h2>
        </div>
        <div className="toolbar-actions">
          <Button
            variant="outline"
            size="compact"
            onClick={onRefresh}
            isLoading={isLoading}
            leftIcon={<RefreshCw size={16} />}
          >
            {t('common.refresh', 'Refrescar')}
          </Button>
          <Button
            variant="primary"
            size="compact"
            onClick={onReportIncident}
            leftIcon={<Plus size={16} />}
          >
            {t('incidents.actions.reportIncident', 'Reportar Incidente')}
          </Button>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="incident-filters-body">
        {/* Search */}
        <div className="filter-group filter-group--search">
          <label className="filter-label">{t('common.search', 'Búsqueda')}</label>
          <div className="filter-input-wrapper">
            <Input
              type="text"
              placeholder={t('incidents.filters.searchPlaceholder', 'Buscar por descripción, dirección, ID...')}
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              size="compact"
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>

        {/* Status */}
        <div className="filter-group">
          <label className="filter-label">{t('incidents.filters.status', 'Estado')}</label>
          <div className="filter-input-wrapper">
            <Select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              size="compact"
              leftIcon={<AlertCircle size={18} />}
            >
              <option value="">{t('incidents.filters.allStatuses', 'Todos los Estados')}</option>
              <option value="REPORTADO">{t('incidents.status.reported', 'Reportado')}</option>
              <option value="EN_INSPECCION">{t('incidents.status.inInspection', 'En Inspección')}</option>
              <option value="RESUELTO">{t('incidents.status.resolved', 'Resuelto')}</option>
              <option value="FALSO_REPORTE">{t('incidents.status.falseReport', 'Falso Reporte')}</option>
            </Select>
          </div>
        </div>

        {/* Priority */}
        <div className="filter-group">
          <label className="filter-label">{t('incidents.filters.priority', 'Prioridad')}</label>
          <div className="filter-input-wrapper">
            <Select
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              size="compact"
              leftIcon={<ShieldAlert size={18} />}
            >
              <option value="">{t('incidents.filters.allPriorities', 'Todas las Prioridades')}</option>
              <option value="BAJA">{t('incidents.priority.low', 'Baja')}</option>
              <option value="MEDIA">{t('incidents.priority.medium', 'Media')}</option>
              <option value="ALTA">{t('incidents.priority.high', 'Alta')}</option>
              <option value="CRITICA">{t('incidents.priority.critical', 'Crítica')}</option>
            </Select>
          </div>
        </div>

        {/* Type */}
        <div className="filter-group">
          <label className="filter-label">{t('incidents.filters.incidentType', 'Tipo de Incidente')}</label>
          <div className="filter-input-wrapper">
            <Select
              value={selectedIncidentTypeId}
              onChange={(e) => onIncidentTypeIdChange(e.target.value)}
              size="compact"
              leftIcon={<Bookmark size={18} />}
            >
              <option value="">{t('incidents.filters.allTypes', 'Todos los Tipos')}</option>
              {categories.map((cat) => (
                <optgroup key={cat.categoryId} label={cat.categoryName}>
                  {cat.incidentTypes.map((type: any) => (
                    <option key={type.typeCode} value={type.typeCode}>
                      {type.typeName}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
