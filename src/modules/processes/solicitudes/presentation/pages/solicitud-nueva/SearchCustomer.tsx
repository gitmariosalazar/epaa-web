import React, { useState } from 'react';
import { Search, UserCheck, Hash, UserPlus } from 'lucide-react';
import type { SolicitudForm } from './types';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';

interface SearchCustomerProps {
  cardIdOrRuc?: string;
  form: SolicitudForm;
  onCardIdOrRucChange: (cardIdOrRuc: string) => void;
  onCustomerFound?: (customer: any) => void;
  onClickSearch: (cardIdOrRuc: string, identificationType: string) => void;
}

export const SearchCustomer: React.FC<SearchCustomerProps> = ({
  form,
  onCardIdOrRucChange,
  onClickSearch
}) => {
  const { t } = useTranslation();
  const [identificationType, setIdentificationType] = useState('CED');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onClickSearch(form.cedula, identificationType);
    }
  };

  const getDocLabel = () => {
    switch (identificationType) {
      case 'CED':
        return t('customers.form.idTypeCED', 'Cédula');
      case 'RUC':
        return t('customers.form.idTypeRUC', 'RUC');
      case 'PAS':
        return t('customers.form.idTypePAS', 'Pasaporte');
      default:
        return t('customers.form.ruc', 'Identificación');
    }
  };

  return (
    <div className="search-customer">
      <div className="search-customer__row">
        <Select
          label={t('customers.form.identificationType', 'Tipo Doc.')}
          name="identificationType"
          value={identificationType}
          onChange={(e) => setIdentificationType(e.target.value)}
          size="compact"
          leftIcon={<UserCheck size={14} />}
          width="130px"
        >
          <option value="CED">{t('customers.form.idTypeCED', 'Cédula')}</option>
          <option value="RUC">{t('customers.form.idTypeRUC', 'RUC')}</option>
          <option value="PAS">
            {t('customers.form.idTypePAS', 'Pasaporte')}
          </option>
        </Select>

        <Input
          label={`${getDocLabel()} *`}
          name="companyRuc"
          value={form.cedula}
          onChange={(e) => onCardIdOrRucChange(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          type="text"
          size="compact"
          leftIcon={<Hash size={14} />}
          className="search-customer__input"
          placeholder="Escribe la identificación..."
        />

        <Button
          size="sm"
          variant="primary"
          onClick={() => onClickSearch(form.cedula, identificationType)}
          leftIcon={<Search size={14} />}
        >
          Buscar
        </Button>
        <Button
          size="sm"
          variant="dashed"
          onClick={() => onClickSearch(form.cedula, identificationType)}
          leftIcon={<UserPlus size={14} />}
        >
          Nuevo
        </Button>
      </div>
    </div>
  );
};
