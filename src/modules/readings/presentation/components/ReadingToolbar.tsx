import React from 'react';
import { FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import { InputCadastralKey } from '@/shared/presentation/components/Input/InputCadastralKey';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import { GrClear } from 'react-icons/gr';
import { FaSchoolLock } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
          size="compact"
        />
        <Button
          className="cr-search-btn"
          onClick={handleSearch}
          disabled={isLoadingInfo}
          leftIcon={<FaSearch />}
          size="sm"
        >
          {isLoadingInfo ? t('common.searching') : t('common.search')}
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
