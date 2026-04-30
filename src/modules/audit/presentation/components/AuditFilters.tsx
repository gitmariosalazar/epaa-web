import React from 'react';
import styles from '../styles/AuditFilters.module.css';
import { Search, Filter, User, Activity, Database } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { type AuditTab } from '../context/AuditContext';
import { useTranslation } from 'react-i18next';
import { DateRangePicker } from '@/shared/presentation/components/DatePicker/DateRangePicker';

interface AuditFiltersProps {
  activeTab: AuditTab;

  // States
  searchQuery: string;
  searchField: string;
  selectedOperation: string;
  selectedEvent: string;
  userIdFilter: string;
  usernameFilter: string;
  startDate: string;
  endDate: string;
  isLoading: boolean;

  // Actions
  onSearchQueryChange: (val: string) => void;
  onSearchFieldChange: (val: string) => void;
  onOperationChange: (val: string) => void;
  onEventChange: (val: string) => void;
  onUserIdChange: (val: string) => void;
  onUsernameChange: (val: string) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onFetch: () => void;
}

export const AuditFilters: React.FC<AuditFiltersProps> = ({
  activeTab,
  searchQuery,
  searchField,
  selectedOperation,
  selectedEvent,
  userIdFilter,
  usernameFilter,
  startDate,
  endDate,
  isLoading,
  onSearchQueryChange,
  onSearchFieldChange,
  onOperationChange,
  onEventChange,
  onUserIdChange,
  onUsernameChange,
  onStartDateChange,
  onEndDateChange,
  onFetch
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container + ' entry-filters'}>
      {/* -- LEFT: Consultar logic + User ID + Dates -- */}
      <div className={styles.sectionLeft}>
        <Input
          className={styles.filterGroup}
          label="Usuario ID / Username"
          type="text"
          size="compact"
          placeholder="Ej: 15..."
          value={userIdFilter || usernameFilter}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d+$/.test(value)) {
              onUserIdChange(value);
              onUsernameChange('');
            } else {
              onUserIdChange('');
              onUsernameChange(value);
            }
          }}
          leftIcon={<User size={18} />}
        />

        <div className="filter-group">
          <label className="input__label">
            {t('trashRateKPI.filters.dateRange', 'Rango de Fechas')}
          </label>
          <DateRangePicker
            size="compact"
            startDate={startDate}
            endDate={endDate}
            onChange={(start, end) => {
              onStartDateChange(start);
              onEndDateChange(end);
            }}
            disabled={isLoading}
          />
        </div>
        <Button onClick={onFetch} disabled={isLoading} size="md">
          {isLoading ? (
            <div className={styles.spinner} />
          ) : (
            <Search size={18} />
          )}
          {isLoading ? t('common.loading') : t('common.fetch')}
        </Button>
      </div>

      {/* -- RIGHT: Local / Advanced filters -- */}
      <div className={styles.sectionRight}>
        <Select
          className={styles.filterGroup}
          label="Filtrar por"
          size="compact"
          value={searchField}
          onChange={(e) => onSearchFieldChange(e.target.value)}
          leftIcon={<Filter size={18} />}
        >
          <option value="all">Todos los campos</option>
          <option value="username">Nombre de Usuario</option>
          <option value="ipAddress">Dirección IP</option>
          {activeTab === 'data' && <option value="tableName">Tabla</option>}
        </Select>

        <Input
          className={`${styles.filterGroup} ${styles.filterGroupSearch}`}
          label={t('common.search')}
          type="text"
          size="compact"
          placeholder={t('common.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          leftIcon={<Search size={18} />}
        />

        {activeTab === 'data' ? (
          <Select
            className={styles.filterGroup}
            label="Operación"
            size="compact"
            value={selectedOperation}
            onChange={(e) => onOperationChange(e.target.value)}
            leftIcon={<Database size={18} />}
          >
            <option value="">Todas las Op.</option>
            <option value="INSERT">Inseciones (INSERT)</option>
            <option value="UPDATE">Actualizaciones (UPDATE)</option>
            <option value="DELETE">Eliminaciones (DELETE)</option>
          </Select>
        ) : (
          <Select
            className={styles.filterGroup}
            label="Evento"
            size="compact"
            value={selectedEvent}
            onChange={(e) => onEventChange(e.target.value)}
            leftIcon={<Activity size={18} />}
          >
            <option value="">Todos los eventos</option>
            <option value="LOGIN">Inicio de Sesión</option>
            <option value="LOGOUT">Cierre de Sesión</option>
            <option value="LOGIN_FAILED">Fallo de Autenticación</option>
          </Select>
        )}
      </div>
    </div>
  );
};
