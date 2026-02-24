import React from 'react';
import { FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { GrClear } from 'react-icons/gr';

interface ReadingToolbarProps {
  cadastralKeyInput: string;
  setCadastralKeyInput: (val: string) => void;
  handleSearch: () => void;
  handleSave: () => void;
  handleCancel: () => void;
  isLoadingInfo: boolean;
  isSubmitting: boolean;
  readingInfo: ReadingInfo | null;
}

export const ReadingToolbar: React.FC<ReadingToolbarProps> = ({
  cadastralKeyInput,
  setCadastralKeyInput,
  handleSearch,
  handleSave,
  handleCancel,
  isLoadingInfo,
  isSubmitting,
  readingInfo
}) => {
  return (
    <div className="cr-toolbar">
      {/* Search Area */}
      <div className="cr-search-area">
        <Input
          className="cr-search-input"
          placeholder="Ingrese la clave catastral (Ej: 12-364)"
          value={cadastralKeyInput}
          onChange={(e) => setCadastralKeyInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button
          className="cr-search-btn"
          onClick={handleSearch}
          disabled={isLoadingInfo}
          leftIcon={<FaSearch />}
        >
          {isLoadingInfo ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {/* Action Buttons Area */}
      <div className="cr-actions">
        <Button
          className="cr-action-btn"
          variant="success"
          onClick={handleSave}
          disabled={!readingInfo?.hasCurrentReading || isSubmitting}
          leftIcon={<FaSave />}
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button
          className="cr-action-btn"
          variant="danger"
          onClick={handleCancel}
          disabled={!readingInfo}
          leftIcon={<FaTimes />}
        >
          Cancelar
        </Button>
        {/*
        <Button
          className="cr-action-btn cr-action-btn-disabled"
          variant="info"
          disabled
          leftIcon={<FaBriefcase />}
        >
          O. Trabajo
        </Button>
        */}

        <Button
          className="cr-action-btn"
          variant="warning"
          onClick={handleCancel}
          disabled={!readingInfo}
          leftIcon={<GrClear />}
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
};
