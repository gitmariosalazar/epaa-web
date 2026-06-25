import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { InputCadastralKey } from '@/shared/presentation/components/Input/InputCadastralKey';
import { Button } from '@/shared/presentation/components/Button/Button';
import { GrClear } from 'react-icons/gr';
import { FaSchoolLock } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

interface SearchToolbarProps {
  cadastralKeyInput: string;
  setCadastralKeyInput: (val: string) => void;
  handleSearch: () => void;
  handleCancel: () => void;
  isLoadingInfo: boolean;
  isSubmitting?: boolean;
  readingInfo: any;
  method?: 'create' | 'update';
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  cadastralKeyInput,
  setCadastralKeyInput,
  handleSearch,
  handleCancel,
  isLoadingInfo,
  readingInfo
}) => {
  const { t } = useTranslation();
  return (
    <div className="cr-toolbar">
      {/* Search Area */}
      <div
        className="cr-search-area"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
          }
        }}
      >
        <InputCadastralKey
          className="entry-filter-input"
          placeholder="Ingrese la clave catastral (Ej: 12-364)"
          value={cadastralKeyInput}
          onChange={(val) => setCadastralKeyInput(val)}
          leftIcon={<FaSchoolLock />}
          size="compact"
          required={false}
        />
        <Button
          type="button"
          onClick={handleSearch}
          className="cr-search-btn"
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
