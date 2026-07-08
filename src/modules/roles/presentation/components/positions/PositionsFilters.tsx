import React from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';

interface PositionsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onCreateClick: () => void;
}

export const PositionsFilters: React.FC<PositionsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onCreateClick
}) => {
  return (
    <div className="entry-filters">
      <div className="entry-filter-group entry-filter-group--search">
        <div className="entry-filter-input-wrapper">
          <Input
            type="text"
            placeholder="Buscar cargos..."
            value={searchTerm}
            leftIcon={<Search size={18} />}
            size="small"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div
        className="entry-filter-group trash-report-filter-right"
        style={{ flex: '0 1 auto', width: 'auto', gap: '8px' }}
      >
        <Button
          variant="outline"
          onClick={onRefresh}
          size="compact"
          style={{ height: '30px' }}
          leftIcon={<RefreshCw size={14} />}
        >
          Refresh
        </Button>
        <Button
          onClick={onCreateClick}
          leftIcon={<Plus size={14} />}
          size="compact"
          style={{ height: '30px' }}
          variant="dashed"
          color="green"
        >
          Nuevo Cargo
        </Button>
      </div>
    </div>
  );
};
