
import { useTranslation } from 'react-i18next';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { Column } from './Table';
import './TableSortModal.css';

interface TableSortModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: Column<T>[];
  sortConfig: { key: keyof T | string; direction: 'asc' | 'desc' } | null;
  onSort: (key: keyof T | string, direction: 'asc' | 'desc') => void;
  anchorElement?: HTMLElement | null;
}

export const TableSortModal = <T extends { [key: string]: any }>({
  isOpen,
  onClose,
  columns,
  sortConfig,
  onSort,
  anchorElement
}: TableSortModalProps<T>) => {
  const { t } = useTranslation();

  const sortableColumns = columns.filter((c) => c.sortable);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('common.sortBy', 'Ordenar por')}
      size="sm"
      anchorElement={anchorElement}

    >
      <div className="table-sort-modal-content">
        {sortableColumns.map((col, index) => {
          const sortKey = col.sortKey || col.id || (typeof col.accessor === 'string' ? col.accessor : null);
          if (!sortKey) return null;

          const isActive = sortConfig?.key === sortKey;
          const isAsc = isActive && sortConfig?.direction === 'asc';
          const isDesc = isActive && sortConfig?.direction === 'desc';

          return (
            <div key={String(sortKey)} className={`table-sort-row ${isActive ? 'active-sort' : ''}`}>
              <span className="table-sort-label">
                {typeof col.header === 'string' ? col.header : `Columna ${index + 1}`}
              </span>
              <div className="table-sort-actions">
                <Button
                  variant={isAsc ? 'dashed' : 'outline'}
                  color={isAsc ? 'primary' : 'neutral'}
                  size="sm"
                  leftIcon={<ArrowUp size={16} />}
                  onClick={() => {
                    onSort(sortKey as string, 'asc');
                    onClose();
                  }}
                >
                  {t('common.sortAsc', 'Asc')}
                </Button>
                <Button
                  variant={isDesc ? 'dashed' : 'outline'}
                  color={isDesc ? 'primary' : 'neutral'}
                  size="sm"
                  leftIcon={<ArrowDown size={16} />}
                  onClick={() => {
                    onSort(sortKey as string, 'desc');
                    onClose();
                  }}
                >
                  {t('common.sortDesc', 'Desc')}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
