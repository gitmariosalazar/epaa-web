import React from 'react';
import { Search, ShieldAlert, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { IncidentCategoryResponse } from '../../domain/schemas/dtos/response/incident-category-type.response';
import '../styles/IncidentFilters.css';
import { MdCategory } from 'react-icons/md';
import { Divider } from '@/shared/presentation/components/divider/Divider';
import { FaFilter } from 'react-icons/fa';

interface IncidentFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  searchField: string;
  onSearchFieldChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedPriority: string;
  onPriorityChange: (val: string) => void;
  selectedCategoryId: number | null;
  onCategoryIdChange: (val: number) => void;
  categories: IncidentCategoryResponse[];
  onConsultar: () => void;
  onReportIncident: () => void;
  isLoading: boolean;
}

const SEARCH_FIELDS = [
  { value: 'all', labelKey: 'common.all', labelDefault: 'Todos los campos' },
  {
    value: 'sector',
    labelKey: 'common.sector',
    labelDefault: 'Sector'
  },
  {
    value: 'reference',
    labelKey: 'common.reference',
    labelDefault: 'Referencia'
  },
  {
    value: 'connectionId',
    labelKey: 'common.connectionId',
    labelDefault: 'ID Acometida'
  }
];

export const IncidentFilters: React.FC<IncidentFiltersProps> = ({
  searchQuery,
  onSearchQueryChange,
  searchField,
  onSearchFieldChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedCategoryId,
  onCategoryIdChange,
  categories,
  onConsultar,
  isLoading
}) => {
  const { t } = useTranslation();

  return (
    <div className="incident-filters-wrapper">
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
        <Divider orientation='vertical' variant='dashed' thickness='medium' />
        <div className="filter-group">
          <label className="filter-label">{t('incidents.filters.searchField', 'Buscar por')}</label>
          <Select
            className="conn-filter-group conn-filter-group--search-field"
            size="compact"
            value={searchField}
            onChange={(e) => onSearchFieldChange(e.target.value)}
            leftIcon={<FaFilter size={18} />}
          >
            {SEARCH_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {t(field.labelKey, field.labelDefault)}
              </option>
            ))}
          </Select>
        </div>

        <div className="filter-group">
          <label className="filter-label">{t('common.search', 'Búsqueda')}</label>
          <Input
            type="text"
            size="compact"
            placeholder={t('common.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            leftIcon={<Search size={18} />}
          />
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

        {/* Incident Type */}
        <div className="filter-group">
          <label className="filter-label">{t('incidents.filters.incidentType', 'Categoría')}</label>
          <div className="filter-input-wrapper">
            <Select
              value={selectedCategoryId?.toString() ?? ''}
              onChange={(e) => onCategoryIdChange(Number(e.target.value))}
              size="compact"
              leftIcon={<MdCategory size={18} />}
            >
              <option value="">{t('incidents.filters.allCategories', 'Todas las Categorías')}</option>

              {categories.map((category) => (
                <option
                  key={category.categoryId}
                  value={category.categoryId}
                >
                  {category.categoryName}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <Button
          variant="outline"
          size="compact"
          onClick={onConsultar}
          isLoading={isLoading}
          leftIcon={<RefreshCw size={16} />}
        >
          {t('common.consult', 'Consultar')}
        </Button>
      </div>
    </div>
  );
};
