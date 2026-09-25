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
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';
import { FcPrint } from 'react-icons/fc';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

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
  reportRangeDate: { start: string; end: string } | null;
  onReportRangeDateChange: (start: string, end: string) => void;
  onPrintAllNotifications?: () => void;
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
  },
  {
    value: 'reportDate',
    labelKey: 'common.reportDate',
    labelDefault: 'Fecha de reporte'
  }, {
    value: 'reportRangeDate',
    labelKey: 'common.reportRangeDate',
    labelDefault: 'Rango de fechas'
  }, {
    value: 'incident_type',
    labelKey: 'common.incidentType',
    labelDefault: 'Tipo de Incidente'
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
  isLoading,
  reportRangeDate,
  onReportRangeDateChange,
  onPrintAllNotifications
}) => {
  const { t } = useTranslation();

  return (
    <div className="incident-filters-wrapper incident-filters-wrapper--print">
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
              size="small"
              leftIcon={<Search size={18} />}
            />
          </div>
        </div>
        <Divider orientation='vertical' variant='dashed' thickness='medium' />
        <div className="filter-group">
          <label className="filter-label">{t('incidents.filters.searchField', 'Buscar por')}</label>
          <Select
            className="conn-filter-group conn-filter-group--search-field"
            size="small"
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
          <label className="filter-label">{
            searchField === 'reportDate' ? t('common.reportDate', 'Fecha de reporte') :
              searchField === 'reportRangeDate' ? t('common.reportRangeDate', 'Rango de fechas') :
                searchField === 'sector' ? t('common.sector', 'Sector') :
                  searchField === 'reference' ? t('common.reference', 'Referencia') :
                    searchField === 'connectionId' ? t('common.connectionId', 'ID Acometida') :
                      searchField === 'incident_type' ? t('common.incidentType', 'Tipo de Incidente') :
                        t('common.search', 'Búsqueda')
          }</label>
          {
            searchField === 'reportDate' ? (
              <DatePicker
                size="small"
                value={searchQuery}
                onChange={(val) => onSearchQueryChange(val)}
              />
            ) : searchField === 'reportRangeDate' ? (
              <div>
                <DateRangePicker
                  size="small"
                  startDate={reportRangeDate?.start || ''}
                  endDate={reportRangeDate?.end || ''}
                  onChange={(start, end) => onReportRangeDateChange(start, end)}
                />
              </div>
            ) : searchField === 'incident_type' ? (
              <Select
                size="small"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                leftIcon={<MdCategory size={18} />}
              >
                <option value="">{t('incidents.filters.allIncidentTypes', 'Todos los tipos')}</option>
                {categories.flatMap(c => c.incidentTypes || []).map((type) => (
                  <option key={type.typeCode} value={type.typeCode}>
                    {type.typeName}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                type={'text'}
                size="small"
                placeholder={searchField === 'sector' ? t('common.sector', 'Sector') : searchField === 'reference' ? t('common.reference', 'Referencia') : searchField === 'connectionId' ? t('common.connectionId', 'ID Acometida') : t('common.searchPlaceholder', 'Buscar por descripción, dirección, ID...')}
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                leftIcon={<Search size={18} />}
              />
            )
          }
        </div>
        {/* Status */}
        <div className="filter-group">
          <label className="filter-label">{t('incidents.filters.status', 'Estado')}</label>
          <div className="filter-input-wrapper">
            <Select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              size="small"
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
              size="small"
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
              size="small"
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
          size="xs"
          onClick={onConsultar}
          isLoading={isLoading}
          leftIcon={<RefreshCw size={16} />}
        >
          {t('common.consult', 'Consultar')}
        </Button>
      </div>
      <div className="button-container-print">
        <Tooltip content={'Imprimir notificaciones de medidores Clandestinos.'} position="top"
          followCursor={false}
        >
          <Button
            variant="ghost"
            size="small"
            onClick={onPrintAllNotifications}
            isLoading={isLoading}
            leftIcon={<FcPrint size={16} />}
            iconOnly
            circle
          />
        </Tooltip>
      </div>
    </div>
  );
};
