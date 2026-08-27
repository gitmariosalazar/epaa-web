import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../Modal/Modal';
import { Select } from '../Input/Select';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { Plus, Filter } from 'lucide-react';
import type { Column } from './Table';
import type { FilterModel, FilterOperator } from './types/TableFilter';
import './TableFilterModal.css';
import { MdDeleteForever } from 'react-icons/md';
import { Tooltip } from '../common/Tooltip/Tooltip';
import { GrClear } from 'react-icons/gr';
import { FaCheck } from 'react-icons/fa';

interface TableFilterModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: Column<T>[];
  initialFilters: FilterModel[];
  onApply: (filters: FilterModel[]) => void;
  getColumnKey: (col: Column<T>, index: number) => string;
  anchorElement?: HTMLElement | null;
}

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'greaterThan', label: 'Greater than' },
  { value: 'lessThan', label: 'Less than' },
  { value: 'isEmpty', label: 'Is empty' },
  { value: 'isNotEmpty', label: 'Is not empty' }
];

export const TableFilterModal = <T extends { [key: string]: any }>({
  isOpen,
  onClose,
  columns,
  initialFilters,
  onApply,
  getColumnKey,
  anchorElement
}: TableFilterModalProps<T>) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterModel[]>([]);

  const filterableColumns = React.useMemo(() => columns.filter(
    (col) => col.filterValueGetter || typeof col.accessor === 'string' || col.id
  ), [columns]);

  const columnOptions = React.useMemo(() => filterableColumns.map((col, index) => ({
    value: getColumnKey(col, index),
    label: typeof col.header === 'string' ? col.header : `Column ${index + 1}`
  })), [filterableColumns, getColumnKey]);

  // Sync internal state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialFilters.length > 0) {
        setFilters([...initialFilters]);
      } else {
        // Automatically add one empty filter by default if none exist
        const colField = columnOptions.length > 0 ? String(columnOptions[0].value) : '';
        setFilters([{
          id: Math.random().toString(36).substr(2, 9),
          columnField: colField,
          operatorValue: 'contains',
          value: ''
        }]);
      }
    }
  }, [isOpen, initialFilters, columnOptions]);

  const handleAddFilter = () => {
    const newFilter: FilterModel = {
      id: Math.random().toString(36).substr(2, 9),
      columnField:
        columnOptions.length > 0 ? String(columnOptions[0].value) : '',
      operatorValue: 'contains',
      value: ''
    };
    setFilters([...filters, newFilter]);
  };

  const handleRemoveFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id));
  };

  const handleChangeFilter = (
    id: string,
    field: keyof FilterModel,
    value: any
  ) => {
    setFilters(
      filters.map((f) => {
        if (f.id === id) {
          // If changing operator to empty/not empty, clear the value
          if (
            field === 'operatorValue' &&
            (value === 'isEmpty' || value === 'isNotEmpty')
          ) {
            return { ...f, [field]: value, value: '' };
          }
          return { ...f, [field]: value };
        }
        return f;
      })
    );
  };

  const handleApply = () => {
    // Clean up empty filters before applying (except empty operators)
    const validFilters = filters.filter(
      (f) =>
        f.operatorValue === 'isEmpty' ||
        f.operatorValue === 'isNotEmpty' ||
        f.value !== ''
    );
    onApply(validFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters([]);
    onApply([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      anchorElement={anchorElement}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} />
          {t('common.table.filters', 'Filters')}
        </div>
      }
      size="lg"
    >
      <div className="table-filter-modal-content">
        {filters.length === 0 ? (
          <div className="table-filter-empty">
            <p>{t('common.table.noActiveFilters', 'No active filters.')}</p>
          </div>
        ) : (
          <div className="table-filter-list">
            {filters.map((filter) => {
              const requiresValue =
                filter.operatorValue !== 'isEmpty' &&
                filter.operatorValue !== 'isNotEmpty';

              return (
                <div key={filter.id} className="table-filter-row">
                  <Tooltip
                    content="Eliminar filtro"
                    themeColor="error"
                    followCursor={false}
                  >
                    <Button
                      variant="outline"
                      color="error"
                      onClick={() => handleRemoveFilter(filter.id)}
                      className="table-filter-remove-btn"
                      circle
                    >
                      <MdDeleteForever size={20} />
                    </Button>
                  </Tooltip>

                  <div className="table-filter-field">
                    <label>Column</label>
                    <Select
                      value={filter.columnField}
                      onChange={(e) =>
                        handleChangeFilter(
                          filter.id,
                          'columnField',
                          e.target.value
                        )
                      }
                      options={columnOptions}
                      size="small"
                      width="100%"
                    />
                  </div>

                  <div className="table-filter-field">
                    <label>Operator</label>
                    <Select
                      value={filter.operatorValue}
                      onChange={(e) =>
                        handleChangeFilter(
                          filter.id,
                          'operatorValue',
                          e.target.value as FilterOperator
                        )
                      }
                      options={OPERATORS}
                      size="small"
                      width="100%"
                    />
                  </div>

                  {requiresValue && (
                    <div className="table-filter-field" style={{ flex: 2 }}>
                      <label>Value</label>
                      <Input
                        value={filter.value}
                        onChange={(e) =>
                          handleChangeFilter(filter.id, 'value', e.target.value)
                        }
                        placeholder="Filter value"
                        size="small"
                        style={{ width: '100%' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="table-modal-filter-actions">
          <Button
            variant="subtle"
            color="primary"
            size="xs"
            leftIcon={<Plus size={16} />}
            onClick={handleAddFilter}
          >
            {t('common.table.addFilter', 'Add Filter')}
          </Button>
          <div className="table-modal-footer-actions-filters">
            <Button leftIcon={<GrClear size={16} />} size="xs" variant="dashed" color="warning" onClick={handleClear}>
              {t('common.clear', 'Clear All')}

            </Button>
            <Button leftIcon={<FaCheck size={14} />} size="xs" variant="dashed" color="success" onClick={handleApply}>
              {t('common.apply', 'Apply')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
