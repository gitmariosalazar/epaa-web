import React from 'react';
import { FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import { InputCadastralKey } from '@/shared/presentation/components/Input/InputCadastralKey';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { GrClear } from 'react-icons/gr';
import { FaSchoolLock } from 'react-icons/fa6';

interface ReadingToolbarProps {
  cadastralKeyInput: string;
  setCadastralKeyInput: (val: string) => void;
  handleSearch: () => void;
  handleSave: () => void;
  handleCancel: () => void;
  isLoadingInfo: boolean;
  isSubmitting: boolean;
  readingInfo: ReadingInfo | null;
  method: 'create' | 'update';
}

export const ReadingToolbar: React.FC<ReadingToolbarProps> = ({
  cadastralKeyInput,
  setCadastralKeyInput,
  handleSearch,
  handleSave,
  handleCancel,
  isLoadingInfo,
  isSubmitting,
  readingInfo,
  method
}) => {
  return (
    <div className="cr-toolbar">
      {/* Search Area */}
      <div className="cr-search-area">
        <InputCadastralKey
          className="entry-filter-input"
          placeholder="Ingrese la clave catastral (Ej: 12-364)"
          value={cadastralKeyInput}
          onChange={(val) => setCadastralKeyInput(val)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          leftIcon={<FaSchoolLock />}
        />
        <Button
          className="cr-search-btn"
          onClick={handleSearch}
          disabled={isLoadingInfo}
          leftIcon={<FaSearch />}
          size="sm"
        >
          {isLoadingInfo ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {/* Action Buttons Area */}
      <div className="cr-actions">
        <Button
          className="cr-action-btn"
          color="success"
          onClick={handleSave}
          disabled={
            method === 'create'
              ? !readingInfo?.hasCurrentReading || isSubmitting
              : !readingInfo || isSubmitting
          }
          leftIcon={<FaSave />}
          size="sm"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button
          className="cr-action-btn"
          color="error"
          onClick={handleCancel}
          disabled={!readingInfo}
          leftIcon={<FaTimes />}
          size="sm"
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
          color="warning"
          onClick={handleCancel}
          disabled={!readingInfo}
          leftIcon={<GrClear />}
          size="sm"
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
};
